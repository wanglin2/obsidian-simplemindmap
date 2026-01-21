<template>
  <el-dialog
    class="nodeImageDialog smmElDialog"
    :class="{ isDark: isDark }"
    :title="$t('nodeImage.title')"
    :visible.sync="dialogVisible"
    :width="'90%'"
    :top="isMobile ? '20px' : '15vh'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div v-if="dialogVisible">
      <div class="tip">{{ $t('nodeImage.tip') }}</div>
      <div class="title">1.{{ $t('nodeImage.selectLocal') }}</div>
      <ImgUpload
        ref="ImgUpload"
        v-model="img"
        style="margin-bottom: 12px;"
        @selectObFile="onImgUploadSelectObFile"
      ></ImgUpload>
      <div class="inputBox">
        <span class="inputTitle" :title="$t('nodeImage.selectVault')"
          >2.{{ $t('nodeImage.selectVault') }}</span
        >
        <el-select
          v-model="obFile"
          filterable
          :placeholder="''"
          class="obFileSelect"
          popper-class="smmObFileSelectPopper"
          clearable
          :remote-method="getObFileList"
          @change="onObFileChange"
        >
          <el-option
            v-for="item in obFileList"
            :key="item.path"
            :label="item.basename"
            :value="item.path"
          >
            <div class="fileName">{{ item.basename }}</div>
            <div class="folder">{{ item.folder }}</div>
          </el-option>
        </el-select>
      </div>
      <div class="inputBox">
        <span class="inputTitle" :title="$t('nodeImage.selectUrl')"
          >3.{{ $t('nodeImage.selectUrl') }}</span
        >
        <el-input
          v-model="imgUrl"
          size="mini"
          placeholder="http://xxx.com/xx.jpg"
          @keydown.native.stop
          @change="onImgUrlChange"
        ></el-input>
      </div>
      <div class="inputBox">
        <span class="inputTitle" :title="$t('nodeImage.imgTitle')">{{
          $t('nodeImage.imgTitle')
        }}</span>
        <el-input
          v-model="imgTitle"
          size="mini"
          @keydown.native.stop
        ></el-input>
      </div>
    </div>
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
</template>

<script>
import ImgUpload from '@/components/ImgUpload/index.vue'
import { getImageSize } from 'simple-mind-map/src/utils/index'
import { mapState } from 'vuex'
import { isNormalUrl } from '@/utils'

export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      dialogVisible: false,
      img: '',
      imgUrl: '',
      imgTitle: '',
      activeNodes: null,
      obFileList: [],
      obFile: '',
      allObFileList: null
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      isMobile: state => state.isMobile
    })
  },
  created() {
    this.$root.$bus.$on('node_active', this.handleNodeActive)
    this.$root.$bus.$on('showNodeImage', this.handleShowNodeImage)
  },
  beforeDestroy() {
    this.$root.$bus.$off('node_active', this.handleNodeActive)
    this.$root.$bus.$off('showNodeImage', this.handleShowNodeImage)
  },
  methods: {
    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
    },

    handleShowNodeImage() {
      if (!this.activeNodes || this.activeNodes.length === 0) return
      this.reset()
      this.getObFileList()
      if (this.activeNodes.length > 0) {
        const firstNode = this.activeNodes[0]
        let img = firstNode.getData('image') || ''
        img =
          (firstNode.mindMap.renderer.treeRender.renderTree.data.imgMap || {})[img] || img
        if (img) {
          if (isNormalUrl(img)) {
            this.imgUrl = img
            this.img = img
          } else {
            if (this.getFromObFileList(img)) {
              this.obFile = img
            }
            this.img = img
          }
        }
        this.imgTitle = firstNode.getData('imageTitle') || ''
      }
      this.dialogVisible = true
    },

    cancel() {
      this.dialogVisible = false
      this.reset()
    },

    reset() {
      this.img = ''
      this.imgTitle = ''
      this.imgUrl = ''
      this.obFile = ''
      this.obFileList = []
      this.allObFileList = null
    },

    async confirm() {
      try {
        if (!this.img && !this.imgUrl && !this.obFile) {
          this.cancel()
          this.activeNodes.forEach(node => {
            node.setImage(null)
          })
          return
        }
        let res = null
        let img = ''
        if (this.img) {
          img = this.img
          res = await this.$refs.ImgUpload.getSize()
        } else if (this.imgUrl) {
          img = this.imgUrl
          res = await getImageSize(img)
        }
        this.activeNodes.forEach(node => {
          node.setImage({
            url: img || 'none',
            title: this.imgTitle,
            width: res.width || 100,
            height: res.height || 100
          })
        })
        this.cancel()
      } catch (error) {
      }
    },

    getFromObFileList(filePath) {
      return this.obFileList.find(item => item.path === filePath)
    },

    getObFileList(searchText) {
      let list = []
      if (this.allObFileList) {
        list = this.allObFileList
      } else {
        list = this.allObFileList = this.$root.$obsidianAPI
          .getObAllFiles()
          .filter(file => {
            return file.extension.match(/(jpg|jpeg|png|gif|bmp|svg|webp)/i)
          })
          .map(item => {
            return {
              folder: item.parent.path,
              path: item.path,
              basename: item.basename + '.' + item.extension
            }
          })
      }
      if (searchText && searchText.trim()) {
        list = list.filter(item => item.basename.includes(searchText).trim())
      }
      this.obFileList = list.slice(0, 50)
    },

    onObFileChange() {
      if (this.obFile) {
        this.img = this.obFile
        this.imgUrl = ''
      }
    },

    onImgUploadSelectObFile(filePath) {
      this.obFile = filePath
      this.onObFileChange()
    },

    onImgUrlChange() {
      if (this.imgUrl) {
        this.img = this.imgUrl
        this.obFile = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nodeImageDialog {
  /deep/ .el-dialog {
    max-width: 600px;
  }

  /deep/ .el-dialog__body {
    padding: 20px;
    padding-top: 0;
  }

  &.isDark {
    /deep/ .el-dialog__body {
      color: hsla(0, 0%, 100%, 0.6);
    }

    /deep/ .el-dialog__header {
      border-bottom: none;
    }

    /deep/ .el-dialog__footer {
      border-top: none;
    }
  }

  .tip {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .inputTitle {
      width: 150px;
      flex-shrink: 0;
      font-size: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /deep/ .el-input__icon {
      line-height: 0 !important;
    }
  }
}

.obFileSelect {
  width: 100%;
}
</style>
<style lang="less">
.smmObFileSelectPopper {
  .el-select-dropdown__item {
    height: max-content !important;
    line-height: 20px;
    padding: 8px 20px;

    .folder {
      color: #909090;
    }
  }
}
</style>
