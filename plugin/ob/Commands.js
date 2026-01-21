import { Notice, MarkdownView } from 'obsidian'

export default class Commands {
  constructor(plugin) {
    this.plugin = plugin
    this.app = plugin.app

    this._addCreatesCommand()
    this._addActionsCommand()
  }

  clear() {}

  addCommand(command) {
    this.plugin.addCommand(command)
  }

  _t(key) {
    return this.plugin._t(key)
  }

  _addCreatesCommand() {
    this.addCommand({
      id: 'create-smm-mindmap',
      name: this._t('action.createMindMap'),
      callback: async () => {
        this.plugin._createSmmFile()
      }
    })
    this.addCommand({
      id: 'create-smm-mindmap-insert-markdown',
      name: this._t('action.createMindMapInsertToMd'),
      checkCallback: checking => {
        const markdownView = this.app.workspace.getActiveViewOfType(
          MarkdownView
        )
        if (markdownView) {
          if (!checking) {
            this.plugin._createSmmFile('', fileName => {
              try {
                const file = this.app.vault.getFileByPath(fileName)
                const currentFile = this.app.workspace.getActiveFile()
                const linkText = this.app.fileManager.generateMarkdownLink(
                  file,
                  currentFile?.path || ''
                )
                const activeEditor = this.app.workspace.activeEditor
                activeEditor.editor.replaceSelection('!' + linkText)
              } catch (error) {
                console.error(error)
                new Notice(this._t('tip.createMindMapFail'))
              }
            })
          }
          return true
        }
        return false
      }
    })
  }

  _addActionsCommand() {
    this.addCommand({
      id: 'enter-smm-mindmap-demonstrate',
      name: this._t('action.enterDemonstrate'),
      checkCallback: checking => {
        const view = this.plugin._getActiveSmmView()
        if (view) {
          if (!checking) {
            view.mindMapAPP.$bus.$emit('enter_demonstrate')
          }
          return true
        }
        return false
      }
    })
    this.addCommand({
      id: 'save-smm-mindmap-and-update-image',
      name: this._t('action.saveAndUpdateImage'),
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 's'
        }
      ],
      checkCallback: checking => {
        const view = this.plugin._getActiveSmmView()
        if (view) {
          if (!checking) {
            view.forceSaveAndUpdateImage()
          }
          return true
        }
        return false
      }
    })
  }
}
