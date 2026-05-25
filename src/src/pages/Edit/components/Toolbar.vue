<template>
  <div class="toolbarContainer" :class="{ isDark: isDark }">
    <div class="toolbar" ref="toolbarRef">
      <div class="toolbarBlock">
        <ToolbarNodeBtnList :list="horizontalList"></ToolbarNodeBtnList>
        <el-popover
          v-model="popoverShow"
          placement="bottom"
          :width="54"
          trigger="hover"
          v-if="showMoreBtn"
          popper-class="smmToolbarMorePopover"
        >
          <ToolbarNodeBtnList
            dir="v"
            :list="verticalList"
            @click.native="popoverShow = false"
          ></ToolbarNodeBtnList>
          <div slot="reference" class="toolbarBtn">
            <span class="icon el-icon-more"></span>
          </div>
        </el-popover>
      </div>
    </div>
    <NodeImage></NodeImage>
    <NodeHyperlink></NodeHyperlink>
    <NodeIcon></NodeIcon>
    <NodeNote></NodeNote>
    <NodeTag></NodeTag>
    <Export></Export>
    <Import ref="ImportRef"></Import>
  </div>
</template>

<script>
import NodeImage from './NodeImage.vue'
import NodeHyperlink from './NodeHyperlink.vue'
import NodeIcon from './NodeIcon.vue'
import NodeNote from './NodeNote.vue'
import NodeTag from './NodeTag.vue'
import Export from './Export.vue'
import Import from './Import.vue'
import { mapState } from 'vuex'
import ToolbarNodeBtnList from './ToolbarNodeBtnList.vue'
import { throttle } from 'simple-mind-map/src/utils/index'

const defaultBtnList = [
  'back',
  'forward',
  'painter',
  'image',
  'icon',
  'link',
  'note',
  'tag',
  'summary',
  'associativeLine',
  'formula',
  'outerFrame'
]

export default {
  components: {
    NodeImage,
    NodeHyperlink,
    NodeIcon,
    NodeNote,
    NodeTag,
    Export,
    Import,
    ToolbarNodeBtnList
  },
  props: {
    getContainerSize: {
      type: Function
    }
  },
  data() {
    return {
      horizontalList: [],
      verticalList: [],
      showMoreBtn: true,
      popoverShow: false,
      fileTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      fileTreeVisible: false,
      rootDirName: '',
      fileTreeExpand: true
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      isMobile: state => state.isMobile
    }),

    btnLit() {
      return [...defaultBtnList]
    }
  },
  watch: {
    btnLit: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.computeToolbarShow()
        })
      }
    }
  },
  mounted() {
    this.computeToolbarShow()
    this.computeToolbarShowThrottle = throttle(this.computeToolbarShow, 300)
    this.$root.$bus.$on('windowResize', this.computeToolbarShowThrottle)
    this.$root.$bus.$on('lang_change', this.computeToolbarShowThrottle)
    this.$root.$bus.$on('node_note_dblclick', this.onNodeNoteDblclick)
  },
  beforeDestroy() {
    this.$root.$bus.$off('windowResize', this.computeToolbarShowThrottle)
    this.$root.$bus.$off('lang_change', this.computeToolbarShowThrottle)
    this.$root.$bus.$off('node_note_dblclick', this.onNodeNoteDblclick)
  },
  methods: {
    computeToolbarShow() {
      if (!this.$refs.toolbarRef) return
      const windowWidth = this.getContainerSize().width - 40
      const all = [...this.btnLit]
      let index = 1
      const loopCheck = () => {
        if (index > all.length) return done()
        this.horizontalList = all.slice(0, index)
        this.$nextTick(() => {
          const width = this.$refs.toolbarRef.getBoundingClientRect().width
          if (width < windowWidth) {
            index++
            loopCheck()
          } else if (index > 0 && width > windowWidth) {
            index--
            this.horizontalList = all.slice(0, index)
            done()
          }
        })
      }
      const done = () => {
        this.verticalList = all.slice(index)
        this.showMoreBtn = this.verticalList.length > 0
      }
      loopCheck()
    },

    onNodeNoteDblclick(node, e) {
      e.stopPropagation()
      this.$root.$bus.$emit('showNodeNote', node)
    }
  }
}
</script>

<style lang="less" scoped>
.toolbarContainer {
  &.isDark {
    .toolbar {
      color: hsla(0, 0%, 100%, 0.9);
      .toolbarBlock {
        background-color: #262a2e;
      }

      .toolbarBtn {
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
  }
  .toolbar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10px;
    width: max-content;
    display: flex;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(26, 26, 26, 0.8);
    z-index: 2;

    .toolbarBlock {
      display: flex;
      background-color: #fff;
      padding: 0 6px;
      border-radius: 6px;
      box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
      margin-right: 6px;
      flex-shrink: 0;
      position: relative;
      height: 40px;
      display: flex;
      align-items: center;

      &:last-of-type {
        margin-right: 0;
      }
    }

    .toolbarBtn {
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      margin-right: 2px;
      display: flex;
      width: 30px;
      height: 30px;
      background: #fff;
      border-radius: 4px;
      justify-content: center;
      flex-direction: column;
      text-align: center;

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
  }
}
</style>
<style lang="less">
.smmToolbarMorePopover {
  min-width: auto !important;
}
</style>
