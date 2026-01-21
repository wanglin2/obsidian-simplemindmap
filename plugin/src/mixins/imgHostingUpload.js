import { compressImage } from '@/utils'

export default {
  methods: {
    async compressAndUploadImg(file) {
      const {
        compressImage: isCompress,
        compressImageOptionsMaxWidth,
        compressImageOptionsMaxHeight,
        compressImageOptionsQuality,
        useImgHosting
      } = this.$root.$obsidianAPI.getSettings()
      if (isCompress) {
        file = await compressImage(file, {
          exportType: 'file',
          maxWidth: compressImageOptionsMaxWidth,
          maxHeight: compressImageOptionsMaxHeight,
          quality: compressImageOptionsQuality
        })
      }
      let result = ''
      if (useImgHosting) {
        result = await this.uploadImgToHosting(file)
      } else {
        result = await this.$root.$obsidianAPI.saveFileToVault(file)
      }
      return result
    },

    uploadImgToHosting(file) {
      return new Promise((resolve, reject) => {
        const {
          imgHostingUrl,
          imgHostingFormField,
          imgHostingResponseField
        } = this.$root.$obsidianAPI.getSettings()
        const formData = new FormData()
        formData.append(imgHostingFormField, file)
        fetch(imgHostingUrl, {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            if (data) {
              const imageUrl = eval(imgHostingResponseField)
              if (imageUrl) {
                resolve(imageUrl)
              } else {
                reject(new Error('上传图片失败，未从响应中提取到图片URL'))
              }
            } else {
              reject(new Error('上传图片失败'))
            }
          })
          .catch(error => {
            console.log(error)
            reject('上传失败')
          })
      })
    }
  }
}