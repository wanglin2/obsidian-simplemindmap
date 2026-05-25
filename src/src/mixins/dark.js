import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    isDark() {
      this.setBodyDark()
    }
  },
  created() {
    this.setBodyDark()
  },
  methods: {
    ...mapMutations(['setLocalConfig']),

    setBodyDark() {
      this.isDark
        ? document.body.classList.add('isDark')
        : document.body.classList.remove('isDark')
    },

    setIsDark(isDark) {
      this.setLocalConfig({
        isDark
      })
      this.setBodyDark()
    }
  }
}
