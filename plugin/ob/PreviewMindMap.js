import { initPreviewModeApp } from '../src/main'

export class PreviewMindMap {
  constructor({ plugin, file, onClose }) {
    this.app = plugin.app
    this.plugin = plugin
    this.file = file
    this.onClose = onClose

    this.previewModeApp = null
    this.container = document.createElement('div')
    this.wrap = document.createElement('div')
    this.container.appendChild(this.wrap)
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 50;
      background: rgba(0, 0, 0, 0.5);
    `
    document.body.appendChild(this.container)
    this._renderView()
  }

  async _renderView() {
    const content = await this.app.vault.read(this.file)
    const mindMapData = await this.plugin._mdToMindmapData(content)
    this.previewModeApp = initPreviewModeApp(this.wrap, {
      getInitMindMapData: () => {
        return mindMapData
      },
      getMindMapOptions: () => {
        return {
          readonly: true,
          fit: true
        }
      },
      getFile: () => {
        return this.file
      },
      getSettings: () => {
        return this.plugin.settings || {}
      },
      getMindMapLocalConfig: () => {
        const { mindMapLocalConfig, themeMode } = this.plugin.settings
        const config = mindMapLocalConfig || {}
        config.isDark =
          themeMode === 'follow'
            ? this.plugin._getObIsDark()
            : themeMode === 'dark'
        return config
      }
    })
    this.previewModeApp.$bus.$on('closePreviewMode', this._close.bind(this))
  }

  _close() {
    this.previewModeApp.$destroy()
    document.body.removeChild(this.container)
    this.previewModeApp = null
    this.container = null
    this.wrap = null
    this.onClose()
  }
}
