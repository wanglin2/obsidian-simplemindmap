import { Modal } from 'obsidian'
import i18n from 'i18next'

export class TextInfoDialog extends Modal {
  constructor(app, params = {}) {
    super(app)
    this.params = {
      title: '',
      html: '',
      closeText: i18n.t('tip.close'),
      ...params
    }
    this.setTitle(this.params.title)
  }

  onOpen() {
    const { contentEl } = this
    contentEl.empty()
    const contentContainer = contentEl.createDiv('smm-text-info-dialog-content')
    contentContainer.innerHTML = this.params.html
    const buttonContainer = contentEl.createDiv('smm-text-info-dialog-buttons')
    const closeBtn = buttonContainer.createEl('button', {
      text: this.params.closeText
    })
    closeBtn.addEventListener('click', () => {
      this.close()
    })
  }

  onClose() {
    const { contentEl } = this
    contentEl.empty()
  }
}
