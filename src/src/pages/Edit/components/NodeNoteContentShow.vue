<template>
  <div
    class="noteContentViewer"
    ref="noteContentViewer"
    :style="{
      left: this.left + 'px',
      top: this.top + 'px',
      visibility: show ? 'visible' : 'hidden'
    }"
    :class="{ isDark: isDark }"
    @click.stop
    @mousedown.stop
    @mousemove.stop
    @mouseup.stop
    @wheel.stop
  >
    <div class="noteContentWrap smmCustomScrollbar" ref="noteContentWrap"></div>
  </div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import { mapState } from 'vuex'
import { toastUiEditorLangMap } from '@/config/constant'
import noteMixin from '@/mixins/note'

export default {
  mixins: [noteMixin],
  props: {
    mindMap: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      editor: null,
      show: false,
      left: 0,
      top: 0,
      node: null
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  created() {
    this.$root.$bus.$on('showNoteContent', this.onShowNoteContent)
    this.$root.$bus.$on('hideNoteContent', this.hideNoteContent)
    document.body.addEventListener('click', this.hideNoteContent)
    this.$root.$bus.$on('node_active', this.onNodeActive)
    this.$root.$bus.$on('scale', this.onScale)
    this.$root.$bus.$on('translate', this.onScale)
    this.$root.$bus.$on('svg_mousedown', this.hideNoteContent)
    this.$root.$bus.$on('expand_btn_click', this.hideNoteContent)
  },
  mounted() {},
  beforeDestroy() {
    this.$root.$bus.$off('showNoteContent', this.onShowNoteContent)
    this.$root.$bus.$off('hideNoteContent', this.hideNoteContent)
    document.body.removeEventListener('click', this.hideNoteContent)
    this.$root.$bus.$off('node_active', this.onNodeActive)
    this.$root.$bus.$off('scale', this.onScale)
    this.$root.$bus.$off('translate', this.onScale)
    this.$root.$bus.$off('svg_mousedown', this.hideNoteContent)
    this.$root.$bus.$off('expand_btn_click', this.hideNoteContent)
  },
  methods: {
    onNodeActive(...args) {
      const nodes = [...args[1]]
      if (nodes.length > 0) {
        if (nodes[0] !== this.node) {
          this.hideNoteContent()
        }
      } else {
        this.hideNoteContent()
      }
    },

    onShowNoteContent(content, left, top, width, height, node) {
      this.initEditor(() => {
        this.node = node
        this.editor.setMarkdown(content)
        this.handleALink()
        this.fixNoteImg(
          Array.from(this.$refs.noteContentViewer.querySelectorAll('img'))
        )
        this.show = true
        this.$nextTick(() => {
          this.updateNoteContentPosition(left, top, width, height)
        })
      })
    },

    handleALink() {
      const list = this.$refs.noteContentViewer.querySelectorAll('a')
      Array.from(list).forEach(a => {
        a.setAttribute('target', '_blank')
      })
    },

    updateNoteContentPosition(left, top, width, height) {
      const boxRect = this.$refs.noteContentViewer.getBoundingClientRect()
      const elRect = this.mindMap.elRect
      left = left - elRect.left
      top = top - elRect.top
      if (left < 0) {
        left = 0
      }
      if (left + boxRect.width > elRect.width) {
        left = elRect.width - boxRect.width
      }
      if (top < 0) {
        top = 0
      }
      if (top + boxRect.height > elRect.height) {
        top = top - boxRect.height - height
      }
      this.left = left
      this.top = top
    },

    onScale() {
      if (!this.node || !this.show) return
      const { left, top, width, height } = this.node.getNoteContentPosition()
      this.updateNoteContentPosition(left, top, width, height)
    },

    hideNoteContent() {
      this.show = false
    },

    initEditor(callback) {
      if (!this.editor) {
        this.mindMap.el.appendChild(this.$refs.noteContentViewer)
        this.$nextTick(() => {
          this.editor = new Viewer({
            el: this.$refs.noteContentWrap,
            theme: this.isDark ? 'dark' : 'light',
            language:
              toastUiEditorLangMap[this.$i18n.locale] || toastUiEditorLangMap.en
          })
          callback && callback()
        })
      } else {
        callback && callback()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.noteContentViewer {
  position: absolute;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 2;

  &.isDark {
    background-color: #262a2e;
  }

  .noteContentWrap {
    max-width: 250px;
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
