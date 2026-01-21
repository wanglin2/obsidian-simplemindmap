<template>
  <div
    ref="navigatorContainerRef"
    class="navigatorContainer smmCustomScrollbar"
    :class="{ isDark: isDark, isMobile: isMobile }"
    :style="{ maxWidth: !isMobile ? maxWidth : '42px' }"
  >
    <div class="item" v-if="isMobile" @click="showContextMenu">
      <div class="btn iconfont iconcaidan"></div>
    </div>
    <div
      class="item"
      :aria-label="$t('navigatorToolbar.backToRoot')"
      data-tooltip-position="top"
    >
      <div class="btn iconfont icondingwei" @click="backToRoot"></div>
    </div>
    <div
      class="item"
      :aria-label="$t('navigatorToolbar.searchReplace')"
      data-tooltip-position="top"
    >
      <div class="btn iconfont iconsousuo1" @click="showSearch"></div>
    </div>
    <div class="item" v-if="!isMobile">
      <MouseAction :isDark="isDark" :mindMap="mindMap"></MouseAction>
    </div>
    <div
      class="item"
      :aria-label="
        openMiniMap
          ? $t('navigatorToolbar.closeMiniMap')
          : $t('navigatorToolbar.openMiniMap')
      "
      data-tooltip-position="top"
    >
      <div class="btn iconfont icondaohang1" @click="toggleMiniMap"></div>
    </div>
    <div class="item">
      <Scale :isDark="isDark" :mindMap="mindMap"></Scale>
    </div>
    <div
      class="item"
      :aria-label="
        isDark
          ? $t('navigatorToolbar.exitDarkMode')
          : $t('navigatorToolbar.darkMode')
      "
      data-tooltip-position="top"
      v-if="showDarkChangeBtn"
    >
      <div
        class="btn iconfont"
        :class="[isDark ? 'iconmoon_line' : 'icontaiyang']"
        @click="toggleDark"
      ></div>
    </div>
    <div class="item" v-if="!isMobile">
      <div
        class="btn iconfont iconyanshibofang"
        @click="enterDemoMode"
        :aria-label="$t('demonstrate.demonstrate')"
        data-tooltip-position="top"
      ></div>
    </div>
    <div class="item">
      <el-dropdown @command="handleCommand">
        <div class="btn el-icon-more"></div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="shortcutKey">
            <span class="iconfont iconjianpan"></span>
            {{ $t('navigatorToolbar.shortcutKeys') }}
          </el-dropdown-item>
          <el-dropdown-item command="help">
            <span class="iconfont iconbangzhu"></span>
            {{ $t('navigatorToolbar.help') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <Count
      :mindMap="mindMap"
      v-if="!isZenMode"
      style="margin-left: 6px;"
    ></Count>
  </div>
</template>

<script>
import Scale from './Scale.vue'
import MouseAction from './MouseAction.vue'
import { langList } from '@/config'
import i18n from '@/i18n'
import { mapState, mapMutations } from 'vuex'
import pkg from 'simple-mind-map/package.json'
import Count from './Count.vue'

export default {
  components: {
    Scale,
    MouseAction,
    Count
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      version: pkg.version,
      langList,
      lang: '',
      openMiniMap: false,
      showDarkChangeBtn: false,
      maxWidth: 'max-content',
      activeNode: null
    }
  },
  computed: {
    ...mapState({
      isReadonly: state => state.isReadonly,
      isDark: state => state.localConfig.isDark,
      isZenMode: state => state.localConfig.isZenMode,
      localConfig: state => state.localConfig,
      isMobile: state => state.isMobile
    })
  },
  created() {
    const { lang, themeMode } = this.$root.$obsidianAPI.getSettings()
    this.lang = lang || 'en'
    this.showDarkChangeBtn = themeMode !== 'follow'
    if (!this.isMobile) {
      this.$root.$bus.$on('windowResize', this.onResize)
    } else {
      this.$root.$bus.$on('node_active', this.handleNodeActive)
    }
  },
  mounted() {
    if (!this.isMobile) {
      this.onResize()
    }
  },
  beforeDestroy() {
    if (!this.isMobile) {
      this.$root.$bus.$off('windowResize', this.onResize)
    } else {
      this.$root.$bus.$off('node_active', this.handleNodeActive)
    }
  },
  methods: {
    ...mapMutations(['setLocalConfig', 'setActiveSidebar']),

    toggleMiniMap() {
      this.openMiniMap = !this.openMiniMap
      this.$root.$bus.$emit('toggle_mini_map', this.openMiniMap)
    },

    onLangChange(lang) {
      i18n.locale = lang
      this.$root.$obsidianAPI.updateSettings({
        lang
      })
      this.$root.$bus.$emit('lang_change')
    },

    showSearch() {
      this.$root.$bus.$emit('show_search')
    },

    toggleDark() {
      if (this.$root.$obsidianAPI.getSettings().themeMode === 'follow') {
        this.$root.$obsidianAPI.showTip(
          this.$t('navigatorToolbar.darkModeFailTip')
        )
        this.showDarkChangeBtn = false
        return
      }
      const newIsDark = !this.isDark
      this.setLocalConfig({
        isDark: newIsDark
      })
      this.$root.$obsidianAPI.updateSettings({
        themeMode: newIsDark ? 'dark' : 'light'
      })
    },

    handleCommand(command) {
      if (command === 'shortcutKey') {
        this.setActiveSidebar('shortcutKey')
      } else if (command === 'help') {
        const a = document.createElement('a')
        a.href = ['zh', 'zhtw'].includes(this.$i18n.locale)
          ? 'https://github.com/wanglin2/obsidian-simplemindmap/blob/main/Help_zh.md'
          : 'https://github.com/wanglin2/obsidian-simplemindmap/blob/main/Help.md'
        a.target = '_blank'
        a.click()
      }
    },

    backToRoot() {
      this.mindMap.renderer.setRootNodeCenter()
    },

    enterDemoMode() {
      this.$root.$bus.$emit('enter_demonstrate')
    },

    onResize() {
      const el = document.querySelector('.status-bar')
      if (!el) return
      const nRect = this.$refs.navigatorContainerRef.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      this.maxWidth = eRect.left - nRect.left + 'px'
    },

    handleNodeActive(...args) {
      this.activeNode = args[1].length > 0 ? args[1][0] : null
    },

    showContextMenu() {
      if (this.activeNode) {
        this.$root.$bus.$emit(
          'show_node_context_menu',
          {
            clientX: 0,
            clientY: 0
          },
          this.activeNode
        )
      } else {
        this.$root.$bus.$emit('show_canvas_context_menu', {
          clientX: 0,
          clientY: 0
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navigatorContainer {
  padding: 0 6px;
  position: absolute;
  left: 0px;
  bottom: 0px;
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 5px;
  opacity: 0.8;
  min-height: 40px;
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &.isMobile {
    padding: 0;
    flex-direction: column;

    .item {
      margin-right: 0;
    }
  }

  &.isDark {
    background: #262a2e;

    .item {
      a {
        color: hsla(0, 0%, 100%, 0.6);
      }

      .btn {
        color: hsla(0, 0%, 100%, 0.6);

        &:hover {
          background-color: hsla(0, 0%, 100%, 0.05);
        }
      }
    }
  }

  .item {
    margin-right: 2px;

    &:last-of-type {
      margin-right: 0;
    }

    a {
      color: #303133;
      text-decoration: none;
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
}
</style>
