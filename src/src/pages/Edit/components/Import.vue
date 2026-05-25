<template>
  <div>
    <el-dialog
      class="nodeImportDialog smmElDialog"
      :title="$t('import.title')"
      :visible.sync="dialogVisible"
      width="350px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dragUploadBox">
        <div class="dragUploadAreaBox">
          <label
            class="dragUploadInputArea"
            @dragenter.stop.prevent
            @dragover.stop.prevent
            @drop.stop.prevent="onDrop"
            >{{ $t('import.dragTip') }}</label
          >
        </div>
      </div>
      <el-upload
        action="x"
        :accept="supportFileStr"
        :file-list="fileList"
        :auto-upload="false"
        :multiple="false"
        :on-change="onChange"
        :on-remove="onRemove"
        :limit="1"
        :on-exceed="onExceed"
      >
        <div class="btnList">
          <el-button slot="trigger" size="small" type="primary">{{
            $t('import.selectFile')
          }}</el-button>
        </div>
        <div slot="tip" class="el-upload__tip">
          <div>
            <el-checkbox
              v-model="transformFormula"
              style="margin-bottom: 5px;margin-top: 6px;"
              >转换数学公式</el-checkbox
            >
          </div>
          <div class="tip">
            {{ $t('import.support') }}{{ supportFileStr
            }}{{ $t('import.file') }}
          </div>
          <div class="warningTip">{{ $t('import.warningTip') }}</div>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small" class="smmElButtonSmall">{{
          $t('dialog.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="confirm"
          size="small"
          class="smmElButtonSmall"
          >{{ $t('dialog.confirm') }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="xmindCanvasSelectDialog smmElDialog"
      :title="$t('import.xmindCanvasSelectDialogTitle')"
      :visible.sync="xmindCanvasSelectDialogVisible"
      width="300px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-radio-group v-model="selectCanvas" class="canvasList">
        <el-radio
          v-for="(item, index) in canvasList"
          :key="index"
          :label="index"
          >{{ item.title }}</el-radio
        >
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmSelect"
          size="small"
          class="smmElButtonSmall"
          >{{ $t('dialog.confirm') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import xmind from 'simple-mind-map/src/parse/xmind.js'
import markdown from 'simple-mind-map/src/parse/markdown.js'
import txt from 'simple-mind-map/src/parse/txt.js'
import { mapMutations } from 'vuex'
import { base64ToFile, tFileToFile } from '@/utils'
import { getDataFromDt } from '@/components/ImgUpload/utils'

const mimeTypes = {
  md: 'text/markdown',
  json: 'application/json',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export default {
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      selectPromiseResolve: null,
      xmindCanvasSelectDialogVisible: false,
      selectCanvas: '',
      canvasList: [],
      transformFormula: true
    }
  },
  computed: {
    supportFileStr() {
      return '.smm,.json,.xmind,.md,.txt'
    }
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (!val && oldVal) {
        this.fileList = []
      }
    }
  },
  created() {
    this.$root.$bus.$on('showImport', this.handleShowImport)
    this.$root.$bus.$on('importFile', this.handleImportFile)
  },
  beforeDestroy() {
    this.$root.$bus.$off('showImport', this.handleShowImport)
    this.$root.$bus.$off('importFile', this.handleImportFile)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    handleShowImport() {
      this.dialogVisible = true
    },

    getRegexp() {
      return new RegExp(`\.(smm|json|xmind|md|txt)$`)
    },

    async onDrop(e) {
      const { file, text } = await getDataFromDt(e.dataTransfer)
      if (file) {
        this.onChange({
          raw: file,
          name: file.name
        })
      } else if (text) {
        const tFile = this.$root.$obsidianAPI.getFileFromUri(text)
        if (tFile) {
          const fileRaw = await tFileToFile(
            tFile,
            this.$root.$obsidianAPI.getObsidianApp(),
            mimeTypes
          )
          this.onChange({
            raw: fileRaw,
            name: fileRaw.name
          })
        }
      }
    },

    onChange(file) {
      if (!this.getRegexp().test(file.name)) {
        this.$root.$obsidianAPI.showTip(
          this.$t('import.pleaseSelect') +
            this.supportFileStr +
            this.$t('import.file')
        )
        this.fileList = []
      } else {
        this.fileList.push(file)
      }
    },

    onRemove(file, fileList) {
      this.fileList = fileList
    },

    onExceed() {
      this.$root.$obsidianAPI.showTip(this.$t('import.maxFileNum'))
    },

    cancel() {
      this.dialogVisible = false
    },

    confirm() {
      if (this.fileList.length <= 0) {
        return this.$root.$obsidianAPI.showTip(this.$t('import.notSelectTip'))
      }
      this.$root.$bus.$emit('showLoading')
      let file = this.fileList[0]
      if (/\.(smm|json)$/.test(file.name)) {
        this.handleSmm(file)
      } else if (/\.xmind$/.test(file.name)) {
        this.handleXmind(file)
      } else if (/\.md$/.test(file.name)) {
        this.handleMd(file)
      } else if (/\.txt$/.test(file.name)) {
        this.handleTxt(file)
      }
      this.cancel()
      this.setActiveSidebar(null)
    },

    handleSmm(file) {
      let fileReader = new FileReader()
      fileReader.readAsText(file.raw)
      fileReader.onload = async evt => {
        try {
          let data = JSON.parse(evt.target.result)
          if (typeof data !== 'object') {
            throw new Error(this.$t('import.fileContentError'))
          }
          await this.transformImgToFile(data)
          this.$root.$bus.$emit('setData', data)
          this.$root.$obsidianAPI.showTip(this.$t('import.importSuccess'))
        } catch (error) {
          this.$root.$obsidianAPI.showTip(this.$t('import.fileParsingFailed'))
        }
      }
    },

    async handleXmind(file) {
      try {
        let data = await xmind.parseXmindFile(file.raw, content => {
          this.showSelectXmindCanvasDialog(content)
          return new Promise(resolve => {
            this.selectPromiseResolve = resolve
          })
        })
        this.handleDataFormula(data)
        await this.transformImgToFile(data)
        this.$root.$bus.$emit('setData', data)
        this.$root.$obsidianAPI.showTip(this.$t('import.importSuccess'))
      } catch (error) {
        this.$root.$obsidianAPI.showTip(this.$t('import.fileParsingFailed'))
      }
    },

    handleTxt(file) {
      const fileReader = new FileReader()
      fileReader.readAsText(file.raw)
      fileReader.onload = async evt => {
        try {
          const data = txt.txtTo(evt.target.result)
          this.handleDataFormula(data)
          this.$root.$bus.$emit('setData', data)
          this.$root.$obsidianAPI.showTip(this.$t('import.importSuccess'))
        } catch (error) {
          this.$root.$obsidianAPI.showTip(
            error || this.$t('import.fileParsingFailed')
          )
        }
      }
    },

    showSelectXmindCanvasDialog(content) {
      this.canvasList = content
      this.selectCanvas = 0
      this.xmindCanvasSelectDialogVisible = true
    },

    confirmSelect() {
      this.selectPromiseResolve(this.canvasList[this.selectCanvas])
      this.xmindCanvasSelectDialogVisible = false
      this.canvasList = []
      this.selectCanvas = 0
    },

    convertMathFormula(text) {
      const html = text.replace(/\$([^\$]+)\$/g, (match, p1) => {
        return `<span class="ql-formula" data-value="${p1}">
        ${this.$root.$getCurrentMindMap().formula.renderToString(p1)}
        </span>`
      })
      return `<p>
        ${html}
      </p>`
    },

    handleDataFormula(data) {
      if (!this.transformFormula) return
      const walk = node => {
        if (node.data.text && /\$([^\$]+)\$/g.test(node.data.text)) {
          node.data.text = this.convertMathFormula(node.data.text)
          node.data.richText = true
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach(walk)
        }
      }
      walk(data)
    },

    async handleMd(file) {
      let fileReader = new FileReader()
      fileReader.readAsText(file.raw)
      fileReader.onload = async evt => {
        try {
          let data = await markdown.transformMarkdownTo(
            evt.target.result,
            false,
            file.raw.name
          )
          this.handleDataFormula(data)
          if (!data) {
            this.$root.$obsidianAPI.showTip(this.$t('import.mdImportFailTip'))
            this.$root.$bus.$emit('hideLoading')
            return
          }
          this.$root.$bus.$emit('setData', data)
          this.$root.$obsidianAPI.showTip(this.$t('import.importSuccess'))
        } catch (error) {
          this.$root.$obsidianAPI.showTip(this.$t('import.fileParsingFailed'))
        }
      }
    },

    handleImportFile(file) {
      this.onChange({
        raw: file,
        name: file.name
      })
      if (this.fileList.length <= 0) return
      this.confirm()
    },

    async transformImgToFile(data) {
      if (!data) return
      const nodeTree = data.root ? data.root : data
      const waitLoadImageList = []
      const imgMap = nodeTree.data.imgMap || {}
      const walk = root => {
        const image = root.data.image
        const imageTitle = root.data.imageTitle || ''
        let dataUrl = ''
        if (image) {
          if (/^data:/.test(image)) {
            dataUrl = image
          } else if (imgMap[image] && /^data:/.test(imgMap[image])) {
            dataUrl = imgMap[image]
          }
        }
        if (dataUrl) {
          waitLoadImageList.push(
            new Promise(async resolve => {
              try {
                const res = await this.$root.$obsidianAPI.saveFileToVault(
                  base64ToFile(dataUrl, imageTitle)
                )
                root.data.image = res
                resolve()
              } catch (error) {
                resolve()
              }
            })
          )
        }
        if (root.children && root.children.length > 0) {
          root.children.forEach(child => {
            walk(child)
          })
        }
      }
      walk(nodeTree)
      delete nodeTree.data.imgMap
      if (waitLoadImageList.length > 0) {
        await Promise.all(waitLoadImageList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nodeImportDialog {
  /deep/ .el-dialog__body {
    padding-top: 0;
  }

  .warningTip {
    color: #f56c6c;
    margin-top: 4px;
  }

  .dragUploadBox {
    position: relative;
    width: 100%;
    height: 100px;
    margin-bottom: 12px;

    &.isDark {
      .dragUploadAreaBox {
        .dragUploadInputArea {
          background-color: #363b3f;
          color: hsla(0, 0%, 100%, 0.6);
        }
      }
    }

    .dragUploadAreaBox {
      width: 100%;
      height: 100%;

      .dragUploadInputArea {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 20px;
        color: rgba(51, 51, 51, 0.4);
        background-color: hsla(0, 0%, 87%, 0.6);
        border: none;
        outline: none;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: normal;
        padding: 10px;
      }
    }
  }

  .btnList {
    display: flex;
    align-items: center;
  }
}

.canvasList {
  display: flex;
  flex-direction: column;

  /deep/ .el-radio {
    margin-bottom: 12px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
