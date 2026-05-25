export default class ModifyFileName {
  constructor(view) {
    this.view = view
    this.plugin = view.plugin
    this.app = view.app
    this.titleEl = null
  }

  setupTitleEditing() {
    this.titleEl = this.getTitleElement()
    if (!this.titleEl) return
    this.titleEl.setAttribute('contenteditable', 'true')
    this.onBlur = this.onBlur.bind(this)
    this.titleEl.addEventListener('blur', this.onBlur)
    this.onKeydown = this.onKeydown.bind(this)
    this.titleEl.addEventListener('keydown', this.onKeydown)
  }

  getTitleElement() {
    return this.view.containerEl.querySelector('.view-header-title')
  }

  async finishEditing(accept) {
    if (!this.titleEl.isConnected) return
    const file = this.view.file
    if (!file) return
    const originalName = file.basename
    if (accept) {
      const newName = this.titleEl.textContent.trim()
      if (!newName) {
        new Notice(this.plugin._t('tip.fileNameEmpty'))
        return
      }
      this.titleEl.innerHTML = newName
      if (newName === originalName) return
      try {
        const parentPath = file.parent.path
        const extension = file.extension
        const newPath = `${parentPath}${
          parentPath !== '/' ? '/' : ''
        }${newName}${extension ? '.' + extension : ''}`
        if (!/^[^<>:"/\\|?*]+$/.test(newName)) {
          new Notice(this.plugin._t('tip.fileNameIllegal'))
          return
        }
        const existingFile =
          this.app.vault.getFileByPath(newPath) ||
          this.app.vault.getFileByPath(newPath.replace(/^\//, ''))
        if (existingFile) {
          new Notice(this.plugin._t('tip.fileExist'))
          return
        }
        await this.app.fileManager.renameFile(file, newPath)
      } catch (error) {
        console.error('重命名文件失败:', error)
        new Notice(this.plugin._t('tip.fileRenameFail'))
      }
    } else {
      this.titleEl.innerHTML = originalName
      const selection = window.getSelection()
      const range = document.createRange()
      let lastTextNode = null
      const walker = document.createTreeWalker(
        this.titleEl,
        NodeFilter.SHOW_TEXT,
        null,
        false
      )
      let node
      while ((node = walker.nextNode())) {
        lastTextNode = node
      }
      range.setStart(
        lastTextNode,
        /\.smm$/.test(lastTextNode.textContent)
          ? lastTextNode.length - 4
          : lastTextNode.length
      )
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  onBlur() {
    this.finishEditing(true)
  }

  onKeydown(e) {
    if (e.key === 'Enter') {
      this.finishEditing(true)
    } else if (e.key === 'Escape') {
      this.finishEditing(false)
    }
  }

  unload() {
    if (this.titleEl) {
      this.titleEl.removeAttribute('contenteditable')
      this.titleEl.removeEventListener('blur', this.onBlur)
      this.titleEl.removeEventListener('keydown', this.onKeydown)
    }
  }
}
