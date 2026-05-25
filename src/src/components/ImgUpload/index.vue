<template>
  <div
    class="imgUploadContainer"
    :class="{ isDark: isDark }"
    v-loading="loading"
  >
    <div class="imgUploadPanel">
      <div class="upBtn" v-if="!value">
        <label
          for="imgUploadInput"
          class="imgUploadInputArea"
          @dragenter.stop.prevent
          @dragover.stop.prevent
          @drop.stop.prevent="onDrop"
          >{{ $t('imageUpload.tip') }}</label
        >
        <input
          type="file"
          accept="image/*"
          id="imgUploadInput"
          @change="onImgUploadInputChange"
        />
      </div>
      <div v-if="value" class="uploadInfoBox">
        <div
          class="previewBox"
          :style="{ backgroundImage: `url('${getResourcePath(value)}')` }"
        ></div>
        <span class="delBtn el-icon-close" @click="deleteImg"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { isNormalUrl } from '@/utils'
import { mapState } from 'vuex'
import { getDataFromDt } from './utils'
import imgHostingUpload from '@/mixins/imgHostingUpload'

export default {
  mixins: [imgHostingUpload],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      file: null,
      loading: false
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  methods: {
    onImgUploadInputChange(e) {
      let file = e.target.files[0]
      this.selectImg(file)
    },

    async onDrop(e) {
      const { file, text } = await getDataFromDt(e.dataTransfer, f => {
        return /^image\//.test(f.type)
      })
      if (file) {
        this.selectImg(file)
      } else if (text) {
        const tFile = this.$root.$obsidianAPI.getFileFromUri(text)
        if (tFile) {
          this.$emit('selectObFile', tFile.path)
          this.$emit('change', tFile.path)
        }
      }
    },

    async selectImg(file) {
      try {
        this.loading = true
        const result = await this.compressAndUploadImg(file)
        this.$emit('change', result)
        this.loading = false
      } catch (error) {
        this.$root.$obsidianAPI.showTip(error)
        this.loading = false
      }
    },

    getSize() {
      return new Promise(resolve => {
        let img = new Image()
        img.src = this.getResourcePath(this.value)
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          })
        }
        img.onerror = () => {
          resolve({
            width: 0,
            height: 0
          })
        }
      })
    },

    deleteImg() {
      this.$emit('change', '')
    },

    getResourcePath(url) {
      if (isNormalUrl(url)) {
        return url
      }
      return this.$root.$obsidianAPI.getResourcePath(url)
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>
