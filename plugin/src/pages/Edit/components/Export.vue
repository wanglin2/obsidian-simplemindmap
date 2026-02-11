<template>
  <el-dialog
    class="nodeExportDialog smmElDialog"
    :class="{ isMobile: isMobile, isDark: isDark }"
    :title="$t('export.title')"
    :visible.sync="dialogVisible"
    v-loading.lock="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :width="'90%'"
    :top="isMobile ? '20px' : '15vh'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="exportContainer" :class="{ isDark: isDark }">
      <div class="downloadTypeSelectBox">
        <div class="downloadTypeList smmCustomScrollbar">
          <div
            class="downloadTypeItem"
            v-for="item in downTypeList"
            :key="item.type"
            :class="{
              active: exportType === item.type
            }"
            @click="exportType = item.type"
          >
            <div class="typeIcon" :class="[item.type]"></div>
            <div class="name">{{ item.name }}</div>
            <div class="icon checked el-icon-check"></div>
          </div>
        </div>
        <div class="downloadTypeContent">
          <div class="nameInputBox">
            <div class="nameInput">
              <span class="name">{{ $t('export.filename') }}</span>
              <el-input
                style="max-width: 250px"
                v-model="fileName"
                size="mini"
                @keydown.native.stop
              ></el-input>
            </div>
            <span class="closeBtn el-icon-close" @click="cancel"></span>
          </div>
          <div class="contentBox smmCustomScrollbar">
            <div class="contentRow">
              <div class="contentName">{{ $t('export.format') }}</div>
              <div class="contentValue info">
                {{ currentTypeData ? '.' + currentTypeData.type : '' }}
              </div>
            </div>
            <div class="contentRow">
              <div class="contentName">{{ $t('export.desc') }}</div>
              <div class="contentValue info">
                {{ currentTypeData ? currentTypeData.desc : '' }}
              </div>
            </div>
            <div class="contentRow">
              <div class="contentName">{{ $t('export.options') }}</div>
              <div class="contentValue info" v-if="noOptions">无</div>
              <div class="contentValue" v-else>
                <div
                  class="valueItem"
                  v-show="['smm', 'json'].includes(exportType)"
                >
                  <el-checkbox v-model="widthConfig">{{
                    $t('export.include')
                  }}</el-checkbox>
                </div>
                <div
                  class="valueItem"
                  v-show="['svg', 'png', 'pdf'].includes(exportType)"
                >
                  <div class="valueSubItem" v-if="['png'].includes(exportType)">
                    <span class="name">{{ $t('export.format') }}</span>
                    <el-radio-group v-model="imageFormat">
                      <el-radio label="png">PNG</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="valueSubItem">
                    <span class="name">{{ $t('export.paddingX') }}</span>
                    <el-input
                      style="width: 200px"
                      v-model="paddingX"
                      size="mini"
                      @change="onPaddingChange"
                      @keydown.native.stop
                    ></el-input>
                  </div>
                  <div class="valueSubItem">
                    <span class="name">{{ $t('export.paddingY') }}</span>
                    <el-input
                      style="width: 200px"
                      v-model="paddingY"
                      size="mini"
                      @change="onPaddingChange"
                      @keydown.native.stop
                    ></el-input>
                  </div>
                  <div class="valueSubItem">
                    <span class="name">{{
                      this.$t('export.addFooterText')
                    }}</span>
                    <el-input
                      style="width: 200px"
                      v-model="extraText"
                      size="mini"
                      :placeholder="$t('export.addFooterTextPlaceholder')"
                      @keydown.native.stop
                    ></el-input>
                  </div>
                  <div
                    class="valueSubItem"
                    v-show="['png', 'pdf', 'svg'].includes(exportType)"
                  >
                    <el-checkbox v-model="isTransparent">{{
                      $t('export.isTransparent')
                    }}</el-checkbox>
                  </div>
                  <div class="valueSubItem" v-show="showFitBgOption">
                    <el-checkbox v-model="isFitBg">{{
                      $t('export.isFitBg')
                    }}</el-checkbox>
                  </div>
                  <div class="valueSubItem" v-if="exportType === 'pdf'">
                    <el-checkbox v-model="pdfPagingExport"
                      >分页导出</el-checkbox
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btnList">
            <el-button @click="cancel" size="small" class="smmElButtonSmall">{{
              $t('dialog.cancel')
            }}</el-button>
            <el-button
              type="primary"
              @click="confirm"
              size="small"
              class="smmElButtonSmall"
              >{{ $t('export.confirm') }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { downTypeList } from '@/config'
import { createUid } from 'simple-mind-map/src/utils/index'
import MarkdownIt from 'markdown-it'
import { isHyperlink, isNormalUrl, imageUrlToBase64 } from '@/utils'

let md = null
export default {
  data() {
    return {
      dialogVisible: false,
      exportType: 'smm',
      fileName: this.$t('export.defaultFileName'),
      widthConfig: true,
      isTransparent: false,
      loading: false,
      loadingText: '',
      paddingX: 10,
      paddingY: 10,
      extraText: '',
      isFitBg: true,
      imageFormat: 'png',
      pdfPagingExport: false
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      isMobile: state => state.isMobile
    }),

    downTypeList() {
      return downTypeList[this.$i18n.locale] || downTypeList.en
    },

    currentTypeData() {
      const cur = this.downTypeList.find(item => {
        return item.type === this.exportType
      })
      return cur
    },

    showFitBgOption() {
      return ['png', 'pdf'].includes(this.exportType) && !this.isTransparent
    },

    noOptions() {
      return ['md', 'xmind', 'txt', 'xlsx', 'mm'].includes(this.exportType)
    }
  },
  created() {
    this.$root.$bus.$on('showExport', this.handleShowExport)
  },
  beforeDestroy() {
    this.$root.$bus.$off('showExport', this.handleShowExport)
  },
  methods: {
    ...mapMutations(['setExtraTextOnExport']),

    handleShowExport() {
      this.dialogVisible = true
    },

    onPaddingChange() {
      this.$root.$bus.$emit('paddingChange', {
        exportPaddingX: Number(this.paddingX),
        exportPaddingY: Number(this.paddingY)
      })
    },

    cancel() {
      this.dialogVisible = false
    },

    confirm() {
      if (this.exportType === 'xlsx') {
        if (this.fileName.length > 31) {
          this.$message.error('导出Excel文件名称长度不能超过31个字符')
          return
        }
      }
      this.setExtraTextOnExport(this.extraText)
      if (this.exportType === 'svg') {
        this.$root.$bus.$emit(
          'export',
          this.exportType,
          true,
          this.fileName,
          this.isTransparent
        )
      } else if (['smm', 'json'].includes(this.exportType)) {
        this.$root.$bus.$emit(
          'export',
          this.exportType,
          true,
          this.fileName,
          this.widthConfig,
          this.transformMindMapData
        )
      } else if (this.exportType === 'png') {
        this.$root.$bus.$emit(
          'export',
          this.imageFormat,
          true,
          this.fileName,
          this.isTransparent,
          null,
          this.isFitBg
        )
      } else if (this.exportType === 'pdf') {
        this.$root.$bus.$emit(
          'export',
          this.exportType,
          true,
          this.fileName,
          this.isTransparent,
          this.isFitBg,
          false,
          this.pdfPagingExport
        )
      } else if (this.exportType === 'mm') {
        this.$root.$bus.$emit('export', this.exportType, true, this.fileName, {
          transformNote: note => {
            if (!md) {
              md = new MarkdownIt()
            }
            return md.render(note)
          },
          transformImage: img => {
            if (isHyperlink(img)) {
              return img
            } else {
              return ''
            }
          }
        })
      } else if (this.exportType === 'xmind') {
        this.$root.$bus.$emit(
          'export',
          this.exportType,
          true,
          this.fileName,
          this.transformMindMapData
        )
      } else if (this.exportType === 'md') {
        const {
          nodeTextToMarkdownTitleMaxLevel
        } = this.$root.$obsidianAPI.getSettings()
        this.$root.$bus.$emit(
          'export',
          this.exportType,
          true,
          this.fileName,
          nodeTextToMarkdownTitleMaxLevel
        )
      } else {
        this.$root.$bus.$emit('export', this.exportType, true, this.fileName)
      }
      this.cancel()
    },

    async transformMindMapData(data) {
      if (!data) return
      const waitLoadImageList = []
      const nodeTree = data.root ? data.root : data
      const imgMap = nodeTree.data.imgMap || {}
      const pathToKeyMap = {}
      const walk = root => {
        const image = root.data.image
        if (image && !isNormalUrl(image)) {
          const imagePath = this.$root.$obsidianAPI.getResourcePath(image)
          if (imagePath) {
            if (pathToKeyMap[imagePath]) {
              root.data.image = pathToKeyMap[imagePath]
            } else {
              waitLoadImageList.push(
                new Promise(async resolve => {
                  try {
                    const base64 = await imageUrlToBase64(imagePath)
                    const key = 'smm_img_key_' + createUid()
                    pathToKeyMap[imagePath] = key
                    imgMap[key] = base64
                    root.data.image = key
                    resolve()
                  } catch (error) {
                    resolve()
                  }
                })
              )
            }
          }
        }
        if (root.children && root.children.length > 0) {
          root.children.forEach(child => {
            walk(child)
          })
        }
      }
      walk(nodeTree)
      if (waitLoadImageList.length > 0) {
        await Promise.all(waitLoadImageList)
      }
      nodeTree.data.imgMap = imgMap
    }
  }
}
</script>

<style lang="less" scoped>
.nodeExportDialog {
  .exportContainer {
    &.isDark {
      .downloadTypeSelectBox {
        .downloadTypeList {
          background-color: #363b3f;

          .downloadTypeItem {
            background-color: #363b3f;

            &.active {
              background-color: #262a2e;
            }

            .name {
              color: hsla(0, 0%, 100%, 0.9);
            }
          }
        }

        .downloadTypeContent {
          .nameInputBox {
            border-bottom: 1px solid hsla(0, 0%, 100%, 0.2);

            .nameInput {
              .name {
                color: hsla(0, 0%, 100%, 0.6);
              }
            }

            .closeBtn {
              color: hsla(0, 0%, 100%, 0.6);
            }
          }

          .contentBox {
            .contentRow {
              .contentName {
                color: hsla(0, 0%, 100%, 0.6);
              }

              .contentValue {
                color: hsla(0, 0%, 100%, 0.6);

                &.info {
                  background-color: transparent;
                }

                .valueItem {
                  .valueSubItem {
                    .name {
                      color: hsla(0, 0%, 100%, 0.6);
                    }
                  }
                }
              }
            }
          }

          .btnList {
            border-top: 1px solid hsla(0, 0%, 100%, 0.2);
          }
        }
      }
    }
  }
}

.nodeExportDialog {
  &.isDark {
    /deep/ .el-dialog__body {
      .el-checkbox {
        .el-checkbox__label {
          color: hsla(0, 0%, 100%, 0.6);
        }
      }
    }
  }

  /deep/ .el-dialog {
    border-radius: 10px;
    overflow: hidden;
    max-width: 700px;

    .el-dialog__header {
      display: none;
    }
  }

  /deep/ .el-dialog__body {
    padding: 0;

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: var(--text-accent) !important;
    }

    .el-checkbox {
      .el-checkbox__label {
        color: #1a1a1a;
      }
    }
  }

  &.isMobile {
    .exportContainer {
      .downloadTypeSelectBox {
        flex-direction: column;

        .downloadTypeList {
          width: 100%;
          display: flex;
          align-items: center;
          overflow-x: auto;
          height: 60px;
          overflow-y: hidden;

          .downloadTypeItem {
            width: 100px;
            flex-shrink: 0;
            padding-left: 5px;
            padding-right: 5px;

            .icon {
              margin-right: 5px;

              &.checked {
                display: none !important;
              }
            }
          }
        }

        .downloadTypeContent {
          .nameInputBox {
            height: 70px;

            .nameInput {
              .name {
                margin-bottom: 5px;
              }
            }
          }

          .contentBox {
            .contentRow {
              flex-direction: column;

              .contentName {
                margin-bottom: 10px;
              }

              .contentValue {
                .valueItem {
                  .valueSubItem {
                    display: flex;
                    flex-direction: column;

                    .name {
                      margin-bottom: 5px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .exportContainer {
    width: 100%;
    height: 450px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .downloadTypeSelectBox {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;

      .downloadTypeList {
        width: 208px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #f2f4f7;
        flex-shrink: 0;
        padding: 16px 0;

        .downloadTypeItem {
          width: 100%;
          height: 52px;
          padding: 0 30px;
          overflow: hidden;
          display: flex;
          align-items: center;
          cursor: pointer;

          &.active {
            background-color: #fff;

            .icon {
              &.checked {
                display: block;
              }
            }
          }

          .icon {
            font-size: 25px;
            font-weight: 700;

            &.checked {
              color: var(--text-accent);
              font-size: 20px;
              margin-left: auto;
              display: none;
            }
          }

          .typeIcon {
            margin-right: 18px;
            flex-shrink: 0;
            width: 23px;
            height: 26px;
            background-size: cover;

            &.png {
              background-image: url('../../../assets/img/foramt/2.png');
            }

            &.pdf {
              background-image: url('../../../assets/img/foramt/4.png');
            }

            &.md {
              background-image: url('../../../assets/img/foramt/5.png');
            }

            &.json {
              background-image: url('../../../assets/img/foramt/10.png');
            }

            &.svg {
              background-image: url('../../../assets/img/foramt/3.png');
            }

            &.smm {
              background-image: url('../../../assets/img/foramt/1.png');
            }

            &.xmind {
              background-image: url('../../../assets/img/foramt/6.png');
            }

            &.txt {
              background-image: url('../../../assets/img/foramt/7.png');
            }
          }

          .name {
            color: #333;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold;
          }
        }
      }

      .downloadTypeContent {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .nameInputBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 67px;
          flex-shrink: 0;
          border-bottom: 1px solid #f2f4f7;
          padding-left: 40px;
          padding-right: 20px;
          padding-top: 16px;

          .nameInput {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 100%;
            font-weight: bold;

            .name {
              margin-right: 10px;
              font-size: 15px;
              color: #333;
              font-weight: bold;
            }
          }

          .closeBtn {
            font-size: 20px;
            cursor: pointer;
          }
        }

        .contentBox {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 15px 40px;

          .contentRow {
            display: flex;
            font-size: 14px;
            margin-bottom: 20px;
            width: 100%;
            overflow: hidden;

            &:last-of-type {
              margin-bottom: 0;
            }

            .contentName {
              min-width: 40px;
              color: #808080;
              flex-shrink: 0;
              font-size: 13px;
              font-weight: 500;
              line-height: 25px;
              margin-right: 12px;
            }

            .contentValue {
              color: #808080;
              line-height: 23px;
              font-weight: 500;
              border: 1px solid transparent;
              font-size: 14px;
              overflow: hidden;

              &.info {
                color: var(--text-accent);
                background-color: rgb(245, 248, 249);
                border: 1px solid var(--color-accent);
                border-radius: 5px;
                padding: 0 16px;
              }

              .valueItem {
                .valueSubItem {
                  margin-bottom: 12px;
                  display: flex;
                  align-items: center;
                  color: #1a1a1a;
                  overflow: hidden;

                  &:last-of-type {
                    margin-right: 0;
                  }

                  &.alignCenter {
                    align-items: center;
                  }

                  .name {
                    margin-right: 12px;
                    min-width: 85px;
                  }
                }
              }
            }
          }
        }

        .btnList {
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 69px;
          flex-shrink: 0;
          border-top: 1px solid #f2f4f7;
        }
      }
    }
  }
}
</style>
