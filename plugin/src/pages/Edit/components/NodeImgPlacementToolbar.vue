<template>
  <div
    class="nodeImgPlacementToolbar"
    :class="{ isDark: isDark }"
    ref="nodeImgPlacementToolbar"
    :style="style"
    @click.stop.passive
    v-show="showImgPlacementToolbar"
  >
    <div
      class="imgPlacementItem iconfont iconcontentleft"
      v-for="item in imgPlacementList"
      :key="item"
      :class="[
        {
          selected: imgPlacement === item
        },
        'icon_' + item
      ]"
      @click="updateImgPlacement(item)"
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
      showImgPlacementToolbar: false,
      style: {
        left: 0,
        top: 0
      },
      imgPlacementList: ['top', 'bottom', 'left', 'right'],
      node: null,
      imgNode: null,
      imgPlacement: ''
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  created() {
    this.mindMap.on('node_img_click', this.show)
    this.mindMap.on('node_img_dblclick', this.close)
    this.mindMap.on('draw_click', this.close)
    this.mindMap.on('svg_mousedown', this.close)
    this.mindMap.on('node_dblclick', this.close)
    this.mindMap.on('node_active', this.onNodeActive)
    this.mindMap.on('scale', this.onScale)
    this.mindMap.on('node_img_adjust_btn_mousedown', this.close)
    this.mindMap.on('delete_node_img_from_delete_btn', this.close)
    this.mindMap.on('translate', this.close)
  },
  mounted() {
    this.mindMap.el.parentNode.append(this.$refs.nodeImgPlacementToolbar)
  },
  beforeDestroy() {
    this.mindMap.off('node_img_click', this.show)
    this.mindMap.on('node_img_dblclick', this.close)
    this.mindMap.off('draw_click', this.close)
    this.mindMap.off('svg_mousedown', this.close)
    this.mindMap.off('node_dblclick', this.close)
    this.mindMap.off('node_active', this.onNodeActive)
    this.mindMap.off('scale', this.onScale)
    this.mindMap.off('node_img_adjust_btn_mousedown', this.close)
    this.mindMap.off('delete_node_img_from_delete_btn', this.close)
    this.mindMap.off('translate', this.close)
  },
  methods: {
    show(node, imgNode) {
      this.node = node
      this.imgPlacement = node.getStyle('imgPlacement')
      this.imgNode = imgNode
      this.showImgPlacementToolbar = true
      this.$nextTick(() => {
        this.updatePos()
      })
    },

    close() {
      this.showImgPlacementToolbar = false
      this.node = null
      this.imgPlacement = ''
      this.imgNode = null
      this.style.left = 0
      this.style.top = 0
    },

    updatePos() {
      if (!this.imgNode) return
      const {
        width,
        height
      } = this.$refs.nodeImgPlacementToolbar.getBoundingClientRect()
      const { width: imgWidth, x, y } = this.imgNode.rbox()
      const elRect = this.mindMap.elRect
      let left = x + imgWidth / 2 - width / 2 - elRect.left
      let top = y - height - elRect.top
      if (left < 0) {
        left = 0
      }
      if (left + width > elRect.width) {
        left = elRect.width - width
      }
      if (top < 0) {
        top = 0
      }
      this.style.left = left + 'px'
      this.style.top = top + 'px'
    },

    onScale() {
      this.updatePos()
    },

    onNodeActive(node) {
      if (node === this.node) {
        return
      }
      this.close()
    },

    updateImgPlacement(item) {
      this.imgPlacement = item
      this.node.setStyle('imgPlacement', item)
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
.nodeImgPlacementToolbar {
  position: absolute;
  z-index: 2000;
  height: 40px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  padding: 0 10px;

  &.isDark {
    background-color: #262a2e;

    .imgPlacementItem {
      color: hsla(0, 0%, 100%, 0.9);

      &:hover {
        background-color: #363b3f;
      }

      &.selected {
        background-color: rgb(66, 72, 78);
      }
    }
  }

  .imgPlacementItem {
    width: 30px;
    height: 30px;
    margin: 5px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    &:hover {
      background-color: rgb(237, 237, 237);
    }

    &.icon_top {
      transform: rotateZ(90deg);
    }

    &.icon_bottom {
      transform: rotateZ(-90deg);
    }

    &.icon_right {
      transform: rotateZ(180deg);
    }

    &.selected {
      background-color: rgb(237, 237, 237);
    }
  }
}
</style>
