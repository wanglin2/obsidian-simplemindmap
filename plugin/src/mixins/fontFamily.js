import { fontFamilyList } from '@/config'

export default {
  computed: {
    fontFamilyList() {
      return [...(fontFamilyList[this.$i18n.locale] || fontFamilyList.en)]
    }
  }
}
