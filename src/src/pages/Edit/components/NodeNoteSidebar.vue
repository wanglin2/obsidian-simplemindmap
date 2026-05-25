<template>
  <Sidebar ref="sidebar" :title="$t('note.title')">
    <div class="noteContentWrap" ref="noteContentWrap"></div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState, mapMutations } from 'vuex'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import { toastUiEditorLangMap } from '@/config/constant'
import noteMixin from '@/mixins/note'

export default {
  mixins: [noteMixin],
  components: {
    Sidebar
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      editor: null,
      node: null
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      activeSidebar: state => state.activeSidebar
    })
  },
  watch: {
    activeSidebar(val) {
      if (val === 'noteSidebar') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
        this.editor = null
      }
    }
  },
  created() {
    this.$root.$bus.$on('node_active', this.onNodeActive)
    this.mindMap.on('node_note_click', this.onNodeNoteClick)
  },
  beforeDestroy() {
    this.$root.$bus.$off('node_active', this.onNodeActive)
    this.mindMap.off('node_note_click', this.onNodeNoteClick)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    onNodeActive(...args) {
      if (this.activeSidebar !== 'noteSidebar') {
        return
      }
      const nodes = [...args[1]]
      if (nodes.length > 0) {
        if (nodes[0] !== this.node) {
          this.setActiveSidebar(null)
        }
      } else {
        this.setActiveSidebar(null)
      }
    },

    initEditor() {
      if (!this.editor) {
        this.editor = new Viewer({
          el: this.$refs.noteContentWrap,
          theme: this.isDark ? 'dark' : 'light',
          language:
            toastUiEditorLangMap[this.$i18n.locale] || toastUiEditorLangMap.en
        })
      }
    },

    onNodeNoteClick(node) {
      this.node = node
      this.setActiveSidebar('noteSidebar')
      this.$nextTick(() => {
        this.initEditor()
        this.editor.setMarkdown(node.getData('note'))
        this.fixNoteImg(
          Array.from(this.$refs.noteContentWrap.querySelectorAll('img'))
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
.noteContentWrap {
  padding: 12px;
}
</style>
