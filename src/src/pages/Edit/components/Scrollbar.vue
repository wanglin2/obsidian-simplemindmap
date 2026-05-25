<template>
  <div class="scrollbarContainer" :class="{ isDark: isDark }">
    <div
      class="scrollbar verticalScrollbar"
      ref="verticalScrollbarRef"
      @click="onVerticalScrollbarClick"
    >
      <div
        class="scrollbarInner"
        :style="verticalScrollbarStyle"
        @click.stop
        @mousedown="onVerticalScrollbarMousedown"
      ></div>
    </div>
    <div
      class="scrollbar horizontalScrollbar"
      ref="horizontalScrollbarRef"
      @click="onHorizontalScrollbarClick"
    >
      <div
        class="scrollbarInner"
        :style="horizontalScrollbarStyle"
        @click.stop
        @mousedown="onHorizontalScrollbarMousedown"
      ></div>
    </div>
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
      timer: null,
      resizeTimer: null,
      verticalScrollbarStyle: {},
      horizontalScrollbarStyle: {}
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  mounted() {
    this.setScrollBarWrapSize()
    this.$root.$bus.$on('scrollbar_change', this.updateScrollbar)
    this.$root.$bus.$on('windowResize', this.onResize)
  },
  beforeDestroy() {
    this.$root.$bus.$off('scrollbar_change', this.updateScrollbar)
    this.$root.$bus.$off('windowResize', this.onResize)
  },
  methods: {
    setScrollBarWrapSize() {
      if (!this.mindMap.scrollbar) return
      const {
        width
      } = this.$refs.horizontalScrollbarRef.getBoundingClientRect()
      const { height } = this.$refs.verticalScrollbarRef.getBoundingClientRect()
      this.mindMap.scrollbar.setScrollBarWrapSize(width, height)
    },

    onResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.setScrollBarWrapSize()
      }, 300)
    },

    updateScrollbar({ vertical, horizontal }) {
      this.verticalScrollbarStyle = {
        top: vertical.top + '%',
        height: vertical.height + '%'
      }
      this.horizontalScrollbarStyle = {
        left: horizontal.left + '%',
        width: horizontal.width + '%'
      }
    },

    onVerticalScrollbarMousedown(e) {
      this.mindMap.scrollbar.onMousedown(e, 'vertical')
    },

    onVerticalScrollbarClick(e) {
      this.mindMap.scrollbar.onClick(e, 'vertical')
    },

    onHorizontalScrollbarMousedown(e) {
      this.mindMap.scrollbar.onMousedown(e, 'horizontal')
    },

    onHorizontalScrollbarClick(e) {
      this.mindMap.scrollbar.onClick(e, 'horizontal')
    }
  }
}
</script>

<style lang="less" scoped>
.scrollbarContainer {
  &.isDark {
    .scrollbar {
      background-color: #363b3f;

      .scrollbarInner {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .scrollbar {
    position: absolute;
    background-color: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;

    &.verticalScrollbar {
      width: 10px;
      top: 100px;
      bottom: 100px;
      left: 20px;

      .scrollbarInner {
        width: 10px;
        left: 0;
      }
    }

    &.horizontalScrollbar {
      height: 10px;
      left: 100px;
      right: 100px;
      bottom: 70px;

      .scrollbarInner {
        height: 10px;
        top: 0;
      }
    }

    .scrollbarInner {
      position: absolute;
      background-color: #ccc;
      border-radius: 10px;
    }
  }
}
</style>
