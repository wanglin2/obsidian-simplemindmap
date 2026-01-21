<template>
  <div
    ref="smmWholeContainer"
    class="smmWholeContainer"
    :class="{ isDark: isDark, activeSidebar: activeSidebar }"
  >
    <template v-if="show && !isOutlineEdit">
      <Toolbar
        v-if="loadToolbar && !isZenMode && !isReadonly"
        :getContainerSize="getContainerSize"
      ></Toolbar>
      <Edit @loadend="onMindMapLoadend"></Edit>
    </template>
    <OutlineEdit v-if="isOutlineEdit"></OutlineEdit>
    <Guide v-if="showGuide"></Guide>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar.vue'
import Edit from './components/Edit.vue'
import { mapState, mapMutations } from 'vuex'
import OutlineEdit from './components/OutlineEdit.vue'
import Guide from './components/Guide.vue'
import darkMixin from '@/mixins/dark'
import Export from './components/Export.vue'

export default {
  mixins: [darkMixin],
  components: {
    Toolbar,
    Edit,
    OutlineEdit,
    Guide,
    Export
  },
  data() {
    return {
      show: false,
      showGuide: false,
      loadToolbar: false
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      activeSidebar: state => state.activeSidebar,
      localConfig: state => state.localConfig,
      isOutlineEdit: state => state.isOutlineEdit,
      isReadonly: state => state.isReadonly
    })
  },
  watch: {
    localConfig: {
      handler: 'saveLocalConfig',
      deep: true
    }
  },
  async created() {
    const isMobile = this.$root.$obsidianAPI.isMobile()
    if (isMobile) {
      this.setIsMobile(true)
    }
    this.initLocalConfig()
    this.show = true
    this.$root.$bus.$on('showOutlineEdit', this.showOutlineEdit)
    this.$root.$bus.$on('hideOutlineEdit', this.hideOutlineEdit)
    this.$root.$bus.$on('setIsDark', this.setIsDark)
    this.$root.$bus.$on('setShowGuide', this.onSetShowGuide)
    this.$root.$bus.$on('toggleReadonly', this.onToggleReadonly)
    const { isFirstUse } = this.$root.$obsidianAPI.getSettings()
    this.showGuide = (isFirstUse || false) && !isMobile
  },
  beforeDestroy() {
    this.$root.$bus.$off('showOutlineEdit', this.showOutlineEdit)
    this.$root.$bus.$off('hideOutlineEdit', this.hideOutlineEdit)
    this.$root.$bus.$off('setIsDark', this.setIsDark)
    this.$root.$bus.$off('setShowGuide', this.onSetShowGuide)
    this.$root.$bus.$off('toggleReadonly', this.onToggleReadonly)
  },
  methods: {
    ...mapMutations([
      'setLocalConfig',
      'setIsOutlineEdit',
      'setIsReadonly',
      'setIsMobile'
    ]),

    onMindMapLoadend() {
      this.loadToolbar = true
      this.$root.$bus.$emit('mindMapFirstLoadend')
    },

    onToggleReadonly(isReadonly) {
      this.setIsReadonly(isReadonly)
    },

    showOutlineEdit() {
      this.setIsOutlineEdit(true)
    },

    hideOutlineEdit() {
      this.setIsOutlineEdit(false)
    },

    getContainerSize() {
      return {
        width: this.$refs.smmWholeContainer.clientWidth,
        height: this.$refs.smmWholeContainer.clientHeight
      }
    },

    initLocalConfig() {
      const config = this.$root.$obsidianAPI.getMindMapLocalConfig()
      if (config) {
        this.setLocalConfig({
          ...this.$store.state.localConfig,
          ...config
        })
      }
    },

    saveLocalConfig() {
      this.$root.$obsidianAPI.saveMindMapLocalConfig({
        ...this.localConfig
      })
    },

    onSetShowGuide(show) {
      this.showGuide = show
      this.$root.$obsidianAPI.updateSettings({
        isFirstUse: false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.smmWholeContainer {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
<style lang="less">
.smmWholeContainer {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .el-checkbox {
    display: flex;

    .el-checkbox__input {
      margin-top: 2px;
    }

    .el-checkbox__label {
      white-space: normal;
    }
  }

  .el-checkbox__original {
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
  }

  .el-button--primary {
    color: #fff;
    background-color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .el-button--danger {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
  }

  button {
    box-shadow: none;
  }

  textarea {
    &:active {
      box-shadow: none;
      border-color: initial;
    }

    &:focus {
      box-shadow: none;
    }
  }
}

.smmCustomScrollbar {
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: transparent;
    display: none;
  }
}

.smmElDialog {
  .el-dialog {
    border-radius: 10px !important;
  }
}

body {
  &.isDark {
    .el-loading-mask {
      background-color: #363b3f;
    }

    .el-button {
      background-color: #363b3f;
      color: hsla(0, 0%, 100%, 0.9);
      border-color: hsla(0, 0%, 100%, 0.1);
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }

    .el-input__inner {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
      color: hsla(0, 0%, 100%, 0.9);
    }

    .el-input.is-disabled .el-input__inner {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
      color: hsla(0, 0%, 100%, 0.3);
    }

    .el-input-number__decrease,
    .el-input-number__increase {
      background-color: transparent;
      color: hsla(0, 0%, 100%, 0.6);
      border-color: hsla(0, 0%, 100%, 0.2);
    }

    .el-input-group__append,
    .el-input-group__prepend {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
    }

    .el-input-group__append button.el-button {
      color: hsla(0, 0%, 100%, 0.9);
    }

    .el-select-dropdown {
      background-color: #36393d;
      border-color: hsla(0, 0%, 100%, 0.1);

      .el-select-dropdown__item {
        color: hsla(0, 0%, 100%, 0.6);
      }

      .el-select-dropdown__item.selected {
        color: var(--text-accent);
      }

      .el-select-dropdown__item.hover,
      .el-select-dropdown__item:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }

    .el-select .el-input.is-disabled .el-input__inner:hover {
      border-color: hsla(0, 0%, 100%, 0.1);
    }

    .el-popper {
      background-color: #36393d;
      border-color: hsla(0, 0%, 100%, 0.1);
    }

    .el-popper[x-placement^='bottom'] .popper__arrow {
      background-color: #36393d;
    }

    .el-popper[x-placement^='bottom'] .popper__arrow::after {
      border-bottom-color: #36393d;
    }

    .el-popper[x-placement^='top'] .popper__arrow {
      background-color: #36393d;
    }

    .el-popper[x-placement^='top'] .popper__arrow::after {
      border-top-color: #36393d;
    }

    .el-tabs__item {
      color: hsla(0, 0%, 100%, 0.6);

      &:hover,
      &.is-active {
        color: var(--text-accent);
      }
    }

    .el-tabs__nav-wrap::after {
      background-color: hsla(0, 0%, 100%, 0.6);
    }

    .el-slider__runway {
      background-color: hsla(0, 0%, 100%, 0.6);
    }

    .el-radio-group {
      .el-radio-button__inner {
        background-color: #36393d;
        color: hsla(0, 0%, 100%, 0.6);
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #fff;
        background-color: var(--color-accent);
      }
    }

    .el-dialog {
      background-color: #262a2e;

      .el-dialog__header {
        border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
      }

      .el-dialog__title {
        color: hsla(0, 0%, 100%, 0.9);
      }

      .el-dialog__body {
        background-color: #262a2e;
      }

      .el-dialog__footer {
        border-top: 1px solid hsla(0, 0%, 100%, 0.1);
      }
    }

    .el-upload__tip {
      color: #999;
    }

    .el-checkbox__inner {
      background-color: transparent;
    }

    .el-checkbox__label {
      color: hsla(0, 0%, 100%, 0.6);
    }

    .el-dropdown-menu__item {
      color: hsla(0, 0%, 100%, 0.6);
    }

    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
      background-color: hsla(0, 0%, 100%, 0.05);
      color: var(--text-accent);
    }

    .el-input-number__decrease,
    .el-input-number__increase {
      background-color: transparent;
      color: hsla(0, 0%, 100%, 0.6);
      border-color: hsla(0, 0%, 100%, 0.2);
    }

    .el-radio__label {
      color: hsla(0, 0%, 100%, 0.6);
    }

    .el-textarea__inner {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
      color: hsla(0, 0%, 100%, 0.9);
    }

    .smmCustomElConfirm {
      background-color: #262a2e;
      border-color: hsla(0, 0%, 100%, 0.2);

      .el-message-box__title {
        color: hsla(0, 0%, 100%, 0.9);
      }

      .el-message-box__content {
        color: hsla(0, 0%, 100%, 0.9);
      }
    }

    .el-form-item__label {
      color: hsla(0, 0%, 100%, 0.6);
    }

    .el-radio {
      .el-radio__inner {
        background-color: transparent;

        &::after {
          background-color: var(--text-accent);
        }
      }
    }

    .el-dialog__headerbtn {
      background-color: transparent;
      height: auto;
    }

    .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent;
    }

    .darkElMessageBox {
      background-color: #262a2e;
      border-color: hsla(0, 0%, 100%, 0.1);

      .el-message-box__header {
        .el-message-box__title {
          color: hsla(0, 0%, 100%, 0.9);
        }
      }

      .el-message-box__content {
        color: #999;
      }
    }
  }
}

.el-button.smmElButtonSmall {
  height: 25px;
  padding: 0 30px;
  border-radius: 5px;
}

.smmCustomElConfirm {
  .el-message-box__header {
    .el-message-box__headerbtn {
      box-shadow: none;
      color: var(--text-color);
      background-color: transparent;

      &:hover {
        background-color: transparent;
      }
    }
  }

  .el-message-box__btns {
    .el-button {
      box-shadow: none;

      &.el-button--primary {
        color: #fff;
        background-color: var(--color-accent);
        border-color: var(--color-accent);

        &:hover {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: var(--text-accent);
        }
      }
    }
  }
}
</style>
