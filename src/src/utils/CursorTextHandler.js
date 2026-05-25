class CursorTextHandler {
  constructor(editableElement) {
    this.editableElement = editableElement
  }

  getFragmentElementInnerHTML(fragment) {
    const div = document.createElement('div')
    const editNode = fragment.querySelector('.nodeEdit')
    if (editNode) return editNode.innerHTML
    div.appendChild(fragment)
    return div.innerHTML || ''
  }

  getTextOnCursor(dir) {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return ''
    const range = selection.getRangeAt(0)
    const targetRange = document.createRange()

    if (dir === 'after') {
      targetRange.setStart(range.startContainer, range.startOffset)
      targetRange.setEndAfter(this.editableElement)
    } else {
      targetRange.setStart(this.editableElement, 0)
      targetRange.setEnd(range.startContainer, range.startOffset)
    }

    const html = this.getFragmentElementInnerHTML(targetRange.cloneContents())
    return html || targetRange.toString()
  }

  getTextAfterCursor() {
    return this.getTextOnCursor('after')
  }

  getTextBeforeCursor() {
    return this.getTextOnCursor('before')
  }

  getFullText() {
    return this.editableElement.textContent || ''
  }

  getFullHtml() {
    return this.editableElement.innerHTML || ''
  }
}

export default CursorTextHandler