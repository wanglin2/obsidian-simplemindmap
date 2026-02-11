import { TFile, TFolder, Notice, MarkdownView } from 'obsidian'
import {
  parseMarkdownText,
  assembleMarkdownText
} from './metadataAndMarkdown.js'
import { hideTargetMenu } from './utils.js'
import { PreviewMindMap } from './PreviewMindMap.js'
import LZString from 'lz-string'
import { SMM_VIEW_TYPE, SMM_TAG } from './constant.js'
import { around } from 'monkey-around'
import markdown from 'simple-mind-map/src/parse/markdown.js'
import { showConfirmationDialog } from './ConfirmDialog.js'
import SmmEditView from '../SmmEditView.js'

export default class Menus {
  constructor(plugin) {
    this.plugin = plugin
    this.app = plugin.app

    this._addFileMenus()
  }

  _t(key) {
    return this.plugin._t(key)
  }

  _addFileMenus() {
    this.plugin.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        if (file instanceof TFolder) {
          menu.addItem(item => {
            item
              .setTitle(this._t('action.createMindMap'))
              .setIcon('smm-icon')
              .onClick(() => {
                this.plugin._createSmmFile(file.path)
              })
          })
        } else if (file instanceof TFile) {
          if (this.plugin._isSmmFile(file)) {
            hideTargetMenu(menu, '在新窗口中打开')
            hideTargetMenu(menu, '移动至新窗口')
            menu.addItem(item =>
              item
                .setTitle(this._t('action.openAsMd'))
                .setIcon('document')
                .setSection('open')
                .onClick(async () => {
                  await this.app.workspace.openLinkText(file.path, '')
                  const leaf = this.app.workspace.getLeaf(false)
                  const mdViewType = this.app.viewRegistry.getTypeByExtension(
                    'md'
                  )
                  await leaf.setViewState({
                    type: mdViewType,
                    state: {
                      ...leaf.getViewState().state,
                      isSwitchToMarkdownViewFromSmmView: true
                    },
                    active: true
                  })
                  this.app.workspace.revealLeaf(leaf)
                })
            )
            menu.addItem(item =>
              item
                .setTitle(this._t('action.changeToMdFile'))
                .setIcon('refresh-cw')
                .setSection('open')
                .onClick(async () => {
                  const confirmed = await showConfirmationDialog(this.app, {
                    content: this._t('tip.mindMapToMdTip')
                  })
                  if (!confirmed) {
                    return
                  }
                  const content = await this.app.vault.read(file)
                  const result = parseMarkdownText(content)
                  const mindMapData = LZString.decompressFromBase64(
                    result.metadata.content
                  )
                  let mdStr = ''
                  const tags = result.metadata.tags.filter(tag => {
                    return tag !== SMM_TAG
                  })
                  if (tags.length) {
                    mdStr += 'tags:\n'
                    for (const tag of tags) {
                      mdStr += `  - ${tag}\n`
                    }
                  }
                  if (result.metadata.yaml) {
                    mdStr += result.metadata.yaml
                  }
                  if (mdStr) {
                    mdStr = '---\n' + mdStr + '---\n'
                  }
                  const {
                    nodeTextToMarkdownTitleMaxLevel
                  } = this.plugin.settings
                  const mdMindMap = markdown.transformToMarkdown(
                    JSON.parse(mindMapData).root,
                    nodeTextToMarkdownTitleMaxLevel
                  )
                  mdStr += mdMindMap
                  let newPath = file.path.replace(/\.smm.*\.md$/g, '.md')
                  newPath = await this.plugin._getAvailableFilaName(newPath)
                  await this.app.vault.rename(file, newPath)
                  const renamedFile = this.app.vault.getFileByPath(newPath)
                  if (renamedFile) {
                    this.plugin.markdownPostProcessor.deletePreviewSvgFile(file)
                    this.app.noSaveOnClose = true
                    const markdownLeafs = this.app.workspace.getLeavesOfType(
                      SMM_VIEW_TYPE
                    )
                    for (const leaf of markdownLeafs) {
                      if (
                        leaf.view instanceof SmmEditView &&
                        leaf.view.file.path === renamedFile.path
                      ) {
                        leaf.detach()
                        break
                      }
                    }
                    await this.app.vault.modify(renamedFile, mdStr)
                    this.app.noSaveOnClose = false
                    const ref = this.app.metadataCache.on(
                      'changed',
                      changedFile => {
                        if (changedFile.path === renamedFile.path) {
                          this.app.metadataCache.offref(ref)
                          this.app.workspace.openLinkText(
                            renamedFile.path,
                            '',
                            true
                          )
                          new Notice(this._t('tip.changeSuccess'))
                        }
                      }
                    )
                  }
                })
            )
          }
        }
      })
    )
  }

  addMarkdownFileMenus() {
    const self = this
    this.plugin.register(
      around(MarkdownView.prototype, {
        onPaneMenu(next) {
          return function(menu, source) {
            const res = next.apply(this, [menu, source])
            if (self.plugin._isSmmFile(this.file)) {
              if (source === 'more-options') {
                menu.addItem(item =>
                  item
                    .setTitle(self._t('action.openAsMindMap'))
                    .setIcon('document')
                    .setSection('pane')
                    .onClick(() => {
                      self.plugin._setSmmView(this.leaf)
                    })
                )
              }
            } else {
              if (source === 'more-options') {
                menu.addItem(item =>
                  item
                    .setTitle(self._t('action.previewAsMindMap'))
                    .setIcon('smm-icon')
                    .setSection('pane')
                    .onClick(() => {
                      let previewMindMap = new PreviewMindMap({
                        plugin: self.plugin,
                        file: this.file,
                        onClose: () => {
                          previewMindMap = null
                        }
                      })
                    })
                )
                menu.addItem(item =>
                  item
                    .setTitle(self._t('action.changeToMindMapFile'))
                    .setIcon('refresh-cw')
                    .setSection('pane')
                    .onClick(async () => {
                      const confirmed = await showConfirmationDialog(this.app, {
                        content: self._t('tip.mdToMindMapTip')
                      })
                      if (!confirmed) {
                        return
                      }
                      let yaml = ''
                      const tagList = []
                      await this.app.fileManager.processFrontMatter(
                        this.file,
                        frontmatter => {
                          if (frontmatter.tags) {
                            tagList.push(...frontmatter.tags)
                            delete frontmatter.tags
                          }
                        }
                      )
                      if (!tagList.includes(SMM_TAG)) {
                        tagList.push(SMM_TAG)
                      }
                      const content = await this.app.vault.read(this.file)
                      if (content.startsWith('---\n')) {
                        yaml = content.split('---\n')[1]
                      }
                      const mindMapData = await self.plugin._mdToMindmapData(
                        content
                      )
                      if (!mindMapData) {
                        new Notice(self._t('tip.mdToMindMapFail'))
                        return
                      }
                      let newPath = this.file.path.replace('.md', '.smm.md')
                      newPath = await self.plugin._getAvailableFilaName(
                        newPath,
                        2
                      )
                      await this.app.vault.rename(this.file, newPath)
                      const renamedFile = this.app.vault.getFileByPath(newPath)
                      const str = assembleMarkdownText({
                        metadata: {
                          path: `${newPath || ''}`,
                          tags: tagList,
                          yaml: yaml,
                          content: LZString.compressToBase64(
                            JSON.stringify(mindMapData)
                          )
                        },
                        svgdata: '',
                        linkdata: []
                      })
                      if (renamedFile) {
                        const markdownLeafs = this.app.workspace.getLeavesOfType(
                          'markdown'
                        )
                        for (const leaf of markdownLeafs) {
                          if (
                            leaf.view instanceof MarkdownView &&
                            leaf.view.file.path === renamedFile.path
                          ) {
                            leaf.detach()
                            break
                          }
                        }
                        await this.app.vault.modify(renamedFile, str)
                        const ref = this.app.metadataCache.on(
                          'changed',
                          changedFile => {
                            if (changedFile.path === renamedFile.path) {
                              this.app.metadataCache.offref(ref)
                              this.app.workspace.openLinkText(
                                renamedFile.path,
                                '',
                                true
                              )
                              new Notice(self._t('tip.changeSuccess'))
                            }
                          }
                        )
                      }
                    })
                )
              }
            }
            return res
          }
        }
      })
    )
  }
}
