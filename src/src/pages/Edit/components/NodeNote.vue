<template>
  <div
    class="nodeNoteEditContainer"
    :class="{ isDark: isDark }"
    v-show="dialogVisible"
  >
    <div class="nodeNoteEditContent" :class="{ isFullScreen: isFullScreen }">
      <div class="editWrap">
        <div
          class="noteEditor"
          ref="noteEditor"
          @keyup.stop
          @keydown.stop
        ></div>
        <!-- 全屏 -->
        <div
          class="fullScreenBtn"
          :class="{ active: isFullScreen }"
          @click="toggleFullScreen"
          :title="isFullScreen ? '退出全屏' : '全屏'"
        >
          <span class="icon iconfont iconquanping1"></span>
        </div>
      </div>
      <div class="footer">
        <el-button @click="cancel" size="small" class="elButtonSmall">{{
          $t('dialog.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="confirm"
          size="small"
          class="elButtonSmall"
          >{{ $t('dialog.confirm') }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/i18n/zh-cn'
import '@toast-ui/editor/dist/i18n/zh-TW'
import { mapState } from 'vuex'
import { toastUiEditorLangMap } from '@/config/constant'
import { compressImage, isNormalUrl } from '@/utils'
import noteMixin from '@/mixins/note'

export default {
  mixins: [noteMixin],
  data() {
    return {
      dialogVisible: false,
      note: '',
      activeNodes: [],
      editor: null,
      appointNode: null,
      isFullScreen: false
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      isMobile: state => state.isMobile
    })
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (!val && oldVal) {
        this.$root.$bus.$emit('endTextEdit')
      }
    }
  },
  created() {
    this.$root.$bus.$on('node_active', this.handleNodeActive)
    this.$root.$bus.$on('showNodeNote', this.handleShowNodeNote)
  },
  beforeDestroy() {
    this.$root.$bus.$off('node_active', this.handleNodeActive)
    this.$root.$bus.$off('showNodeNote', this.handleShowNodeNote)
  },
  methods: {
    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
      this.updateNoteInfo()
    },

    updateNoteInfo() {
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        this.note = firstNode.getData('note') || ''
      } else {
        this.note = ''
      }
    },

    handleShowNodeNote(node) {
      if (this.activeNodes.length === 0 && !node) return
      this.$root.$bus.$emit('startTextEdit')
      if (node) {
        this.appointNode = node
        this.note = node.getData('note') || ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    },

    initEditor() {
      if (!this.editor) {
        this.editor = new Editor({
          el: this.$refs.noteEditor,
          height: '100%',
          initialEditType: 'markdown',
          previewStyle: 'vertical',
          theme: this.isDark ? 'dark' : 'light',
          language:
            toastUiEditorLangMap[this.$i18n.locale] || toastUiEditorLangMap.en,
          customHTMLRenderer: {
            image: (node, { entering }) => {
              if (!entering) return null
              let url = node.destination || node.src
              if (!isNormalUrl(url)) {
                url = this.$root.$obsidianAPI.getResourcePath(
                  decodeURIComponent(url)
                )
              }
              return {
                type: 'html',
                content: `<img data-url="${url}" />`
              }
            }
          },
          events: {
            change: () => {
              this.$nextTick(() => {
                const imgs = document.querySelectorAll(
                  '.toastui-editor-md-preview img'
                )
                const img2 = document.querySelectorAll(
                  '.toastui-editor-ww-container img'
                )
                this.fixNoteImg([...Array.from(imgs), ...Array.from(img2)])
              })
            }
          },
          hooks: {
            addImageBlobHook: async (file, callback) => {
              try {
                const {
                  compressImage: isCompress,
                  compressImageOptionsMaxWidth,
                  compressImageOptionsMaxHeight,
                  compressImageOptionsQuality
                } = this.$root.$obsidianAPI.getSettings()
                if (isCompress) {
                  file = await compressImage(file, {
                    exportType: 'file',
                    maxWidth: compressImageOptionsMaxWidth,
                    maxHeight: compressImageOptionsMaxHeight,
                    quality: compressImageOptionsQuality
                  })
                }
                const result = await this.$root.$obsidianAPI.saveFileToVault(
                  file
                )
                if (!result) {
                  throw new Error(this.$t('imageUpload.failTip'))
                }
                callback(result)
              } catch (error) {
              }
            }
          }
        })
      }
      this.editor.setMarkdown(this.note)
    },

    cancel() {
      this.dialogVisible = false
      if (this.appointNode) {
        this.appointNode = null
        this.updateNoteInfo()
      }
    },

    confirm() {
      this.note = this.editor.getMarkdown()
      if (this.appointNode) {
        this.appointNode.setNote(this.note)
      } else {
        this.activeNodes.forEach(node => {
          node.setNote(this.note)
        })
      }
      this.cancel()
    },

    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen
    }
  }
}
</script>

<style lang="less" scoped>
.nodeNoteEditContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;

  &.isDark {
    .nodeNoteEditContent {
      background-color: #262a2e;
    }
  }

  .nodeNoteEditContent {
    position: absolute;
    top: 0;
    right: 0;
    width: 600px;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
    border-left: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: 27px;

    &.isFullScreen {
      width: 100%;
    }

    .editWrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;

      .fullScreenBtn {
        position: absolute;
        right: 0px;
        top: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 3px;
        margin: 7px 5px;
        border: 1px solid #f7f9fc;

        &:hover {
          border: 1px solid #e4e7ee;
          background-color: #fff;
        }

        &.active {
          color: #00a9ff;
        }

        .icon {
          font-size: 16px;
        }
      }
    }

    .footer {
      flex-shrink: 0;
      height: 50px;
      padding: 0 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
