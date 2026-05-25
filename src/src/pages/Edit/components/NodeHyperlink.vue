<template>
  <el-dialog
    class="nodeHyperlinkDialog smmElDialog"
    :class="{ isDark: isDark }"
    :title="$t('nodeHyperlink.title')"
    :visible.sync="dialogVisible"
    :width="'90%'"
    :top="isMobile ? '20px' : '15vh'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-tabs v-model="activeType" @tab-click="handleTypeClick">
      <el-tab-pane
        :label="$t('nodeHyperlink.tabName1')"
        name="hyperlink"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('nodeHyperlink.tabName2')"
        name="file"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('nodeHyperlink.tabName3')"
        name="localFile"
      ></el-tab-pane>
    </el-tabs>
    <div class="selectBox">
      <div class="hyperlinkBox" v-if="activeType === 'hyperlink'">
        <div class="item">
          <span class="name">{{ $t('nodeHyperlink.link') }}</span>
          <el-input
            v-model="link"
            size="mini"
            placeholder="http://xxxx.com/"
            @keyup.native.stop
            @keydown.native.stop
            @blur="handleHyperlink()"
          >
            <el-select v-model="protocol" slot="prepend" style="width: 80px;">
              <el-option label="https" value="https"></el-option>
              <el-option label="http" value="http"></el-option>
              <el-option
                :label="$t('nodeHyperlink.none')"
                value="none"
              ></el-option>
            </el-select>
          </el-input>
        </div>
        <div class="item">
          <span class="name">{{ $t('nodeHyperlink.name') }}</span>
          <el-input
            v-model="linkTitle"
            size="mini"
            @keyup.native.stop
            @keydown.native.stop
          ></el-input>
        </div>
      </div>
      <div class="fileListSearch" v-if="activeType === 'file'">
        <el-input
          v-model="searchFileText"
          size="mini"
          :placeholder="$t('fileSelectList.searchPlaceholder')"
          @keyup.native.stop
        ></el-input>
      </div>
      <div class="localFileSelect" v-if="activeType === 'localFile'">
        <el-upload
          action="x"
          accept="*"
          :file-list="localFileList"
          :auto-upload="false"
          :multiple="false"
          :on-change="onChange"
          :on-remove="onRemove"
          :limit="1"
          :on-exceed="onExceed"
        >
          <div class="btnList">
            <el-button slot="trigger" size="small" type="primary">{{
              $t('nodeHyperlink.selectLocalFile')
            }}</el-button>
          </div>
        </el-upload>
      </div>
      <div class="fileListBox smmCustomScrollbar" v-if="activeType === 'file'">
        <div class="fileItem" v-for="file in fileList" :key="file.path">
          <el-radio v-model="selectedFilePath" :label="file.path">
            <div class="fileInfo">
              <div class="fileName">{{ file.basename }}</div>
              <div class="fileFolder" v-if="file.folder !== '/'">
                {{ file.folder }}
              </div>
            </div>
          </el-radio>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small" class="smmElButtonSmall">{{
        $t('dialog.cancel')
      }}</el-button>
      <el-button
        @click="remove"
        size="small"
        class="smmElButtonSmall"
        type="danger"
        >{{ $t('nodeHyperlink.delete') }}</el-button
      >
      <el-button
        type="primary"
        @click="confirm"
        size="small"
        class="smmElButtonSmall"
        >{{ $t('nodeHyperlink.add') }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { isHyperlink, isObLinkText } from '@/utils'

export default {
  data() {
    return {
      dialogVisible: false,
      link: '',
      linkTitle: '',
      activeNodes: [],
      protocol: 'https',
      activeType: 'hyperlink',
      fileList: [],
      allFileList: null,
      selectedFilePath: '',
      searchFileText: '',
      searchTimer: null,
      localFileList: []
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      isMobile: state => state.isMobile
    })
  },
  watch: {
    searchFileText() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.fileList = []
        this.getObFiles()
      }, 300)
    }
  },
  created() {
    this.$root.$bus.$on('node_active', this.handleNodeActive)
    this.$root.$bus.$on('showNodeLink', this.handleShowNodeLink)
    this.$root.$bus.$on('remove_node_hyperlink', this.onRemoveNodeHyperlink)
  },
  beforeDestroy() {
    this.$root.$bus.$off('node_active', this.handleNodeActive)
    this.$root.$bus.$off('showNodeLink', this.handleShowNodeLink)
    this.$root.$bus.$off('remove_node_hyperlink', this.onRemoveNodeHyperlink)
  },
  methods: {
    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
    },

    handleShowNodeLink() {
      if (!this.activeNodes || this.activeNodes.length === 0) return
      if (this.activeNodes.length > 0) {
        const firstNode = this.activeNodes[0]
        const link = firstNode.getData('hyperlink') || ''
        const linkTitle = firstNode.getData('hyperlinkTitle') || ''
        if (link) {
          if (!isHyperlink(link) && isObLinkText(linkTitle)) {
            this.activeType = 'file'
            this.selectedFilePath = link
            this.getObFiles()
          } else {
            this.handleHyperlink(true)
            this.link = link
            this.linkTitle = linkTitle
            this.activeType = 'hyperlink'
          }
        }
      }
      this.dialogVisible = true
    },

    handleTypeClick() {
      if (this.activeType === 'file') {
        this.getObFiles()
      }
    },

    getObFiles() {
      try {
        let list = []
        if (this.allFileList) {
          list = this.allFileList
        } else {
          list = this.$root.$obsidianAPI.getObAllFiles().map(item => {
            return {
              folder: item.parent.path,
              path: item.path,
              basename: item.basename
            }
          })
        }
        const searchText = this.searchFileText.trim()
        if (searchText) {
          list = list.filter(item => item.basename.includes(searchText))
        }
        this.fileList = list.slice(0, 50)
      } catch (error) {
      }
    },

    removeProtocol(url) {
      return url.replace(/^https?:\/\//, '')
    },

    handleHyperlink(setProtocolNoneIfNotExist) {
      const res = this.link.match(/^(https?):\/\//)
      if (res && res[1]) {
        this.protocol = res[1]
      } else if (!this.link) {
        this.protocol = 'https'
      } else if (setProtocolNoneIfNotExist) {
        this.protocol = 'none'
      }
      this.link = this.removeProtocol(this.link)
    },

    remove() {
      this.activeNodes.forEach(node => {
        node.setHyperlink('', '')
      })
      this.cancel()
    },

    onRemoveNodeHyperlink(node) {
      node.setHyperlink('', '')
    },

    async confirm() {
      if (this.activeType === 'hyperlink') {
        if (!this.link) {
          this.$root.$obsidianAPI.showTip(this.$t('nodeHyperlink.tip1'))
          return
        }
        const link =
          (this.protocol === 'none' ? '' : this.protocol + '://') + this.link
        this.activeNodes.forEach(node => {
          node.setHyperlink(link, this.linkTitle)
        })
      } else if (this.activeType === 'file') {
        if (!this.selectedFilePath) {
          return
        }
        this.addObFilePathToNode(this.selectedFilePath)
      } else if (this.activeType === 'localFile') {
        if (this.localFileList.length <= 0) {
          this.$root.$obsidianAPI.showTip(this.$t('nodeHyperlink.tip3'))
          return
        }
        const file = this.localFileList[0].raw
        const result = await this.$root.$obsidianAPI.saveFileToVault(
          file,
          false
        )
        if (!result) {
          this.$root.$obsidianAPI.showTip(this.$t('nodeHyperlink.tip4'))
          return
        }
        this.addObFilePathToNode(result)
      }
      this.cancel()
    },

    addObFilePathToNode(filePath) {
      const res = this.$root.$obsidianAPI.createLinkInfoFromFilePath(filePath)
      if (!res) {
        this.$root.$obsidianAPI.showTip(this.$t('nodeHyperlink.tip2'))
      } else {
        this.activeNodes.forEach(node => {
          node.setHyperlink(res.link, res.linkText)
        })
      }
    },

    cancel() {
      clearTimeout(this.searchTimer)
      this.dialogVisible = false
      this.activeNodes = []
      this.selectedFilePath = ''
      this.link = ''
      this.linkTitle = ''
      this.protocol = 'https'
      this.fileList = []
      this.allFileList = null
      this.activeType = 'hyperlink'
      this.searchFileText = ''
      this.localFileList = []
    },

    onChange(file) {
      this.localFileList.push(file)
    },

    onRemove(file, fileList) {
      this.localFileList = fileList
    },

    onExceed() {
      this.$root.$obsidianAPI.showTip(this.$t('import.maxFileNum'))
    }
  }
}
</script>

<style lang="less" scoped>
.nodeHyperlinkDialog {
  &.isDark {
    .item {
      .name {
        color: hsla(0, 0%, 100%, 0.6);
      }
    }

    .selectBox {
      .fileListBox {
        .fileItem {
          /deep/ .el-radio {
            &:hover {
              background-color: #373b3f;
            }
          }
        }
      }
    }
  }

  /deep/ .el-dialog {
    max-width: 600px;

    .el-dialog__body {
      padding: 0 20px;

      .el-tabs__header {
        margin-bottom: 10px;
      }
    }
  }

  .selectBox {
    .hyperlinkBox {
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .name {
          display: block;
          width: 50px;
        }
      }
    }

    .fileListBox {
      max-height: 200px;
      overflow-y: auto;

      .fileItem {
        /deep/ .el-radio {
          width: 100%;
          display: flex;
          padding: 10px;

          &:hover {
            background-color: #ededed;
          }
        }

        .fileInfo {
          .fileName {
          }

          .fileFolder {
            color: #909090;
            margin-top: 4px;
          }
        }
      }
    }
  }
}
</style>
