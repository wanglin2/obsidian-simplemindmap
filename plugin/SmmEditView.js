import { Notice, TextFileView, TFile, setIcon, Platform } from 'obsidian'
import {
  SMM_VIEW_TYPE,
  SAVE_ICON,
  IMPORT_ICON,
  EXPORT_ICON,
  SMM_TAG,
  OUTLINE_ICON,
  MINDMAP_ICON,
  PRINT_ICON,
  getSmmEditViewCount
} from './ob/constant.js'
import { initApp } from './src/main.js'
import {
  assembleMarkdownText,
  parseMarkdownText,
  createDefaultText
} from './ob/metadataAndMarkdown.js'
import {
  hideTargetMenu,
  smmFilePathToFileName,
  formatFileName
} from './ob/utils.js'
import LZString from 'lz-string'
import { base64ToFile } from './src/utils'
import ModifyFileName from './ob/ModifyFileName.js'

class SmmEditView extends TextFileView {
  constructor(leaf, plugin) {
    super(leaf)
    this.plugin = plugin
    this.contentEl.style.padding = 0
    this.warpEl = this.contentEl.createDiv('smmMindmapEditContainer')
    this.warpEl.classList.add('smm-common-full-size')
    this.mindMapData = ''
    this.parsedMindMapData = null
    this.mindMapAPP = null

    this.isActive = true
    this.resizeObserver = null
    this.isUnSave = false
    this.isNotTriggerDataChange = false
    this.isHidden = false
    this.needResize = false
    this.isOutlineEditMode = false
    this.saveButton = null
    this.exportButton = null
    this.importButton = null
    this.printOutlineButton = null
    this.changeToOutlineButton = null
    this.changeToMindmapButton = null
    this.savingTipEl = null
    this.isReadonlyMode = false
    this.toggleReadonlyButton = null
    this.modifyFileName = new ModifyFileName(this)
    this.popScope = null
    this.id = getSmmEditViewCount()
  }

  getViewType() {
    return SMM_VIEW_TYPE
  }

  getIcon() {
    return 'smm-icon'
  }

  onPaneMenu(menu, source) {
    super.onPaneMenu(menu, source)
    hideTargetMenu(menu, '在新窗口中打开')
    hideTargetMenu(menu, '移动至新窗口')
  }

  async switchToMarkdownView() {
    if (!this.file || !this.leaf) return
    const mdViewType = this.app.viewRegistry.getTypeByExtension('md')
    await this.leaf.setViewState({
      type: mdViewType,
      state: {
        ...this.leaf.getViewState().state,
        isSwitchToMarkdownViewFromSmmView: true
      },
      popstate: true
    })
  }

  async onOpen() {
    // 注册激活状态监听
    this.registerEvent(
      this.app.workspace.on(
        'active-leaf-change',
        this._handleActiveChange.bind(this)
      )
    )
    this.registerEvent(
      this.app.workspace.on('resize', this._handleResize.bind(this))
    )

    this._addActionBtns()

    this._initThemeMode()

    this.modifyFileName.setupTitleEditing()
    this._registerHotkeyOverrides()
  }

  getViewData() {
    return this.mindMapData
  }

  async setViewData(data, isClear) {
    if (this.isHidden) {
      return
    }
    if (isClear) {
      this.clear()
    }
    let rawData = data.trim()
    try {
      if (!rawData) {
        throw new Error(this.plugin._t('tip.fileIsEmpty'))
      } else {
        this.parsedMindMapData = parseMarkdownText(rawData)
        const content = this.parsedMindMapData.metadata.content
        if (content) {
          let passedContent = ''
          try {
            const json = JSON.parse(content)
            if (json && json.root) {
              passedContent = content
            }
          } catch (error) {}
          if (!passedContent) {
            this.parsedMindMapData.metadata.content = LZString.decompressFromBase64(
              content
            )
          }
        } else {
          throw new Error('文件格式错误')
        }
      }
    } catch (error) {
      rawData = createDefaultText(
        '',
        this.plugin._getCreateDefaultMindMapOptions()
      )
    }
    this.mindMapData = rawData
    if (!this.parsedMindMapData) {
      this.parsedMindMapData = parseMarkdownText(rawData)
      this.parsedMindMapData.metadata.content = LZString.decompressFromBase64(
        this.parsedMindMapData.metadata.content
      )
    }
    if (isClear) {
      this._renderMindMap()
    } else if (this.mindMapAPP) {
      this.isNotTriggerDataChange = true
      this.mindMapAPP.$bus.$emit(
        'updateMindMapDataFromOb',
        this.parsedMindMapData.metadata.content
      )
    }
  }

  _clearObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }

  _renderMindMap() {
    this.warpEl.empty()
    const el = this.warpEl.createDiv('smmMindMapEdit')
    el.classList.add('smm-common-full-size')
    this._clearObserver()
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 10 && height > 10) {
          this._initializeMindMap(el)
          this._clearObserver()
          break
        }
      }
    })
    this.resizeObserver.observe(el)
  }

  _initializeMindMap(el) {
    if (this.mindMapAPP) return
    const filePath = this.file?.path
    let initLocationNodeId = ''
    const { fileToSubpathMap } = this.plugin
    if (fileToSubpathMap && fileToSubpathMap[filePath]) {
      initLocationNodeId = fileToSubpathMap[filePath]
      delete fileToSubpathMap[filePath]
    }
    this.mindMapAPP = initApp(el, {
      getInitMindMapData: () => {
        return this.parsedMindMapData.metadata.content
      },
      getInitLocationNodeId: () => {
        return initLocationNodeId
      },
      getMindMapCurrentData: (content, linkData, textData) => {
        this.parsedMindMapData.metadata.content = content
        const {
          metadata,
          svgdata,
          svgdataUpdateAt,
          linkdata
        } = this.parsedMindMapData
        this.mindMapData = assembleMarkdownText({
          metadata: {
            path: `${this.file?.path}`,
            tags: Array.from(new Set([SMM_TAG, ...metadata.tags])),
            content: LZString.compressToBase64(content),
            yaml: metadata.yaml
          },
          svgdata,
          svgdataUpdateAt,
          linkdata: linkData || linkdata || [],
          textdata: textData || []
        })
      },
      saveMindMapData: async (_, svgData) => {
        try {
          this._showSavingTip()
          const { embedImageIsSeparateFile } = this.plugin.settings
          if (svgData) {
            if (embedImageIsSeparateFile) {
              const res = await this._getFileSvgData(svgData)
              if (res) {
                this.parsedMindMapData.svgdata = `![[${res}]]`
                this.parsedMindMapData.svgdataUpdateAt = moment().format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              } else {
                new Notice(this.plugin._t('tip.imgCreateFail'))
              }
            } else {
              this.parsedMindMapData.svgdata = LZString.compressToBase64(
                svgData
              )
            }
          }
          this.forceSave()
        } catch (error) {}
      },
      getMindMapConfig: () => {
        return this.plugin.settings.mindMapConfig || {}
      },
      saveMindMapConfig: newConfig => {
        this.plugin.settings.mindMapConfig = newConfig
        this.plugin._saveSettings()
      },
      getMindMapLocalConfig: () => {
        const { mindMapLocalConfig, themeMode } = this.plugin.settings
        const config = mindMapLocalConfig || {}
        config.isDark =
          themeMode === 'follow'
            ? this.plugin._getObIsDark()
            : themeMode === 'dark'
        return config
      },
      saveMindMapLocalConfig: newConfig => {
        this.plugin.settings.mindMapLocalConfig = newConfig
        this.plugin._saveSettings()
      },
      getSettings: () => {
        return this.plugin.settings || {}
      },
      updateSettings: data => {
        this.plugin.settings = {
          ...this.plugin.settings,
          ...data
        }
        this.plugin._saveSettings()
      },
      getObAllFiles: (extraSelf = true) => {
        const fileList = this.app.vault.getFiles()
        if (extraSelf && this.file) {
          return fileList.filter(item => {
            return item.path !== this.file.path
          })
        }
        return fileList
      },
      createLinkInfoFromFilePath: (filePath, subpath = '', alias = '') => {
        const file = this.tryGetFileByPath(filePath)
        if (!file) {
          return null
        }
        const linkText = this.app.fileManager.generateMarkdownLink(
          file,
          this.file?.path || '',
          subpath,
          alias
        )
        return {
          link: file.path,
          linkText
        }
      },
      openFile: (filePath, isNewTab = false, createOnNoExist = false) => {
        if (!filePath) return
        let arr = filePath.split(/(#|^|\|)/)
        filePath = arr[0]
        let postfix = []
        arr = arr.slice(1)
        let ignore = false
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === '|') {
            ignore = true
          } else if (ignore) {
            ignore = false
          } else {
            postfix.push(arr[i])
          }
        }
        postfix = postfix.join('')
        const file = this.tryGetFileByPath(filePath)
        if (file && file instanceof TFile) {
          this.app.workspace.openLinkText(
            file.path + postfix,
            this.file?.path || '',
            isNewTab
          )
        } else if (createOnNoExist) {
          this.app.workspace.openLinkText(
            /\.md$/.test(filePath) ? filePath : filePath + '.md',
            this.file?.path || '',
            isNewTab
          )
        }
      },
      openWebLink: url => {
        if (this.app.openExternal) {
          this.app.openExternal(url)
          return
        }
        try {
          if (window.require) {
            const { shell } = window.require('electron')
            shell.openExternal(url)
            return
          }
        } catch (e) {}
        window.open(url, '_blank', 'noopener,noreferrer')
      },
      saveFileToVault: async (...args) => {
        const res = await this.saveFileToVault(...args)
        return res
      },
      getResourcePath: vaultPath => {
        return this.app.vault.adapter.getResourcePath(vaultPath)
      },
      getObInternalLink: (...args) => {
        return this.app.fileManager.generateMarkdownLink(this.file, '', ...args)
      },
      showTip: tip => {
        new Notice(tip)
      },
      getFileFromUri: uri => {
        const params = new URLSearchParams(uri.split('?')[1])
        const vault = decodeURIComponent(params.get('vault') || '')
        const filePath = decodeURIComponent(params.get('file') || '')
        if (!vault || !filePath) return null
        if (this.app.vault.getName() !== vault) {
          new Notice(this.plugin._t('tip.onlyEnableSelectCurrentVaultFile'))
          return null
        }
        return this.tryGetFileByPath(filePath)
      },
      isMobile: () => {
        return Platform.isMobile
      },
      getObsidianApp: () => {
        return this.app
      },
      getFormatFileName: (str, ignores = []) => {
        return formatFileName(str, {
          notename: this.file?.basename.split('.')[0],
          ignores
        })
      }
    })
    setTimeout(() => {
      this._listenMindMapEvent()
    }, 100)
  }

  tryGetFileByPath(filePath) {
    let res = this.app.vault.getFileByPath(filePath)
    if (!res) {
      res = this.app.vault.getFileByPath(filePath + '.md')
    }
    if (!res) {
      res = this.app.metadataCache.getFirstLinkpathDest(
        filePath,
        this.file?.path
      )
    }
    return res
  }

  async _getFileSvgData(svgData) {
    const targetFileName = smmFilePathToFileName(this.file?.path, '.svg')
    const { embedImageIsSeparateFileFolder } = this.plugin.settings
    const originSvgData = this.parsedMindMapData.svgdata
    if (originSvgData && /^!\[\[/.test(originSvgData)) {
      const match = originSvgData.match(/!\[\[([^\]]+)\]\]/)
      if (match && match[1]) {
        const filePath = match[1]
        const fileName = filePath.split('/').pop()
        if (fileName !== targetFileName) {
          const exist = await this.app.vault.exists(filePath)
          if (exist) {
            await this.app.vault.adapter.remove(filePath)
          }
        }
      }
    }
    svgData = base64ToFile(svgData, targetFileName)
    const res = await this.saveFileToVault(
      svgData,
      true,
      embedImageIsSeparateFileFolder,
      true
    )
    return res
  }

  async saveFileToVault(file, isImg = true, targetFolder = '', cover = false) {
    try {
      let folder = targetFolder || ''
      if (!folder) {
        folder = isImg
          ? this._getFileSavePath('imagePathType', 'imagePath', 'imageSubPath')
          : this._getFileSavePath(
              'attachmentPathType',
              'attachmentPath',
              'attachmentSubPath'
            )
      }
      await this.plugin._ensureDirectoryExists(folder)
      let fileName = file.name
      let fileExist = false
      if (!cover) {
        let counter = 1
        while (
          this.app.vault.getFileByPath(
            folder ? `${folder}/${fileName}` : fileName
          )
        ) {
          const parts = file.name.split('.')
          const ext = parts.pop()
          fileName = `${parts.join('.')}_${counter}.${ext}`
          counter++
        }
      } else {
        fileExist = await this.app.vault.adapter.exists(
          folder ? `${folder}/${fileName}` : fileName
        )
      }
      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer()
      // 在vault中创建路径
      const vaultPath = folder ? `${folder}/${fileName}` : fileName
      // 写入文件
      if (fileExist) {
        await app.vault.adapter.writeBinary(vaultPath, arrayBuffer)
      } else {
        await this.app.vault.createBinary(vaultPath, arrayBuffer)
      }
      return vaultPath
    } catch (error) {
      return null
    }
  }

  jumpToNodeByUid(uid) {
    if (!this.mindMapAPP) {
      return
    }
    this.mindMapAPP.$bus.$emit('jumpToNodeByUid', uid)
  }

  async save(ignoreActiveCheck = false) {
    if (!ignoreActiveCheck && !this.isActive) {
      return
    }
    if (this.app.noSaveOnClose) return
    const t = Date.now()
    if (this.mindMapAPP) {
      this.mindMapAPP.$bus.$emit('getMindMapCurrentData')
      this.mindMapAPP.$bus.$emit('clearAutoSave')
    }
    if (!this.mindMapData) {
      return
    }
    await super.save()
    this._setIsUnSave(false)
    this._hideSavingTip()
  }

  forceSave(ignoreActiveCheck = false) {
    this._showSavingTip()
    this.save(ignoreActiveCheck)
  }

  forceSaveAndUpdateImage() {
    this._showSavingTip()
    this.mindMapAPP.$bus.$emit('saveToLocal', true, true)
  }

  _listenMindMapEvent() {
    this._onDataChange = this._onDataChange.bind(this)
    this.mindMapAPP.$bus.$on('data_change', this._onDataChange)
  }

  _onDataChange() {
    if (this.isNotTriggerDataChange) {
      this.isNotTriggerDataChange = false
      return
    }
    this._setIsUnSave(true)
  }

  _handleResize() {
    if (!this.mindMapAPP || this.needResize) {
      return
    }
    if (this.isHidden) {
      this.needResize = true
      return
    }
    try {
      if (this.mindMapAPP.$updateMindMapSize) {
        const { width, height } = this.warpEl.getBoundingClientRect()
        if (width > 0 && height > 0) {
          this.mindMapAPP.$updateMindMapSize()
        }
      }
    } catch (e) {}
  }

  async _handleActiveChange(leaf) {
    const nowActive = leaf?.view === this
    if (nowActive && !this.isActive) {
      this._registerHotkeyOverrides()
      this.isActive = true
      if (this.mindMapAPP) {
        if (this.isHidden) {
          this.isHidden = false
          this._checkForExternalChanges()
        }
        if (this.needResize) {
          this.needResize = false
          this._handleResize()
        }
      }
    } else if (!nowActive && this.isActive) {
      this._clearPopScope()
      const rect = this.warpEl.getBoundingClientRect()
      this.isHidden = rect.width === 0 || rect.height === 0
      if (this.mindMapAPP) {
        this.mindMapAPP.$bus.$emit('obTabDeactivate')
        this.save()
        this.mindMapAPP.$clearUpdateMindMapSize()
      }
      this.isActive = false
    }
  }

  async _checkForExternalChanges() {
    if (!this.file) return
    try {
      const data = await this.app.vault.read(this.file)
      await this.setViewData(data, false)
    } catch (e) {}
  }

  clear() {
    this._clearObserver()
    if (this.mindMapAPP) {
      try {
        this.mindMapAPP.$destroy()
      } catch (e) {}
      this.mindMapAPP = null
    }
    this.warpEl.empty()
    this.mindMapData = ''
    this.parsedMindMapData = null
    this.isUnSave = false
    this.isNotTriggerDataChange = false
    this.isHidden = false
    this.needResize = false
    this._resetOnOutlineEditMode()
  }

  async onClose() {
    this._clearPopScope()
    this.modifyFileName.unload()
    await this.save()
    this.clear()
    this.saveButton = null
    this.exportButton = null
    this.importButton = null
    this.printOutlineButton = null
    this.changeToOutlineButton = null
    this.changeToMindmapButton = null
    this.toggleReadonlyButton = null
  }

  _addActionBtns() {
    const viewActions = this.headerEl.querySelector('.view-actions')

    this.toggleReadonlyButton = this._createActionBtn(
      this.plugin._t('action.changeToReadonly'),
      'book-open',
      viewActions,
      async () => {
        await this.save()
        if (this.isReadonlyMode) {
          this.isReadonlyMode = false
          this.mindMapAPP.$bus.$emit('toggleReadonly', false)
          setIcon(this.toggleReadonlyButton, 'book-open')
          this.toggleReadonlyButton.setAttribute(
            'aria-label',
            this.plugin._t('action.changeToReadonly')
          )
          this._showButtons([
            this.saveButton,
            this.importButton,
            this.exportButton
          ])
        } else {
          this.isReadonlyMode = true
          this.mindMapAPP.$bus.$emit('toggleReadonly', true)
          setIcon(this.toggleReadonlyButton, 'edit-3')
          this.toggleReadonlyButton.setAttribute(
            'aria-label',
            this.plugin._t('action.changeToEdit')
          )
          this._hideButtons([
            this.saveButton,
            this.importButton,
            this.exportButton
          ])
        }
      },
      true
    )

    this.changeToOutlineButton = this._createActionBtn(
      this.plugin._t('action.changeToOutline'),
      OUTLINE_ICON,
      viewActions,
      async () => {
        await this.save()
        this._hideButtons([this.exportButton, this.changeToOutlineButton])
        this._showButtons([this.printOutlineButton, this.changeToMindmapButton])
        // 保存按钮文案修改
        this.saveButton.setAttribute('aria-label', '保存')
        this.mindMapAPP.$bus.$emit('showOutlineEdit')
        this.isOutlineEditMode = true
      }
    )

    this.changeToMindmapButton = this._createActionBtn(
      this.plugin._t('action.changeToMindMap'),
      MINDMAP_ICON,
      viewActions,
      async () => {
        await this.save()
        this.mindMapAPP.$bus.$emit('hideOutlineEdit')
        this._resetOnOutlineEditMode()
      }
    )
    this._hideButtons([this.changeToMindmapButton])

    this.printOutlineButton = this._createActionBtn(
      this.plugin._t('action.printOutline'),
      PRINT_ICON,
      viewActions,
      async () => {
        this.mindMapAPP.$bus.$emit('printOutline')
      }
    )
    this._hideButtons([this.printOutlineButton])

    this.importButton = this._createActionBtn(
      this.plugin._t('action.import'),
      IMPORT_ICON,
      viewActions,
      () => {
        this.mindMapAPP.$bus.$emit('showImport')
      }
    )

    if (!Platform.isMobile) {
      this.exportButton = this._createActionBtn(
        this.plugin._t('action.export'),
        EXPORT_ICON,
        viewActions,
        () => {
          this.mindMapAPP.$bus.$emit('showExport')
        }
      )
    }

    // 保存并更新图像数据
    this.saveButton = this._createActionBtn(
      this.plugin._t('action.saveAndUpdateImage'),
      SAVE_ICON,
      viewActions,
      () => {
        this.forceSaveAndUpdateImage()
      }
    )
    this.saveButton.classList.add('smm-save-button-default')

    this.savingTipEl = this.headerEl.createEl('div', {
      cls: 'smm-save-tip'
    })
    viewActions.insertBefore(this.savingTipEl, viewActions.firstChild)
  }

  _showSavingTip() {
    if (!this.savingTipEl) return
    this.savingTipEl.innerText = this.plugin._t('tip.saving')
  }

  _hideSavingTip() {
    if (!this.savingTipEl) return
    this.savingTipEl.innerText = ''
  }

  _createActionBtn(label, icon, parentEl, onClick, isObIcon = false) {
    const el = this.headerEl.createEl('button', {
      cls: 'clickable-icon'
    })
    el.setAttribute('aria-label', label)
    if (isObIcon) {
      setIcon(el, icon, 24)
    } else {
      el.innerHTML = icon
    }
    parentEl.insertBefore(el, parentEl.firstChild)
    el.addEventListener('click', onClick)
    return el
  }

  _resetOnOutlineEditMode() {
    if (this.isOutlineEditMode) {
      this.saveButton.setAttribute(
        'aria-label',
        this.plugin._t('action.saveAndUpdateImage')
      )
      this._showButtons([this.exportButton, this.changeToOutlineButton])
      this._hideButtons([this.changeToMindmapButton, this.printOutlineButton])
      this.isOutlineEditMode = false
    }
  }

  _showButtons(list) {
    list.forEach(el => {
      if (!el) return
      el.classList.remove('smm-common-hide')
      el.classList.add('smm-common-flex')
    })
  }

  _hideButtons(list) {
    list.forEach(el => {
      if (!el) return
      el.classList.remove('smm-common-flex')
      el.classList.add('smm-common-hide')
    })
  }

  _setIsUnSave(isUnSave) {
    this.isUnSave = isUnSave
    if (isUnSave) {
      this.saveButton.classList.remove('smm-save-button-default')
      this.saveButton.classList.add('smm-save-button-un-save')
    } else {
      this.saveButton.classList.remove('smm-save-button-un-save')
      this.saveButton.classList.add('smm-save-button-default')
    }
  }

  _initThemeMode() {
    this._updateThemeMode()

    this.registerEvent(
      this.app.workspace.on('css-change', () => {
        this._updateThemeMode()
      })
    )
  }

  _updateThemeMode() {
    if (this.plugin.settings.themeMode === 'follow') {
      const isDarkMode = this.plugin._getObIsDark()
      if (this.mindMapAPP) {
        this.mindMapAPP.$bus.$emit('setIsDark', isDarkMode)
      }
    }
  }

  _getFileSavePath(typeKey, pathKey, subPathKey) {
    const type = this.plugin.settings[typeKey]
    const folder = this.plugin.settings[pathKey] || ''
    const subFolder = this.plugin.settings[subPathKey] || ''
    switch (type) {
      case 'root':
        return ''
      case 'custom':
        return folder
      case 'currentFileFolder':
        return this.plugin._getActiveFileDirectory()
      case 'currentFileFolderSubFolder':
        const activeFileDirectory = this.plugin._getActiveFileDirectory()
        return [activeFileDirectory, subFolder].filter(Boolean).join('/')
      default:
        return ''
    }
  }

  _clearPopScope() {
    if (this.popScope) {
      this.popScope()
      this.popScope = null
    }
  }

  _registerHotkeyOverrides() {
    this._clearPopScope()
    const scope = this.app.keymap.getRootScope()
    const ctrlFHandler = scope.register(['Mod'], 'f', evt => {
      evt.preventDefault()
      return true
    })
    const ctrlSHandler = scope.register(['Mod'], 's', evt => {
      evt.preventDefault()
      const view = this.plugin._getActiveSmmView()
      if (view) {
        view.forceSave()
      }
      return true
    })
    scope.keys.unshift(scope.keys.pop())
    scope.keys.unshift(scope.keys.pop())
    this.popScope = () => {
      scope.unregister(ctrlFHandler)
      scope.unregister(ctrlSHandler)
    }
  }
}

export default SmmEditView
