<template>
  <viewer :images="images" style="position: absolute; left: -9999999px;">
    <img v-for="src in images" :key="src" :src="src" />
  </viewer>
</template>

<script>
export default {
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
      images: []
    }
  },
  mounted() {
    this.mindMap.on('node_img_dblclick', this.onNodeTmgDblclick)
  },
  beforeDestroy() {
    this.mindMap.off('node_img_dblclick', this.onNodeTmgDblclick)
  },
  methods: {
    onNodeTmgDblclick(node, e) {
      e.stopPropagation()
      e.preventDefault()
      this.images = [node.getImageUrl()]
      this.$viewerApi({
        images: this.images,
        options: {
          navbar: false,
          toolbar: {
            zoomIn: true,
            zoomOut: true,
            oneToOne: true,
            reset: true,
            prev: false,
            play: false,
            next: false,
            rotateLeft: true,
            rotateRight: true,
            flipHorizontal: true,
            flipVertical: true
          }
        }
      })
    }
  }
}
</script>

<style></style>
