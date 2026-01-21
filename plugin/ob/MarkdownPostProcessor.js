import { TFile } from 'obsidian'
import { parseMarkdownText } from './metadataAndMarkdown.js'
import { dataURItoBlob, smmFilePathToFileName } from './utils.js'
import LZString from 'lz-string'
import { SMM_VIEW_TYPE } from './constant.js'
import SmmEditView from '../SmmEditView.js'

export default class MarkdownPostProcessor {
  constructor(plugin) {
    this.plugin = plugin

    this.urlCache = new Map()
    this.imageElements = new Map()
    this.emptyMap = new Map()

    this.handleFileModify = this.handleFileModify.bind(this)
    this.handleFileDelete = this.handleFileDelete.bind(this)
    this.handleModifySvgName = this.handleModifySvgName.bind(this)

    plugin.app.vault.on('modify', this.handleFileModify)
    plugin.app.vault.on('delete', this.handleFileDelete)
    plugin.app.vault.on('rename', this.handleModifySvgName)
  }

  destroy() {
    this.plugin.app.vault.off('modify', this.handleFileModify)
    this.plugin.app.vault.off('delete', this.handleFileDelete)
    this.plugin.app.vault.off('rename', this.handleModifySvgName)

    this.urlCache.forEach(url => URL.revokeObjectURL(url))
    this.urlCache.clear()
    this.imageElements.clear()
    this.emptyMap.clear()
  }

  async handleFileModify(file) {
    if (!(file instanceof TFile) || !this.plugin._isSmmFile(file)) return

    try {
      const noUrlCache = !this.urlCache.has(file.path)
      const hasEmpty = this.emptyMap.has(file.path)
      if (noUrlCache && !hasEmpty) {
        return
      }
      const curIsNoImage = noUrlCache && hasEmpty
      const data = await this.plugin.app.vault.read(file)
      const parsedata = parseMarkdownText(data)
      const newUrl = this._getImgUrl(parsedata.svgdata)
      if (!newUrl) {
        return
      }

      const oldUrl = this.urlCache.get(file.path)
      if (oldUrl) URL.revokeObjectURL(oldUrl)
      this.urlCache.set(file.path, newUrl)

      const emptyDiv = this.emptyMap.get(file.path)
      if (emptyDiv) {
        this.emptyMap.delete(file.path)
      }

      const elements = this.imageElements.get(file.path) || new Set()
      elements.forEach(img => {
        img.src = newUrl
      })
      if (curIsNoImage && emptyDiv) {
        const img = this._createSvgImageElement(newUrl, file.path)
        emptyDiv.replaceWith(img)
      }
    } catch (error) {
      console.error('更新图片失败:', error)
    }
  }

  async handleFileDelete(file) {
    if (!(file instanceof TFile)) return

    const url = this.urlCache.get(file.path)
    if (url) {
      URL.revokeObjectURL(url)
      this.urlCache.delete(file.path)
      const imgs = this.imageElements.get(file.path)
      imgs.forEach(img => {
        const parentElement = img.parentElement
        parentElement.empty()
        this._createEmptyDiv(
          parentElement,
          file,
          this.plugin._t('tip.fileDeleted'),
          false
        )
      })
      this.imageElements.delete(file.path)
    }
    const emptyDiv = this.emptyMap.get(file.path)
    if (emptyDiv) {
      emptyDiv.textContent = this.plugin._t('tip.fileDeleted')
      emptyDiv.removeEventListener('dblclick', emptyDiv.dblclickHandler)
      this.emptyMap.delete(file.path)
    }

    this.deletePreviewSvgFile(file)
  }

  async deletePreviewSvgFile(file) {
    try {
      const targetFileName = smmFilePathToFileName(file.path, '.svg')
      const { embedImageIsSeparateFileFolder } = this.plugin.settings
      const previewFilePath = embedImageIsSeparateFileFolder
        ? `${embedImageIsSeparateFileFolder}/${targetFileName}`
        : targetFileName
      const exist = await this.plugin.app.vault.exists(previewFilePath)
      console.log('删除预览图像文件:', previewFilePath, exist)
      if (exist) {
        await this.plugin.app.vault.adapter.remove(previewFilePath)
      }
    } catch (error) {
      console.error('删除预览图像文件失败:', error)
    }
  }

  async handleModifySvgName(file, oldName) {
    try {
      oldName = smmFilePathToFileName(oldName, '.svg')
      const { embedImageIsSeparateFileFolder } = this.plugin.settings
      const oldPath = embedImageIsSeparateFileFolder + '/' + oldName
      const exist = await this.plugin.app.vault.exists(oldPath)
      if (exist) {
        const newName = smmFilePathToFileName(file.name, '.svg')
        const newPath = embedImageIsSeparateFileFolder + '/' + newName
        await this.plugin.app.vault.adapter.rename(oldPath, newPath)
      }
    } catch (error) {
      console.error('修改svg文件名失败:', error)
    }
    try {
      const markdownLeafs = this.plugin.app.workspace.getLeavesOfType(
        SMM_VIEW_TYPE
      )
      for (const leaf of markdownLeafs) {
        if (
          leaf.view instanceof SmmEditView &&
          leaf.view.file.path === file.path
        ) {
          leaf.view.forceSave(true)
          break
        }
      }
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  register() {
    this.plugin.registerMarkdownPostProcessor(
      this._markdownPostProcessor.bind(this)
    )
  }

  async _markdownPostProcessor(el, ctx) {
    try {
      if (this._isSpecialCard(el)) {
        console.log('特殊卡片处理')
        return this._processSpecialCard(el)
      }

      const embeddedItems = el.querySelectorAll('.internal-embed')
      if (embeddedItems.length === 0) {
        await this._processEditMode(el, ctx)
      } else {
        await this._processReadingMode(embeddedItems, ctx)
      }
    } catch (error) {
      console.error('Markdown处理失败:', error)
    }
  }

  _isSpecialCard(el) {
    return (
      el.hasClass('components--DynamicDataView-PageCardCoverPreviewContent') &&
      el.children[0]?.getAttribute('data-heading') === 'metadata' &&
      el.children[2]?.getAttribute('data-heading') === 'svgdata' &&
      el.children[4]?.getAttribute('data-heading') === 'linkdata'
    )
  }

  _processSpecialCard(el) {
    el.classList.add('smmMindCard')
    const svgdata = el.children[3].children[0].innerHTML
    const url = this._getImgUrl(svgdata)

    const img = this._createSvgImageElement(url)
    el.replaceChildren(img)
  }

  _createEmptyDiv(containerEl, file, text, listenerDblclick = true) {
    const emptyDiv = containerEl.createEl('div', { text })
    emptyDiv.style.color = 'var(--text-muted)'
    emptyDiv.style.border = '1px dashed var(--text-muted)'
    emptyDiv.style.padding = '10px'
    emptyDiv.style.borderRadius = '4px'
    emptyDiv.style.textAlign = 'center'
    if (listenerDblclick) {
      emptyDiv.dblclickHandler = () => {
        const newWindow = this.plugin.settings.embedDblClickNewWindow
        this.plugin.app.workspace.openLinkText(file?.path, '', newWindow)
      }
      emptyDiv.addEventListener('dblclick', emptyDiv.dblclickHandler)
    }
    return emptyDiv
  }

  async _processEditMode(el, ctx) {
    const file = this.plugin.app.vault.getFileByPath(ctx.sourcePath)
    if (!this.plugin._isSmmFile(file)) return
    if (ctx.remainingNestLevel !== undefined && ctx.remainingNestLevel < 4)
      return

    let containerEl = this._findValidContainer(ctx.containerEl)
    if (!containerEl || this._shouldSkipContainer(containerEl)) return

    try {
      const data = await this.plugin.app.vault.read(file)
      const img = await this._createImageFromFile(file, data)
      containerEl.empty()
      if (img) {
        containerEl.appendChild(img)
        this._updateImgSize(containerEl, img)
      } else {
        const emptyDiv = this._createEmptyDiv(
          containerEl,
          file,
          this.plugin._t('tip.noPreviewImageInFile')
        )
        this.emptyMap.set(file.path, emptyDiv)
      }
      if (containerEl.hasClass('markdown-embed')) {
        containerEl.classList.remove('markdown-embed', 'inline-embed')
      }
      if (containerEl.hasClass('canvas-node-content')) {
        containerEl.classList.add('smm-canvas-node-content')
      }
    } catch (error) {
      console.error(`处理编辑模式失败: ${file?.path}`, error)
    }
  }

  async _processReadingMode(embeddedItems, ctx) {
    for (const item of embeddedItems) {
      try {
        const fname = item.getAttribute('src')?.split('#')[0]
        if (!fname) continue

        const file = this.plugin.app.metadataCache.getFirstLinkpathDest(
          fname,
          ctx.sourcePath
        )
        if (!(file instanceof TFile) || !this.plugin._isSmmFile(file)) continue
        const data = await this.plugin.app.vault.read(file)
        const img = await this._createImageFromFile(file, data)
        this._updateImgSize(item, img)
        if (img) {
          item.parentElement?.replaceChild(img, item)
        }
      } catch (error) {
        console.error('处理嵌入项失败', error)
      }
    }
  }

  _updateImgSize(containerEl, img) {
    if (
      containerEl.parentNode &&
      containerEl.parentNode.classList.contains('popover')
    ) {
      containerEl.classList.add('smm-popover-img-preview-content')
    } else {
      const width = containerEl.getAttribute('width')
      const height = containerEl.getAttribute('height')
      if (width) {
        img.width = width
      }
      if (height) {
        img.height = height
      }
    }
  }

  async _createImageFromFile(file, data) {
    if (this.urlCache.has(file.path)) {
      const url = this.urlCache.get(file.path)
      return this._createSvgImageElement(url, file.path)
    }

    const parsedata = parseMarkdownText(data)
    const svgdata = parsedata.svgdata
    if (!svgdata) {
      return null
    }
    const url = this._getImgUrl(svgdata)
    this.urlCache.set(file.path, url)
    const img = this._createSvgImageElement(url, file.path)
    return img
  }

  _getImgUrl(svgdata) {
    if (!svgdata) return ''
    let url = ''
    if (/^!\[\[/.test(svgdata)) {
      const match = svgdata.match(/!\[\[([^\]]+)\]\]/)
      if (match && match[1]) {
        url = this.plugin.app.vault.adapter.getResourcePath(match[1])
      }
    } else {
      const svgBlob = dataURItoBlob(LZString.decompressFromBase64(svgdata))
      url = URL.createObjectURL(svgBlob)
    }
    return url
  }

  _createSvgImageElement(url, filePath = '') {
    const img = document.createElement('img')
    img.src = url
    img.draggable = false

    if (filePath) {
      img.setAttribute('data-smm-file', filePath)

      img.addEventListener('dblclick', () => {
        const newWindow = this.plugin.settings.embedDblClickNewWindow
        this.plugin.app.workspace.openLinkText(filePath, '', newWindow)
      })

      if (!this.imageElements.has(filePath)) {
        this.imageElements.set(filePath, new Set())
      }
      this.imageElements.get(filePath).add(img)

      const observer = new MutationObserver(() => {
        if (!document.contains(img)) {
          this.imageElements.get(filePath)?.delete(img)
          observer.disconnect()
        }
      })
      observer.observe(document.body, { subtree: true, childList: true })
    }

    return img
  }

  _findValidContainer(containerEl) {
    const invalidClasses = [
      'dataview',
      'cm-preview-code-block',
      'cm-embed-block'
    ]

    while (containerEl) {
      if (invalidClasses.some(cls => containerEl.classList.contains(cls))) {
        return null
      }

      const isExcalidraw = containerEl.classList.contains('excalidraw-md-host')
      if (
        containerEl.classList.contains('internal-embed') ||
        containerEl.classList.contains('markdown-embed') ||
        containerEl.classList.contains('markdown-reading-view') ||
        isExcalidraw
      ) {
        return containerEl
      }

      containerEl = containerEl.parentElement
    }

    return null
  }

  _shouldSkipContainer(containerEl) {
    return (
      containerEl.hasAttribute('ready') ||
      ['dataview', 'cm-preview-code-block', 'cm-embed-block'].some(cls =>
        containerEl.classList.contains(cls)
      )
    )
  }
}
