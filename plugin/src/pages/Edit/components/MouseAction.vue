<template>
  <div
    class="mouseActionContainer"
    :class="{ isDark: isDark }"
    :aria-label="
      useLeftKeySelectionRightKeyDrag
        ? $t('mouseAction.tip2')
        : $t('mouseAction.tip1')
    "
    data-tooltip-position="top"
  >
    <div
      class="btn iconfont"
      :class="[useLeftKeySelectionRightKeyDrag ? 'iconmouseR' : 'iconmouseL']"
      @click="toggleAction"
    ></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    mindMap: {
      type: Object
    },
    isDark: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      useLeftKeySelectionRightKeyDrag: state =>
        state.localConfig.useLeftKeySelectionRightKeyDrag
    })
  },
  methods: {
    ...mapMutations(['setLocalConfig']),

    toggleAction() {
      let val = !this.useLeftKeySelectionRightKeyDrag
      this.mindMap.updateConfig({
        useLeftKeySelectionRightKeyDrag: val
      })
      this.setLocalConfig({
        useLeftKeySelectionRightKeyDrag: val
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mouseActionContainer {
  display: flex;
  align-items: center;

  &.isDark {
    .btn {
      color: hsla(0, 0%, 100%, 0.6);

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .item {
    margin-right: 2px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .btn {
    cursor: pointer;
    font-size: 18px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #ecf5ff;
    }
  }
}
</style>
