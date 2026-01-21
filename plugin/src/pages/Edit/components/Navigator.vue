<template>
  <div
    v-if="showMiniMap"
    class="navigatorBox"
    :class="{ isDark: isDark }"
    ref="navigatorBox"
    :style="{ width: width + 'px' }"
    @mousedown="onMousedown"
    @mousemove="onMousemove"
  >
    <div
      class="svgBox"
      ref="svgBox"
      :style="{
        transform: `scale(${svgBoxScale})`,
        left: svgBoxLeft + 'px',
        top: svgBoxTop + 'px'
      }"
    >
      <img :src="mindMapImg" @mousedown.prevent />
    </div>
    <div
      class="windowBox"
      :style="viewBoxStyle"
      :class="{ withTransition: withTransition }"
      @mousedown.stop="onViewBoxMousedown"
      @mousemove="onViewBoxMousemove"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      showMiniMap: false,
      timer: null,
      boxWidth: 0,
      boxHeight: 0,
      svgBoxScale: 1,
      svgBoxLeft: 0,
      svgBoxTop: 0,
      viewBoxStyle: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
      },
      mindMapImg: '',
      width: 0,
      setSizeTimer: null,
      withTransition: true
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  mounted() {
    this.setSize()
    this.$root.$bus.$on('windowResize', this.setSize)
    this.$root.$bus.$on('toggle_mini_map', this.toggle_mini_map)
    this.$root.$bus.$on('data_change', this.data_change)
    this.$root.$bus.$on('view_data_change', this.data_change)
    this.$root.$bus.$on('node_tree_render_end', this.data_change)
    window.addEventListener('mouseup', this.onMouseup)
    this.mindMap.on(
      'mini_map_view_box_position_change',
      this.onViewBoxPositionChange
    )
  },
  destroyed() {
    this.$root.$bus.$off('windowResize', this.setSize)
    this.$root.$bus.$off('toggle_mini_map', this.toggle_mini_map)
    this.$root.$bus.$off('data_change', this.data_change)
    this.$root.$bus.$off('view_data_change', this.data_change)
    this.$root.$bus.$off('node_tree_render_end', this.data_change)
    window.removeEventListener('mouseup', this.onMouseup)
    this.mindMap.off(
      'mini_map_view_box_position_change',
      this.onViewBoxPositionChange
    )
  },
  methods: {
    toggle_mini_map(show) {
      this.showMiniMap = show
      this.$nextTick(() => {
        if (this.$refs.navigatorBox) {
          this.init()
        }
        if (this.$refs.svgBox) {
          this.drawMiniMap()
        }
      })
    },

    data_change() {
      if (!this.showMiniMap) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.drawMiniMap()
      }, 500)
    },

    setSize() {
      clearTimeout(this.setSizeTimer)
      this.setSizeTimer = setTimeout(() => {
        this.width = Math.min(this.mindMap.elRect.width - 20, 370)
        this.$nextTick(() => {
          if (this.showMiniMap) {
            this.init()
            this.drawMiniMap()
          }
        })
      }, 300)
    },

    init() {
      let { width, height } = this.$refs.navigatorBox.getBoundingClientRect()
      this.boxWidth = width - 2 // 减去边框
      this.boxHeight = height - 2
    },

    drawMiniMap() {
      let {
        getImgUrl,
        viewBoxStyle,
        miniMapBoxScale,
        miniMapBoxLeft,
        miniMapBoxTop
      } = this.mindMap.miniMap.calculationMiniMap(this.boxWidth, this.boxHeight)
      getImgUrl(img => {
        this.mindMapImg = img
      })
      this.viewBoxStyle = viewBoxStyle
      this.svgBoxScale = miniMapBoxScale
      this.svgBoxLeft = miniMapBoxLeft
      this.svgBoxTop = miniMapBoxTop
    },

    onMousedown(e) {
      this.mindMap.miniMap.onMousedown(e)
    },

    onMousemove(e) {
      this.mindMap.miniMap.onMousemove(e)
    },

    onMouseup(e) {
      if (!this.withTransition) {
        this.withTransition = true
      }
      if (this.mindMap.miniMap) this.mindMap.miniMap.onMouseup(e)
    },

    onViewBoxMousedown(e) {
      this.mindMap.miniMap.onViewBoxMousedown(e)
    },

    onViewBoxMousemove(e) {
      this.mindMap.miniMap.onViewBoxMousemove(e)
    },

    onViewBoxPositionChange({ left, right, top, bottom }) {
      this.withTransition = false
      this.viewBoxStyle.left = left
      this.viewBoxStyle.right = right
      this.viewBoxStyle.top = top
      this.viewBoxStyle.bottom = bottom
    }
  }
}
</script>

<style lang="less" scoped>
.navigatorBox {
  position: absolute;
  height: 220px;
  background-color: #fff;
  bottom: 50px;
  left: 10px;
  box-shadow: 0 0 16px #989898;
  border-radius: 4px;
  border: 1px solid #eee;
  cursor: pointer;
  user-select: none;

  &.isDark {
    background-color: #262a2e;
  }

  .svgBox {
    position: absolute;
    left: 0;
    transform-origin: left top;

    img {
      max-width: none;
    }
  }

  .windowBox {
    position: absolute;
    border: 2px solid rgb(238, 69, 69);
    background-color: rgba(238, 69, 69, 0.2);

    &.withTransition {
      transition: all 0.3s;
    }
  }
}
</style>
