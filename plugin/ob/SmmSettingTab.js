import { PluginSettingTab, Setting, Notice } from 'obsidian'
import themeList from 'simple-mind-map-plugin-themes/themeList'
import { layoutGroupList } from '../src/config'
import { GITHUB_ICON, COMMUNITY_ICON } from './constant'
import { DEFAULT_SETTINGS } from './constant'
import { SuggestionModal } from './SuggestionModal'
import { TextInfoDialog } from './TextInfoDialog'
import { fragWithHTML } from './utils'

const validateInteger = (value, defaultValue = 0, errorTip) => {
  value = Number(value)
  if (!Number.isNaN(value) && value > 0) {
    return value
  } else {
    new Notice(errorTip)
    return defaultValue
  }
}

export default class SmmSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin)
    this.plugin = plugin
    this.filePathSettings = null
    this.imagePathSettings = null
    this.imageSubPathSettings = null
    this.attachmentPathSettings = null
    this.attachmentSubPathSettings = null
    this.compressImageOptionsMaxWidthSettings = null
    this.compressImageOptionsMaxHeightSettings = null
    this.compressImageOptionsQualitySettings = null
    this.embedImageIsSeparateFileFolderSettings = null
  }

  display() {
    const { containerEl } = this
    containerEl.empty()

    this._addBaseSetting()

    this._addFileSaveSetting()

    this._addCompressSetting()

    this._addImageHostingSetting()

    this._addEmbedSetting()

    this._addOtherSetting()

    this._addHelpInfo()
  }

  _addBaseSetting() {
    const { containerEl } = this

    containerEl.createEl('h2', { text: this.plugin._t('setting.title.title1') })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.autoSave.title'))
      .setDesc(this.plugin._t('setting.autoSave.desc'))
      .addText(text => {
        text
          .setValue(String(this.plugin.settings.autoSaveTime))
          .onChange(async value => {
            value = validateInteger(
              value,
              DEFAULT_SETTINGS.autoSaveTime,
              this.plugin._t('tip.integerInputError')
            )
            this.plugin.settings.autoSaveTime = value
            await this.plugin._saveSettings()
          })
      })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.themeMode.title'))
      .setDesc(this.plugin._t('setting.themeMode.desc'))
      .addDropdown(dropdown => {
        ;[
          {
            name: this.plugin._t('setting.themeMode.option1'),
            value: 'follow'
          },
          {
            name: this.plugin._t('setting.themeMode.option2'),
            value: 'light'
          },
          {
            name: this.plugin._t('setting.themeMode.option3'),
            value: 'dark'
          }
        ].forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.themeMode)
          .onChange(async value => {
            this.plugin.settings.themeMode = value
            await this.plugin._saveSettings()
          })
      })

    const allThemeList = [
      {
        name: this.plugin._t('setting.theme.title'),
        value: 'default',
        dark: false
      },
      ...themeList
    ].reverse()
    new Setting(containerEl)
      .setName(this.plugin._t('setting.theme.title'))
      .setDesc(this.plugin._t('setting.theme.desc'))
      .addDropdown(dropdown => {
        allThemeList.forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.defaultTheme)
          .onChange(async value => {
            this.plugin.settings.defaultTheme = value
            await this.plugin._saveSettings()
          })
      })
    new Setting(containerEl)
      .setName(this.plugin._t('setting.theme.title2'))
      .setDesc(this.plugin._t('setting.theme.desc2'))
      .addDropdown(dropdown => {
        allThemeList.forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.defaultThemeDark)
          .onChange(async value => {
            this.plugin.settings.defaultThemeDark = value
            await this.plugin._saveSettings()
          })
      })

    const allLayoutList = []
    ;(layoutGroupList[this.plugin.settings.lang] || layoutGroupList.en).forEach(
      item => {
        allLayoutList.push(
          ...item.list.map((item2, index) => {
            return {
              name: item.name + (item.list.length > 1 ? index + 1 : ''),
              value: item2
            }
          })
        )
      }
    )
    new Setting(containerEl)
      .setName(this.plugin._t('setting.layout.title'))
      .setDesc(this.plugin._t('setting.layout.desc'))
      .addDropdown(dropdown => {
        allLayoutList.forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.defaultLayout)
          .onChange(async value => {
            this.plugin.settings.defaultLayout = value
            await this.plugin._saveSettings()
          })
      })
  }

  _addFileSaveSetting() {
    const { containerEl } = this

    containerEl.createEl('h2', { text: this.plugin._t('setting.title.title2') })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.file.title1'))
      .setDesc(this.plugin._t('setting.file.desc1'))
      .addText(text => {
        text
          .setValue(this.plugin.settings.fileNameFormat)
          .onChange(async value => {
            this.plugin.settings.fileNameFormat = value.trim()
              ? value.trim()
              : DEFAULT_SETTINGS.fileNameFormat
            await this.plugin._saveSettings()
          })
      })
      .addExtraButton(button =>
        button
          .setIcon('help')
          .setTooltip(this.plugin._t('setting.file.filenameFormatDesc'))
          .onClick(async () => {
            new TextInfoDialog(this.app, {
              title: this.plugin._t('setting.file.filenameFormatDesc'),
              html: this.plugin._t('html.filenameFormatDesc')
            }).open()
          })
      )

    new Setting(containerEl)
      .setName(this.plugin._t('setting.file.title3'))
      .setDesc(this.plugin._t('setting.file.desc3'))
      .addText(text => {
        text
          .setValue(this.plugin.settings.nodePasteImageNameFormat)
          .onChange(async value => {
            this.plugin.settings.nodePasteImageNameFormat = value.trim()
              ? value.trim()
              : DEFAULT_SETTINGS.nodePasteImageNameFormat
            await this.plugin._saveSettings()
          })
      })
      .addExtraButton(button =>
        button
          .setIcon('help')
          .setTooltip(this.plugin._t('setting.file.filenameFormatDesc'))
          .onClick(async () => {
            new TextInfoDialog(this.app, {
              title: this.plugin._t('setting.file.filenameFormatDesc'),
              html: this.plugin._t('html.filenameFormatDesc')
            }).open()
          })
      )

    new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title4'))
      .setDesc(this.plugin._t('setting.folder.desc4'))
      .addDropdown(dropdown => {
        this._getFilePathOptions().forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.filePathType)
          .onChange(async value => {
            this.plugin.settings.filePathType = value
            await this.plugin._saveSettings()
            this._updateFilePathSettingsVisibility()
          })
      })
    this.filePathSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title1'))
      .setDesc(this.plugin._t('setting.folder.desc1'))
      .addText(text => {
        text.setValue(this.plugin.settings.filePath).onChange(async value => {
          this.plugin.settings.filePath = value
          await this.plugin._saveSettings()
        })
        this._addFolderSelectBtn(text, selected => {
          this.plugin.settings.filePath = selected
          this.plugin._saveSettings()
        })
      })
    this.filePathSettings.settingEl.className += ' smm-setting-sub-item'
    this._updateFilePathSettingsVisibility()

    new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title5'))
      .setDesc(this.plugin._t('setting.folder.desc5'))
      .addDropdown(dropdown => {
        this._getFilePathOptions(true).forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.imagePathType)
          .onChange(async value => {
            this.plugin.settings.imagePathType = value
            await this.plugin._saveSettings()
            this._updateImagePathSettingsVisibility()
          })
      })
    this.imagePathSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title2'))
      .setDesc(this.plugin._t('setting.folder.desc2'))
      .addText(text => {
        text.setValue(this.plugin.settings.imagePath).onChange(async value => {
          this.plugin.settings.imagePath = value
          await this.plugin._saveSettings()
        })
        this._addFolderSelectBtn(text, selected => {
          this.plugin.settings.imagePath = selected
          this.plugin._saveSettings()
        })
      })
    this.imagePathSettings.settingEl.className += ' smm-setting-sub-item'
    this.imageSubPathSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title6'))
      .setDesc(this.plugin._t('setting.folder.desc6'))
      .addText(text => {
        text
          .setValue(this.plugin.settings.imageSubPath)
          .onChange(async value => {
            this.plugin.settings.imageSubPath = value
            await this.plugin._saveSettings()
          })
        this._addFolderSelectBtn(text, selected => {
          this.plugin.settings.imageSubPath = selected
          this.plugin._saveSettings()
        })
      })
    this.imageSubPathSettings.settingEl.className += ' smm-setting-sub-item'
    this._updateImagePathSettingsVisibility()

    new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title7'))
      .setDesc(this.plugin._t('setting.folder.desc7'))
      .addDropdown(dropdown => {
        this._getFilePathOptions(true).forEach(item => {
          dropdown.addOption(item.value, item.name)
        })
        dropdown
          .setValue(this.plugin.settings.attachmentPathType)
          .onChange(async value => {
            this.plugin.settings.attachmentPathType = value
            await this.plugin._saveSettings()
            this._updateAttachmentPathSettingsVisibility()
          })
      })
    this.attachmentPathSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title3'))
      .setDesc(this.plugin._t('setting.folder.desc3'))
      .addText(text => {
        text
          .setValue(this.plugin.settings.attachmentPath)
          .onChange(async value => {
            this.plugin.settings.attachmentPath = value
            await this.plugin._saveSettings()
          })
        this._addFolderSelectBtn(text, selected => {
          this.plugin.settings.attachmentPath = selected
          this.plugin._saveSettings()
        })
      })
    this.attachmentPathSettings.settingEl.className += ' smm-setting-sub-item'
    this.attachmentSubPathSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title6'))
      .setDesc(this.plugin._t('setting.folder.desc6'))
      .addText(text => {
        text
          .setValue(this.plugin.settings.attachmentSubPath)
          .onChange(async value => {
            this.plugin.settings.attachmentSubPath = value
            await this.plugin._saveSettings()
          })
        this._addFolderSelectBtn(text, selected => {
          this.plugin.settings.attachmentSubPath = selected
          this.plugin._saveSettings()
        })
      })
    this.attachmentSubPathSettings.settingEl.className +=
      ' smm-setting-sub-item'
    this._updateAttachmentPathSettingsVisibility()

    new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title8'))
      .setDesc(this.plugin._t('setting.folder.desc8'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.supportObSearch)
          .onChange(async value => {
            this.plugin.settings.supportObSearch = value
            await this.plugin._saveSettings()
          })
      })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title9'))
      .setDesc(this.plugin._t('setting.folder.desc9'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.saveCanvasViewData)
          .onChange(async value => {
            this.plugin.settings.saveCanvasViewData = value
            await this.plugin._saveSettings()
          })
      })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.folder.title10'))
      .setDesc(this.plugin._t('setting.folder.desc10'))
      .addDropdown(dropdown => {
        new Array(6).fill(0).forEach((_, index) => {
          dropdown.addOption(index + 1, index + 1)
        })
        dropdown
          .setValue(this.plugin.settings.nodeTextToMarkdownTitleMaxLevel)
          .onChange(async value => {
            this.plugin.settings.nodeTextToMarkdownTitleMaxLevel = value
            await this.plugin._saveSettings()
          })
      })
  }

  _addCompressSetting() {
    const { containerEl } = this

    containerEl.createEl('h2', { text: this.plugin._t('setting.title.title3') })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.compress.title1'))
      .setDesc(this.plugin._t('setting.compress.desc1'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.compressImage)
          .onChange(async value => {
            this.plugin.settings.compressImage = value
            await this.plugin._saveSettings()
            this._updateCompressImageSettingsVisibility()
          })
      })

    this.compressImageOptionsMaxWidthSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.compress.title2'))
      .setDesc(this.plugin._t('setting.compress.desc2'))
      .addText(text => {
        text
          .setValue(String(this.plugin.settings.compressImageOptionsMaxWidth))
          .onChange(async value => {
            value = validateInteger(
              value,
              DEFAULT_SETTINGS.compressImageOptionsMaxWidth,
              this.plugin._t('tip.integerInputError')
            )
            this.plugin.settings.compressImageOptionsMaxWidth = value
            await this.plugin._saveSettings()
          })
      })
    this.compressImageOptionsMaxWidthSettings.settingEl.className +=
      ' smm-setting-sub-item'
    this.compressImageOptionsMaxHeightSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.compress.title3'))
      .setDesc(this.plugin._t('setting.compress.desc3'))
      .addText(text => {
        text
          .setValue(String(this.plugin.settings.compressImageOptionsMaxHeight))
          .onChange(async value => {
            value = validateInteger(
              value,
              DEFAULT_SETTINGS.compressImageOptionsMaxHeight,
              this.plugin._t('tip.integerInputError')
            )
            this.plugin.settings.compressImageOptionsMaxHeight = value
            await this.plugin._saveSettings()
          })
      })
    this.compressImageOptionsMaxHeightSettings.settingEl.className +=
      ' smm-setting-sub-item'
    this.compressImageOptionsQualitySettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.compress.title4'))
      .setDesc(
        `${this.plugin._t('setting.compress.desc4')}，${this.plugin._t(
          'setting.compress.curValue'
        )}: ${this.plugin.settings.compressImageOptionsQuality}`
      )
      .addSlider(slider =>
        slider
          .setLimits(0, 1, 0.1)
          .setValue(this.plugin.settings.compressImageOptionsQuality)
          .onChange(async value => {
            this.plugin.settings.compressImageOptionsQuality = value
            this.compressImageOptionsQualitySettings?.setDesc(
              `${this.plugin._t('setting.compress.desc4')}，${this.plugin._t(
                'setting.compress.curValue'
              )}: ${value}`
            )
            await this.plugin._saveSettings()
          })
      )
      .addExtraButton(button =>
        button
          .setIcon('reset')
          .setTooltip(this.plugin._t('setting.compress.reset'))
          .onClick(async () => {
            const defaultValue = DEFAULT_SETTINGS.compressImageOptionsQuality
            this.plugin.settings.compressImageOptionsQuality = defaultValue
            const sliderEl = this.compressImageOptionsQualitySettings
              ?.components[0]
            if (sliderEl) {
              sliderEl.setValue(defaultValue)
              this.plugin.settings.compressImageOptionsQuality = defaultValue
              this.compressImageOptionsQualitySettings?.setDesc(
                `${this.plugin._t(
                  'setting.compress.curValue'
                )}: ${defaultValue}`
              )
            }
            await this.plugin._saveSettings()
          })
      )
    this.compressImageOptionsQualitySettings.settingEl.className +=
      ' smm-setting-sub-item'
    this._updateCompressImageSettingsVisibility()
  }

  _addEmbedSetting() {
    const { containerEl } = this

    containerEl.createEl('h2', { text: this.plugin._t('setting.title.title4') })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.embed.title3'))
      .setDesc(this.plugin._t('setting.embed.desc3'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.embedImageIsSeparateFile)
          .onChange(async value => {
            this.plugin.settings.embedImageIsSeparateFile = value
            this._updateEmbedImageFileFolderSettingsVisibility()
            await this.plugin._saveSettings()
          })
      })

    this.embedImageIsSeparateFileFolderSettings = new Setting(containerEl)
      .setName(this.plugin._t('setting.embed.title4'))
      .setDesc(this.plugin._t('setting.embed.desc4'))
      .addText(text => {
        text
          .setValue(this.plugin.settings.embedImageIsSeparateFileFolder)
          .onChange(async value => {
            this.plugin.settings.embedImageIsSeparateFileFolder = value
            await this.plugin._saveSettings()
          })
        this._addFolderSelectBtn(text, selected => {
          this.plugin.settings.embedImageIsSeparateFileFolder = selected
          this.plugin._saveSettings()
        })
      })
    this.embedImageIsSeparateFileFolderSettings.settingEl.className +=
      ' smm-setting-sub-item'
    this._updateEmbedImageFileFolderSettingsVisibility()

    new Setting(containerEl)
      .setName(this.plugin._t('setting.embed.title2'))
      .setDesc(this.plugin._t('setting.embed.desc2'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.compressImageIsTransparent)
          .onChange(async value => {
            this.plugin.settings.compressImageIsTransparent = value
            await this.plugin._saveSettings()
          })
      })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.embed.title1'))
      .setDesc(this.plugin._t('setting.embed.desc1'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.embedDblClickNewWindow)
          .onChange(async value => {
            this.plugin.settings.embedDblClickNewWindow = value
            await this.plugin._saveSettings()
          })
      })

    new Setting(containerEl)
      .setName(this.plugin._t('setting.embed.title5'))
      .setDesc(this.plugin._t('setting.embed.desc5'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.embedLinkNewWindowOpen)
          .onChange(async value => {
            this.plugin.settings.embedLinkNewWindowOpen = value
            await this.plugin._saveSettings()
          })
      })
  }

  _addFolderSelectBtn(text, callback = () => {}) {
    const inputEl = text.inputEl
    const suggestionButton = inputEl.parentElement?.createEl('button', {
      text: this.plugin._t('setting.button.select'),
      cls: 'suggestion-button'
    })
    suggestionButton?.addEventListener('click', () => {
      new SuggestionModal({
        plugin: this.plugin,
        type: 'folder',
        app: this.app,
        onSelect: selected => {
          text.setValue(selected)
          inputEl.focus()
          callback(selected)
        }
      }).open()
    })
  }

  _getFilePathOptions(full = false) {
    const res = [
      {
        name: this.plugin._t('setting.folder.option1'),
        value: 'root'
      },
      {
        name: this.plugin._t('setting.folder.option2'),
        value: 'custom'
      },
      {
        name: this.plugin._t('setting.folder.option3'),
        value: 'currentFileFolder'
      }
    ]
    if (full) {
      res.push({
        name: this.plugin._t('setting.folder.option4'),
        value: 'currentFileFolderSubFolder'
      })
    }
    return res
  }

  _updateEmbedImageFileFolderSettingsVisibility() {
    const isVisible = this.plugin.settings.embedImageIsSeparateFile
    if (this.embedImageIsSeparateFileFolderSettings) {
      this.embedImageIsSeparateFileFolderSettings.settingEl.style.display = isVisible
        ? ''
        : 'none'
    }
  }

  _updateFilePathSettingsVisibility() {
    const isVisible = this.plugin.settings.filePathType === 'custom'
    if (this.filePathSettings) {
      this.filePathSettings.settingEl.style.display = isVisible ? '' : 'none'
    }
  }

  _updateImagePathSettingsVisibility() {
    const isVisible = this.plugin.settings.imagePathType === 'custom'
    if (this.imagePathSettings) {
      this.imagePathSettings.settingEl.style.display = isVisible ? '' : 'none'
    }
    const isVisibleSub =
      this.plugin.settings.imagePathType === 'currentFileFolderSubFolder'
    if (this.imageSubPathSettings) {
      this.imageSubPathSettings.settingEl.style.display = isVisibleSub
        ? ''
        : 'none'
    }
  }

  _updateAttachmentPathSettingsVisibility() {
    const isVisible = this.plugin.settings.attachmentPathType === 'custom'
    if (this.attachmentPathSettings) {
      this.attachmentPathSettings.settingEl.style.display = isVisible
        ? ''
        : 'none'
    }
    const isVisibleSub =
      this.plugin.settings.attachmentPathType === 'currentFileFolderSubFolder'
    if (this.attachmentSubPathSettings) {
      this.attachmentSubPathSettings.settingEl.style.display = isVisibleSub
        ? ''
        : 'none'
    }
  }

  _updateCompressImageSettingsVisibility() {
    const isVisible = this.plugin.settings.compressImage
    if (this.compressImageOptionsMaxWidthSettings) {
      this.compressImageOptionsMaxWidthSettings.settingEl.style.display = isVisible
        ? ''
        : 'none'
    }
    if (this.compressImageOptionsMaxHeightSettings) {
      this.compressImageOptionsMaxHeightSettings.settingEl.style.display = isVisible
        ? ''
        : 'none'
    }
    if (this.compressImageOptionsQualitySettings) {
      this.compressImageOptionsQualitySettings.settingEl.style.display = isVisible
        ? ''
        : 'none'
    }
  }

  _addImageHostingSetting() {
    const { containerEl } = this

    containerEl.createEl('h2', { text: this.plugin._t('setting.title.title6') })

    // 是否开启图床
    new Setting(containerEl)
      .setName(this.plugin._t('setting.imageHosting.title1'))
      .setDesc(this.plugin._t('setting.imageHosting.desc1'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.useImgHosting)
          .onChange(async value => {
            if (
              value &&
              (!this.plugin.settings.imgHostingUrl ||
                !this.plugin.settings.imgHostingFormField ||
                !this.plugin.settings.imgHostingResponseField)
            ) {
              toggle.setValue(false)
              new Notice(this.plugin._t('setting.imageHosting.tip1'))
              return
            }
            this.plugin.settings.useImgHosting = value
            await this.plugin._saveSettings()
          })
      })

    // 图床url
    new Setting(containerEl)
      .setName(this.plugin._t('setting.imageHosting.title2'))
      .setDesc(this.plugin._t('setting.imageHosting.desc2'))
      .addText(text => {
        text
          .setValue(String(this.plugin.settings.imgHostingUrl))
          .onChange(async value => {
            this.plugin.settings.imgHostingUrl = value
            await this.plugin._saveSettings()
          })
      })

    // 表单字段
    new Setting(containerEl)
      .setName(this.plugin._t('setting.imageHosting.title3'))
      .setDesc(this.plugin._t('setting.imageHosting.desc3'))
      .addText(text => {
        text
          .setValue(String(this.plugin.settings.imgHostingFormField))
          .onChange(async value => {
            this.plugin.settings.imgHostingFormField = value
            await this.plugin._saveSettings()
          })
      })

    // 接口响应结构
    new Setting(containerEl)
      .setName(this.plugin._t('setting.imageHosting.title4'))
      .setDesc(
        fragWithHTML(
          this.plugin._t('setting.imageHosting.desc4') +
            '<a href="https://github.com/wanglin2/obsidian-simplemindmap/blob/main/docs/imageHosting.md" target="_blank">' +
            this.plugin._t('setting.imageHosting.desc5') +
            '</a>。'
        )
      )
      .addText(text => {
        text
          .setValue(String(this.plugin.settings.imgHostingResponseField))
          .onChange(async value => {
            this.plugin.settings.imgHostingResponseField = value
            await this.plugin._saveSettings()
          })
      })
  }

  _addOtherSetting() {
    const { containerEl } = this

    containerEl.createEl('h2', { text: this.plugin._t('setting.title.title5') })
  }

  _addHelpInfo() {
    const { containerEl } = this
    const linkEl = containerEl.createDiv('setting-item smm-setting-link-list')
    linkEl.innerHTML = `
      <div class="smm-setting-link-item">
        <a href="https://github.com/wanglin2/obsidian-simplemindmap/issues" target="_blank">
          ${GITHUB_ICON}
          <span>${this.plugin._t('setting.linkInfo.issues')}</span>
        </a>
      </div>
      <div class="smm-setting-link-item">
        <a href="https://forum.pkmer.net/" target="_blank">
          ${COMMUNITY_ICON}
          <span>${this.plugin._t('setting.linkInfo.community')}</span>
        </a>
      </div>
    `
  }
}
