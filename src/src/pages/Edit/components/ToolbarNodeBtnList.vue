<template>
  <div class="smmToolbarNodeBtnList" :class="[dir, { isDark: isDark }]">
    <div
      v-for="item in list"
      :key="item"
      :aria-label="iconNameMap[item]"
      :data-tooltip-position="dir === 'v' ? 'left' : 'bottom'"
    >
      <div
        v-if="item === 'back'"
        class="toolbarBtn"
        :class="{
          disabled: readonly || backEnd
        }"
        @click="$root.$bus.$emit('execCommand', 'BACK')"
      >
        <span
          class="icon iconfont iconhoutui-shi"
          style="font-size: 20px;"
        ></span>
      </div>
      <div
        v-if="item === 'forward'"
        class="toolbarBtn"
        :class="{
          disabled: readonly || forwardEnd
        }"
        @click="$root.$bus.$emit('execCommand', 'FORWARD')"
      >
        <span
          class="icon iconfont iconqianjin1"
          style="font-size: 20px;"
        ></span>
      </div>
      <div
        v-if="item === 'painter'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization,
          active: isInPainter
        }"
        @click="$root.$bus.$emit('startPainter')"
      >
        <span
          class="icon iconfont iconcaozuo_geshishua"
          style="font-size: 19px;"
        ></span>
      </div>
      <div
        v-if="item === 'siblingNode'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
        }"
        @click="$root.$bus.$emit('execCommand', 'INSERT_NODE')"
      >
        <span class="icon iconfont iconjiedian"></span>
      </div>
      <div
        v-if="item === 'childNode'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="$root.$bus.$emit('execCommand', 'INSERT_CHILD_NODE')"
      >
        <span class="icon iconfont icontianjiazijiedian"></span>
      </div>
      <div
        v-if="item === 'deleteNode'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$root.$bus.$emit('execCommand', 'REMOVE_NODE')"
      >
        <span class="icon iconfont iconshanchu"></span>
      </div>
      <div
        v-if="item === 'image'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$root.$bus.$emit('showNodeImage')"
      >
        <span class="icon iconfont icontupian" style="font-size: 22px;"></span>
      </div>
      <div
        v-if="item === 'icon'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="showNodeIcon"
      >
        <span
          class="icon iconfont iconxiaolian"
          style="font-size: 17px;"
        ></span>
      </div>
      <div
        v-if="item === 'link'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$root.$bus.$emit('showNodeLink')"
      >
        <span
          class="icon iconfont iconchaolianjie1"
          style="font-size: 19px;"
        ></span>
      </div>
      <div
        v-if="item === 'note'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$root.$bus.$emit('showNodeNote')"
      >
        <span class="icon iconfont iconbeizhu"></span>
      </div>
      <div
        v-if="item === 'tag'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$root.$bus.$emit('showNodeTag')"
      >
        <span class="icon iconfont icontag" style="font-size: 19px;"></span>
      </div>
      <div
        v-if="item === 'summary'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization
        }"
        @click="$root.$bus.$emit('execCommand', 'ADD_GENERALIZATION')"
      >
        <span class="icon iconfont icongaiyao"></span>
      </div>
      <div
        v-if="item === 'associativeLine'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="$root.$bus.$emit('createAssociativeLine')"
      >
        <span
          class="icon iconfont iconlianjiexian"
          style="font-size: 25px;"
        ></span>
      </div>
      <div
        v-if="item === 'formula'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="showFormula"
      >
        <span class="icon iconfont icongongshi" style="font-size: 19px;"></span>
      </div>
      <div
        v-if="item === 'attachment'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0
        }"
        @click="selectAttachmentFile"
      >
        <span class="icon iconfont iconfujian" style="font-size: 20px;"></span>
      </div>
      <div
        v-if="item === 'outerFrame'"
        class="toolbarBtn"
        :class="{
          disabled: activeNodes.length <= 0 || hasGeneralization
        }"
        @click="$root.$bus.$emit('execCommand', 'ADD_OUTER_FRAME')"
      >
        <span
          class="icon iconfont iconwaikuang2"
          style="font-size: 22px;"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { iconNameMap } from '@/config'

export default {
  props: {
    dir: {
      type: String,
      default: 'h'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeNodes: [],
      backEnd: true,
      forwardEnd: true,
      readonly: false,
      isFullDataFile: false,
      timer: null,
      isInPainter: false
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    }),
    hasRoot() {
      return (
        this.activeNodes.findIndex(node => {
          return node.isRoot
        }) !== -1
      )
    },
    hasGeneralization() {
      return (
        this.activeNodes.findIndex(node => {
          return node.isGeneralization
        }) !== -1
      )
    },
    iconNameMap() {
      return iconNameMap[this.$i18n.locale] || iconNameMap.en
    }
  },
  created() {
    this.$root.$bus.$on('mode_change', this.onModeChange)
    this.$root.$bus.$on('node_active', this.onNodeActive)
    this.$root.$bus.$on('back_forward', this.onBackForward)
    this.$root.$bus.$on('painter_start', this.onPainterStart)
    this.$root.$bus.$on('painter_end', this.onPainterEnd)
  },
  beforeDestroy() {
    this.$root.$bus.$off('mode_change', this.onModeChange)
    this.$root.$bus.$off('node_active', this.onNodeActive)
    this.$root.$bus.$off('back_forward', this.onBackForward)
    this.$root.$bus.$off('painter_start', this.onPainterStart)
    this.$root.$bus.$off('painter_end', this.onPainterEnd)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    onModeChange(mode) {
      this.readonly = mode === 'readonly'
    },

    onNodeActive(...args) {
      this.activeNodes = [...args[1]]
    },

    onBackForward(index, len) {
      this.backEnd = index <= 0
      this.forwardEnd = index >= len - 1
    },

    onPainterStart() {
      this.isInPainter = true
    },

    onPainterEnd() {
      this.isInPainter = false
    },

    showNodeIcon() {
      this.$root.$bus.$emit('close_node_icon_toolbar')
      this.setActiveSidebar('nodeIconSidebar')
    },

    showFormula() {
      this.setActiveSidebar('formulaSidebar')
    },

    selectAttachmentFile() {
      this.$root.$bus.$emit('selectAttachment', this.activeNodes)
    }
  }
}
</script>

<style lang="less">
.smmToolbarNodeBtnList {
  display: flex;
  font-size: 12px;

  &.isDark {
    .toolbarBtn {
      color: hsla(0, 0%, 100%, 0.9);
      background: transparent;
      border-color: transparent;

      &:hover {
        &:not(.disabled) {
          background: hsla(0, 0%, 100%, 0.05);
        }
      }

      &.disabled {
        color: #54595f;
      }
    }
  }

  .toolbarBtn {
    display: flex;
    cursor: pointer;
    margin-right: 2px;
    height: 30px;
    width: 30px;
    background: #fff;
    border-radius: 4px;
    justify-content: center;
    align-items: center;

    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      &:not(.disabled) {
        background: #f5f5f5;
      }
    }

    &.active {
      background: #f5f5f5;
    }

    &.disabled {
      color: #bcbcbc;
      cursor: not-allowed;
      pointer-events: none;
    }

    .icon {
    }
  }

  &.v {
    display: block;
    flex-wrap: wrap;

    .toolbarBtn {
      margin-bottom: 10px;
      margin-right: 0;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
