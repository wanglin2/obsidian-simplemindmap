import { Modal } from 'obsidian'
import i18n from 'i18next'

export class ConfirmDialog extends Modal {
  constructor(app, params) {
    super(app)
    this.params = {
      title: i18n.t('tip.tip'),
      confirmText: i18n.t('tip.confirm'),
      cancelText: i18n.t('tip.cancel'),
      content: '',
      danger: false,
      ...params
    }
    this.resolvePromise = null
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve
    })
    this.setTitle(this.params.title)
  }

  onOpen() {
    const { contentEl } = this
    contentEl.empty()
    const contentContainer = contentEl.createDiv('smm-confirm-dialog-content')
    if (typeof this.params.content === 'string') {
      contentContainer.createEl('p', { text: this.params.content })
    } else {
      contentContainer.appendChild(this.params.content)
    }
    const buttonContainer = contentEl.createDiv('smm-confirm-dialog-buttons')
    const cancelBtn = buttonContainer.createEl('button', {
      text: this.params.cancelText
    })
    cancelBtn.addEventListener('click', () => {
      this.params.onCancel?.()
      this.resolvePromise(false)
      this.close()
    })
    const confirmBtn = buttonContainer.createEl('button', {
      text: this.params.confirmText,
      cls: this.params.danger ? 'mod-warning' : 'mod-cta'
    })
    confirmBtn.addEventListener('click', () => {
      this.params.onConfirm?.()
      this.resolvePromise(true)
      this.close()
    })
  }

  onClose() {
    const { contentEl } = this
    contentEl.empty()
    if (this.resolvePromise) {
      this.resolvePromise(false)
    }
  }
}

export function showConfirmationDialog(app, params) {
  const dialog = new ConfirmDialog(app, params)
  dialog.open()
  return dialog.promise
}
