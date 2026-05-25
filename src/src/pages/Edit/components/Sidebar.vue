<template>
  <div
    class="sidebarContainer"
    @click.stop
    :class="{ show: show, isDark: isDark }"
    :style="{ zIndex: zIndex }"
  >
    <div class="rightAction">
      <slot name="rightAction"></slot>
    </div>
    <span class="closeBtn el-icon-close" @click="close"></span>
    <div class="sidebarHeader" v-if="title">
      {{ title }}
    </div>
    <div class="sidebarContent smmCustomScrollbar" ref="sidebarContent">
      <slot v-if="show"></slot>
    </div>
  </div>
</template>

<script>
import { store } from '@/config'
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      zIndex: 0
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    show(val, oldVal) {
      if (val && !oldVal) {
        this.zIndex = store.sidebarZIndex++
      }
    }
  },
  created() {
    this.$root.$bus.$on('closeSideBar', this.handleCloseSidebar)
  },
  beforeDestroy() {
    this.$root.$bus.$off('closeSideBar', this.handleCloseSidebar)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    handleCloseSidebar() {
      this.close()
    },

    close() {
      this.show = false
      this.setActiveSidebar(null)
    },

    getEl() {
      return this.$refs.sidebarContent
    }
  }
}
</script>

<style lang="less" scoped>
.sidebarContainer {
  position: absolute;
  right: -300px;
  top: 60px;
  bottom: 27px;
  width: 300px;
  background-color: #fff;
  border-left: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  overflow: hidden;

  &.isDark {
    background-color: #262a2e;
    border-left-color: hsla(0, 0%, 100%, 0.1);

    .sidebarHeader {
      border-bottom-color: hsla(0, 0%, 100%, 0.1);
      color: #fff;
    }

    .closeBtn {
      color: #fff;
    }
  }

  &.show {
    right: 0;
  }
  
  .rightAction {
    height: 44px;
    position: absolute;
    top: 0;
    right: 50px;
    display: flex;
    align-items: center;
  }

  .closeBtn {
    position: absolute;
    right: 20px;
    top: 12px;
    font-size: 20px;
    cursor: pointer;
  }

  .sidebarHeader {
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .sidebarContent {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
