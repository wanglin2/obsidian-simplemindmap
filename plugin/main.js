import {
  addIcon,
  Plugin,
  TFolder,
  Notice,
  MarkdownView,
  WorkspaceLeaf,
  Workspace,
  getLanguage
} from 'obsidian'
import './style.css'
import SmmEditView from './SmmEditView.js'
import {
  SMM_VIEW_TYPE,
  SIDE_BAR_ICON,
  SMM_TAG,
  DEFAULT_SETTINGS,
  IGNORE_CHECK_SMM
} from './ob/constant.js'
import {
  createDefaultText,
  createDefaultMindMapData
} from './ob/metadataAndMarkdown.js'
import { around, dedupe } from 'monkey-around'
import { getUidFromSource, formatFileName } from './ob/utils.js'
import MarkdownPostProcessor from './ob/MarkdownPostProcessor.js'
import SmmSettingTab from './ob/SmmSettingTab.js'
import { langList } from './src/config/zh'
import i18n from 'i18next'
import enTranslations from './locales/en.json'
import zhTranslations from './locales/zh.json'
import viTranslations from './locales/vi.json'
import zhtwTranslations from './locales/zhtw.json'
import Commands from './ob/Commands.js'
import markdown from 'simple-mind-map/src/parse/markdown.js'
import Menus from './ob/Menus.js'

export default class SimpleMindMapPlugin extends Plugin {
  async onload() {
    await this._addSetting()

    i18n.init({
      lng: getLanguage() || 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: enTranslations },
        zh: { translation: zhTranslations },
        vi: { translation: viTranslations },
        ['zh-TW']: { translation: zhtwTranslations }
      }
    })

    addIcon('smm-icon', SIDE_BAR_ICON)

    this.registerView(SMM_VIEW_TYPE, leaf => new SmmEditView(leaf, this))

    this._createSmmFile = this._createSmmFile.bind(this)
    this.addRibbonIcon(
      'smm-icon',
      this._t('action.createMindMap'),
      this._createSmmFile
    )

    this.commands = new Commands(this)

    this.menus = new Menus(this)

    this._registerMonkeyPatches()

    this._switchToSmmAfterLoad()

    this._initStatusBar()

    this.markdownPostProcessor = new MarkdownPostProcessor(this)
    this.markdownPostProcessor.register()

    this.fileToSubpathMap = {}
    this.noSaveOnClose = false
  }

  async _createSmmFile(folderPath = '', callback) {
    try {
      if (typeof folderPath !== 'string' || folderPath === '/') {
        folderPath = ''
      }
      const { fileNameFormat } = this.settings
      folderPath = this._getCreateFolderPath(folderPath)
      await this._ensureDirectoryExists(folderPath)
      const { vault } = this.app
      const filePath = `${
        folderPath ? folderPath + '/' : ''
      }${formatFileName(fileNameFormat, { ignores: ['notename'] })}.smm.md`
      const fileContent = createDefaultText(
        filePath,
        this._getCreateDefaultMindMapOptions()
      )
      try {
        const existingFile = vault.getFileByPath(filePath)
        if (existingFile) {
          new Notice(this._t('tip.fileExist'))
        } else {
          await vault.create(filePath, fileContent)
          if (callback && typeof callback === 'function') {
            callback(filePath)
          } else {
            await this.app.workspace.openLinkText(filePath, '', true)
          }
        }
      } catch (error) {
        new Notice(this._t('tip.createMindMapFail'))
      }
    } catch (error) {
      new Notice(this._t('tip.createMindMapFail'))
    }
  }

  _getCreateFolderPath(folderPath) {
    if (folderPath) return folderPath
    const { filePathType, filePath } = this.settings
    switch (filePathType) {
      case 'root':
        return ''
      case 'custom':
        return filePath
      case 'currentFileFolder':
        return this._getActiveFileDirectory()
      default:
        return ''
    }
  }

  async _getAvailableFilaName(filePath, extCount = 1) {
    let counter = 1
    while (await this.app.vault.adapter.exists(filePath)) {
      const parts = filePath.split('.')
      const extList = []
      for (let i = 0; i < extCount; i++) {
        extList.push(parts.pop())
      }
      const ext = extList.reverse().join('.')
      filePath = `${parts.join('.')}_${counter}.${ext}`
      counter++
    }
    return filePath
  }

  async _addSetting() {
    await this._loadSettings()
    this.addSettingTab(new SmmSettingTab(this.app, this))
  }

  async _loadSettings() {
    const data = await this.loadData()
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data || {})
    const obLang = getLanguage()
    const target = langList.find(
      item => item.value === obLang || item.alias === obLang
    )
    this.settings.lang = target ? target.value : 'en'
  }

  async _saveSettings() {
    await this.saveData(this.settings)
  }

  _registerMonkeyPatches() {
    const key = 'https://github.com/wanglin2/mind-map'
    this.register(
      around(Workspace.prototype, {
        getActiveViewOfType(old) {
          return dedupe(key, old, function(...args) {
            const result = old && old.apply(this, args)
            if (args[1] === IGNORE_CHECK_SMM) {
              return result
            }
            const currentView = this.app?.workspace?.activeLeaf?.view
            if (!currentView || !(currentView instanceof SmmEditView))
              return result
          })
        }
      })
    )
    if (!this.app.plugins?.plugins?.['obsidian-hover-editor']) {
      this.register(
        around(WorkspaceLeaf.prototype, {
          getRoot(old) {
            return function() {
              const top = old.call(this)
              return top.getRoot === this.getRoot ? top : top.getRoot()
            }
          }
        })
      )
    }
    const self = this
    this.register(
      around(WorkspaceLeaf.prototype, {
        detach(next) {
          return function() {
            return next.apply(this)
          }
        },
        setViewState(next) {
          return function(state, ...rest) {
            if (
              (state.state?.isSwitchToMarkdownViewFromSmmView ||
                ['preview', 'source'].includes(state.state?.mode)) &&
              !state.state?.isPreviewToMindMapViewFromMdView
            ) {
              return next.apply(this, [state, ...rest])
            }
            if (
              self._loaded &&
              state.type === 'markdown' &&
              state.state?.file
            ) {
              const curFilePath = state.state.file
              if (self._isSmmFile(curFilePath)) {
                let isStop = false
                if (rest && rest[0]) {
                  if (rest[0].subpath) {
                    self.fileToSubpathMap[curFilePath] = rest[0].subpath
                  } else if (
                    rest[0].match &&
                    rest[0].match.matches.length > 0
                  ) {
                    const uid = getUidFromSource(rest[0])
                    if (uid) {
                      const existLeaf = this.app.workspace
                        .getLeavesOfType(SMM_VIEW_TYPE)
                        .find(leaf => {
                          const file = leaf.view.file
                            ? leaf.view.file.path
                            : leaf.view.state.file
                          return file && file === curFilePath
                        })
                      if (existLeaf) {
                        if (
                          existLeaf.view instanceof SmmEditView &&
                          existLeaf.view.jumpToNodeByUid
                        ) {
                          existLeaf.view.jumpToNodeByUid(uid)
                        } else {
                          self.fileToSubpathMap[curFilePath] = uid
                        }
                        this.app.workspace.setActiveLeaf(existLeaf)
                        isStop = true
                      } else {
                        self.fileToSubpathMap[curFilePath] = uid
                      }
                    }
                  }
                }
                if (isStop) return
                const newState = {
                  ...state,
                  type: SMM_VIEW_TYPE
                }
                return next.apply(this, [newState, ...rest])
              }
            }
            return next.apply(this, [state, ...rest])
          }
        }
      })
    )
    this.menus.addMarkdownFileMenus()
  }

  _switchToSmmAfterLoad() {
    this.app.workspace.onLayoutReady(async () => {
      let leaf
      const markdownLeaf = this.app.workspace.getLeavesOfType('markdown')
      for (leaf of markdownLeaf) {
        if (
          leaf.view instanceof MarkdownView &&
          leaf.view.file &&
          this._isSmmFile(leaf.view.file)
        ) {
          this._setSmmView(leaf)
        }
      }
    })
  }

  async _setSmmView(leaf) {
    await leaf.setViewState({
      type: SMM_VIEW_TYPE,
      state: leaf.view.getState(),
      popstate: true
    })
  }

  _getActiveSmmView() {
    return this.app.workspace.getActiveViewOfType(SmmEditView, IGNORE_CHECK_SMM)
  }

  _isSmmFile(file) {
    if (!file) {
      return false
    }
    const isString = typeof file === 'string'
    const filePath = isString ? file : file.path
    if (filePath.endsWith('.smm.md')) {
      return true
    }
    let cache = null
    if (isString) {
      cache = this.app.metadataCache.getCache(file)
    } else {
      if (file.extension === SMM_VIEW_TYPE) {
        return true
      }
      cache = this.app.metadataCache.getFileCache(file)
    }
    if (cache?.frontmatter?.tags?.contains(SMM_TAG)) {
      return true
    }
    if (/\.smm.*\.md$/.test(filePath)) {
      return true
    }
    return false
  }

  _initStatusBar() {
    this.statusBarItem = this.addStatusBarItem()
    this.statusBarItem.empty()
    this.statusBarItem.style.display = 'none'

    this.smmFileStatus = this.statusBarItem.createEl('div', {
      cls: 'smm-file-status'
    })

    this.registerEvent(
      this.app.workspace.on('file-open', this._updateStatusBar.bind(this))
    )

    this.registerEvent(
      this.app.workspace.on(
        'active-leaf-change',
        this._updateStatusBar.bind(this)
      )
    )

    this._updateStatusBar()
  }

  _updateStatusBar() {
    const activeFile = this.app.workspace.getActiveFile()

    const isSmmFile = activeFile && this._isSmmFile(activeFile)

    const statusBar = this.app.statusBar.containerEl

    if (isSmmFile) {
      this.statusBarItem.style.display = 'block'
      statusBar.classList.add('smm-file-status-active')
    } else {
      this.statusBarItem.style.display = 'none'
      statusBar.classList.remove('smm-file-status-active')
    }
  }

  async _ensureDirectoryExists(dirPath) {
    if (!dirPath) return
    const { vault } = this.app
    const exist = await vault.exists(dirPath)
    if (!exist) {
      await vault.createFolder(dirPath)
    }
  }

  _t(val) {
    return i18n.t(val)
  }

  _getCreateDefaultMindMapOptions() {
    const { defaultTheme, defaultThemeDark, defaultLayout } = this.settings
    return {
      theme: this._getObIsDark() ? defaultThemeDark : defaultTheme,
      layout: defaultLayout,
      rootNodeDefaultText: this._t('common.rootNodeDefaultText'),
      secondNodeDefaultText: this._t('common.secondNodeDefaultText'),
      branchNodeDefaultText: this._t('common.branchNodeDefaultText')
    }
  }

  _createDefaultMindMapData() {
    return createDefaultMindMapData(
      this._getCreateDefaultMindMapOptions(),
      false
    )
  }

  _getActiveFileDirectory() {
    const activeFile = this.app.workspace.getActiveFile()
    if (!activeFile) {
      return null
    }
    if (activeFile instanceof TFolder) {
      return null
    }
    const parent = activeFile.parent
    if (!parent) {
      return null
    }
    return parent.path.replace(/\/$/, '')
  }

  _getObIsDark() {
    return document.body.classList.contains('theme-dark')
  }

  async _mdToMindmapData(md) {
    const frontMatterRegex = /^---\n[\s\S]*?\n---\n/
    const cleanedMd = md.replace(frontMatterRegex, '')
    if (!cleanedMd.trim()) {
      return null
    }
    const data = await markdown.transformMarkdownTo(cleanedMd, false)
    if (!data) {
      return null
    }
    const { defaultTheme, defaultThemeDark, defaultLayout } = this.settings
    return {
      root: data,
      layout: defaultLayout,
      theme: {
        template: this._getObIsDark() ? defaultThemeDark : defaultTheme,
        config: {}
      }
    }
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(SMM_VIEW_TYPE)
    this.markdownPostProcessor.destroy()
    this.statusBarItem?.remove()
    this.commands.clear()
  }
}
