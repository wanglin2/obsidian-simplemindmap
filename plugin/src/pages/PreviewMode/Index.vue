<template>
  <div
    class="smmPreviewModeContainer"
    ref="smmPreviewModeContainerRef"
    @click.stop
  >
    <div class="smmContainer" ref="smmContainerRef">
      <div class="empty" v-if="isEmpty">
        <p class="title">{{ $t('previewMode.emptyTitle') }}</p>
        <p class="desc">{{ $t('previewMode.emptyDesc') }}</p>
      </div>
    </div>
    <div class="topToolbar">
      <div class="topToolbarLeft"></div>
      <div class="topToolbarRight">
        <div
          class="toolbarBtn"
          :aria-label="$t('previewMode.close')"
          data-tooltip-position="bottom"
          @click="close"
        >
          <span class="btnIcon iconfont iconguanbi"></span>
        </div>
      </div>
    </div>
    <div class="bottomToolbar" v-if="!isEmpty">
      <div class="bottomToolbarLeft"></div>
      <div class="bottomToolbarRight">
        <Toolbar
          v-if="mindMap"
          :mindMapData="mindMapData"
          :mindMap="mindMap"
          @changeLayout="changeLayout"
          @changeTheme="changeTheme"
        ></Toolbar>
      </div>
    </div>
  </div>
</template>

<script>
import MindMap from 'simple-mind-map'
import Themes from 'simple-mind-map-plugin-themes'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import TouchEvent from 'simple-mind-map/src/plugins/TouchEvent.js'
import NodeImgAdjust from 'simple-mind-map/src/plugins/NodeImgAdjust.js'
import Formula from 'simple-mind-map/src/plugins/Formula.js'
import MindMapLayoutPro from 'simple-mind-map/src/plugins/MindMapLayoutPro.js'
import NodeBase64ImageStorage from 'simple-mind-map/src/plugins/NodeBase64ImageStorage.js'
import { mapState, mapMutations } from 'vuex'
import darkMixin from '@/mixins/dark'
import Toolbar from './components/Toolbar.vue'

Themes.init(MindMap)

MindMap.usePlugin(NodeImgAdjust)
  .usePlugin(TouchEvent)
  .usePlugin(Formula)
  .usePlugin(MindMapLayoutPro)
  .usePlugin(NodeBase64ImageStorage)
  .usePlugin(RichText)

export default {
  mixins: [darkMixin],
  components: {
    Toolbar
  },
  data() {
    return {
      resizeTimer: null,
      mindMapData: null,
      mindMap: null,
      isEmpty: false,
      isTransparent: false
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  created() {
    this.initLocalConfig()
  },
  mounted() {
    this.$root.$bus.$on('unmount', this.unmount)
    this.getData()
    if (!this.mindMapData) {
      this.isEmpty = true
      return
    }
    this.initMindMap()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    this.unmount()
  },
  methods: {
    ...mapMutations(['setLocalConfig']),

    unmount() {
      this.$root.$bus.$off('unmount', this.unmount)
      if (this.mindMap) {
        this.mindMap.destroy()
        this.mindMap = null
      }
      clearTimeout(this.resizeTimer)
      document.body.removeEventListener('mousemove', this.onMousemove)
      document.body.removeEventListener('mouseup', this.onMouseup)
      window.removeEventListener('resize', this.handleResize)
    },

    initLocalConfig() {
      const config = this.$root.$obsidianAPI.getMindMapLocalConfig()
      if (config) {
        this.setLocalConfig({
          ...this.$store.state.localConfig,
          ...config
        })
      }
    },

    handleResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.mindMap.resize()
      }, 300)
    },

    getData() {
      this.mindMapData = this.$root.$obsidianAPI.getInitMindMapData()
    },

    initMindMap() {
      this.$nextTick(() => {
        const rect = this.$refs.smmContainerRef.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return
        let { root, layout, theme, view } = this.mindMapData
        const options = this.$root.$obsidianAPI.getMindMapOptions()
        this.mindMap = new MindMap({
          el: this.$refs.smmContainerRef,
          touchEventBindEl: this.$refs.smmContainerRef,
          data: root,
          layout: layout,
          theme: theme.template,
          themeConfig: theme.config,
          viewData: view,
          customCheckEnableShortcut: e => {
            return true
          },
          nodeTextEditZIndex: 1000,
          nodeNoteTooltipZIndex: 1000,
          customInnerElsAppendTo: this.$refs.smmPreviewModeContainerRef,
          handleElPositionOnCustomInnerElsAppendTo: (left, top) => {
            return {
              left: left - this.mindMap.elRect.left,
              top: top - this.mindMap.elRect.top
            }
          },
          ...options
        })
      })
    },

    changeLayout(layout) {
      this.mindMapData.layout = layout
      this.mindMap.setLayout(layout)
    },

    changeTheme(theme) {
      this.mindMapData.theme.template = theme
      this.mindMap.setTheme(theme)
    },

    close() {
      this.$root.$bus.$emit('closePreviewMode')
    }
  }
}
</script>

<style lang="less">
.smmPreviewModeContainer {
  p {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    margin-block-start: 0;
    margin-block-end: 0;
  }
}
</style>
<style lang="less" scoped>
.smmPreviewModeContainer {
  width: 80%;
  height: 80%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  margin-block-start: 0;
  margin-block-end: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  &:hover {
    .topToolbar {
      opacity: 1;
      visibility: visible;
    }

    .bottomToolbar {
      opacity: 1;
      visibility: visible;
    }
  }

  .smmContainer {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .empty {
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .title {
        font-size: 18px;
        margin-bottom: 12px;
        font-weight: bold;
      }
    }
  }

  .topToolbar,
  .bottomToolbar {
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;

    .toolbarBtn {
      padding: var(--size-2-2) var(--size-2-3);
      inset-inline-end: var(--size-2-2);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--text-muted);
      border-radius: var(--radius-s);
      cursor: var(--cursor);

      &:hover {
        background-color: var(--background-modifier-hover);
      }

      .btnIcon {
        font-size: 18px;
      }
    }
  }

  .topToolbar {
    top: 0;

    .topToolbarRight {
      display: flex;
      align-items: center;
    }
  }

  .bottomToolbar {
    bottom: 0;

    .bottomToolbarLeft {
    }

    .bottomToolbarRight {
      display: flex;
      align-items: center;
    }
  }
}
</style>
