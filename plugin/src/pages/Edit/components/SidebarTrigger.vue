<template>
  <div
    class="sidebarTriggerContainer "
    @click.stop
    :class="{ hasActive: show && activeSidebar, show: show, isDark: isDark }"
    :style="{ maxHeight: maxHeight + 'px' }"
  >
    <div
      class="toggleShowBtn"
      :class="{ hide: !show, short: isReadonly }"
      @click="show = !show"
    >
      <span class="iconfont iconjiantouyou"></span>
    </div>
    <div class="trigger smmCustomScrollbar">
      <div
        class="triggerItem"
        v-for="item in triggerList"
        :key="item.value"
        :class="{
          active: activeSidebar === item.value
        }"
        @click="trigger(item)"
      >
        <div
          class="triggerIcon iconfont"
          :class="[item.icon]"
          :aria-label="item.name"
          data-tooltip-position="left"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { sidebarTriggerList } from '@/config'

export default {
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      show: true,
      maxHeight: 0
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      activeSidebar: state => state.activeSidebar,
      isReadonly: state => state.isReadonly,
      isMobile: state => state.isMobile,
      prependSidebarList: state => state.prependSidebarList
    }),

    triggerList() {
      let list = sidebarTriggerList[this.$i18n.locale] || sidebarTriggerList.en
      if (this.isMobile) {
        list = list.filter(item => {
          return !['outline'].includes(item.value)
        })
      }
      if (this.isReadonly) {
        list = list.filter(item => {
          return ['outline'].includes(item.value)
        })
      }
      return [...this.prependSidebarList, ...list]
    }
  },
  watch: {
    isReadonly(val) {
      if (val) {
        this.setActiveSidebar(null)
      }
    }
  },
  created() {
    this.$root.$bus.$on('windowResize', this.onResize)
    this.updateSize()
  },
  beforeDestroy() {
    this.$root.$bus.$off('windowResize', this.onResize)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    trigger(item) {
      this.setActiveSidebar(item.value)
    },

    onResize() {
      this.updateSize()
    },

    updateSize() {
      const topMargin = 110
      const bottomMargin = 80
      this.maxHeight = this.mindMap.elRect.height - topMargin - bottomMargin
    }
  }
}
</script>

<style lang="less" scoped>
.sidebarTriggerContainer {
  position: absolute;
  top: 110px;
  bottom: 80px;
  right: -50px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;

  &.isDark {
    .trigger {
      background-color: #262a2e;

      .triggerItem {
        color: hsla(0, 0%, 100%, 0.6);

        &:hover {
          background-color: hsla(0, 0%, 100%, 0.05);
        }
      }
    }
  }

  &.show {
    right: 0;
  }

  &.hasActive {
    right: 305px;
  }

  .toggleShowBtn {
    position: absolute;
    left: -6px;
    width: 35px;
    height: 60px;
    background: var(--color-accent);
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transition: left 0.1s linear;
    z-index: 0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    align-items: center;
    padding-left: 4px;
    pointer-events: all;

    &.short {
      height: 30px;
    }

    &.hide {
      left: -8px;

      span {
        transform: rotateZ(180deg);
      }
    }

    &:hover {
      left: -18px;
    }

    span {
      color: #fff;
      transition: all 0.1s;
    }
  }

  .trigger {
    position: relative;
    width: 50px;
    border-color: #eee;
    background-color: #fff;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    pointer-events: all;

    .triggerItem {
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #464646;
      user-select: none;
      white-space: nowrap;

      &:hover {
        background-color: #ededed;
      }

      &.active {
        color: var(--text-accent);
        font-weight: bold;
      }

      .triggerIcon {
        width: 100%;
        height: 100%;
        font-size: 18px;
        margin-bottom: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
