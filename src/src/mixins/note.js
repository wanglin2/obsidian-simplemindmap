import { isNormalUrl } from '@/utils'

export default {
  methods: {
    fixNoteImg(imgList) {
      imgList.forEach(img => {
        const url = img.getAttribute('data-url')
        if (url) {
          img.setAttribute('src', url)
        } else {
          let src = img.getAttribute('src')
          if (src && !isNormalUrl(src) && !src.startsWith('app://')) {
            img.setAttribute(
              'src',
              this.$root.$obsidianAPI.getResourcePath(decodeURIComponent(src))
            )
          }
        }
      })
    }
  }
}
