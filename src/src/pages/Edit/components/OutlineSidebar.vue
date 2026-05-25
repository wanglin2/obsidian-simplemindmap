<template>
  <Sidebar ref="sidebar" :title="$t('outline.title')">
    <div class="btnList">
      <div
        class="btn"
        :class="{ isDark: isDark }"
        @click="onPrint"
        :aria-label="$t('outline.print')"
        data-tooltip-position="top"
      >
        <span class="icon iconfont iconprinting"></span>
      </div>
    </div>
    <Outline
      :mindMap="mindMap"
      v-if="activeSidebar === 'outline'"
      @scrollTo="onScrollTo"
      ref="outlineRef"
    ></Outline>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState, mapMutations } from 'vuex'
import Outline from './Outline.vue'
import { printOutline } from '@/utils'

export default {
  components: {
    Sidebar,
    Outline
  },
  props: {
    mindMap: {
      type: Object
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
      if (val === 'outline') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    onScrollTo(y) {
      let container = this.$refs.sidebar.getEl()
      let height = container.offsetHeight
      let top = container.scrollTop
      if (y > top + height) {
        container.scrollTo(0, y - height / 2)
      }
    },

    onPrint() {
      printOutline(this.$refs.outlineRef.$el)
    }
  }
}
</script>

<style lang="less" scoped>
.btnList {
  position: absolute;
  right: 50px;
  top: 12px;
  display: flex;
  align-items: center;

  .btn {
    cursor: pointer;
    margin-left: 12px;

    &.isDark {
      color: #fff;
    }
  }
}
</style>
