<template>
  <Sidebar ref="sidebar" :title="$t('theme.title')">
    <div class="themeGroupList" :class="{ isDark: isDark }">
      <el-tabs v-model="activeName" class="tabBox">
        <el-tab-pane
          v-for="group in groupList"
          :key="group.name"
          :label="group.name"
          :name="group.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="themeListTheme smmCustomScrollbar">
        <div
          class="themeItem"
          v-for="item in currentList"
          :key="item.value"
          @click="useTheme(item)"
          :class="{ active: item.value === theme }"
        >
          <div class="imgBox">
            <img :src="item.img || themeImgMap[item.value]" alt="" />
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState, mapMutations } from 'vuex'
import themeImgMap from 'simple-mind-map-plugin-themes/themeImgMap'
import themeList from 'simple-mind-map-plugin-themes/themeList'

export default {
  components: {
    Sidebar
  },
  props: {
    data: {
      type: [Object, null],
      default: null
    },
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      themeList: [
        {
          name: '默认主题',
          value: 'default',
          dark: false
        },
        ...themeList
      ].reverse(),
      themeImgMap,
      theme: '',
      activeName: '',
      defaultGroupList: []
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      activeSidebar: state => state.activeSidebar
    }),

    groupList() {
      return [...this.defaultGroupList]
    },

    currentList() {
      return this.groupList.find(item => {
        return item.name === this.activeName
      }).list
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'theme') {
        this.theme = this.mindMap.getTheme()
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    this.initGroup()
    this.theme = this.mindMap.getTheme()
    this.mindMap.on('view_theme_change', this.handleViewThemeChange)
  },
  beforeDestroy() {
    this.mindMap.off('view_theme_change', this.handleViewThemeChange)
  },
  methods: {
    ...mapMutations(['setLocalConfig']),

    handleViewThemeChange() {
      this.theme = this.mindMap.getTheme()
      this.handleDark()
    },

    initGroup() {
      const baiduThemes = [
        'default',
        'skyGreen',
        'classic2',
        'classic3',
        'classicGreen',
        'classicBlue',
        'blueSky',
        'brainImpairedPink',
        'earthYellow',
        'freshGreen',
        'freshRed',
        'romanticPurple',
        'pinkGrape',
        'mint'
      ]
      const baiduList = []
      const classicsList = []
      this.themeList.forEach(item => {
        if (baiduThemes.includes(item.value)) {
          baiduList.push(item)
        } else if (!item.dark) {
          classicsList.push(item)
        }
      })
      this.defaultGroupList = [
        {
          name: this.$t('theme.classics'),
          list: classicsList
        },
        {
          name: this.$t('theme.dark'),
          list: this.themeList.filter(item => {
            return item.dark
          })
        },
        {
          name: this.$t('theme.simple'),
          list: baiduList
        }
      ]
      this.activeName = this.defaultGroupList[0].name
    },

    useTheme(theme) {
      if (theme.value === this.theme) return
      this.theme = theme.value
      this.handleDark()
      const customThemeConfig = this.mindMap.getCustomThemeConfig()
      const hasCustomThemeConfig = Object.keys(customThemeConfig).length > 0
      if (hasCustomThemeConfig) {
        this.$confirm(this.$t('theme.coverTip'), this.$t('theme.tip'), {
          confirmButtonText: this.$t('theme.cover'),
          cancelButtonText: this.$t('theme.reserve'),
          type: 'warning',
          distinguishCancelAndClose: true,
          customClass: 'smmCustomElConfirm',
          callback: action => {
            if (action === 'confirm') {
              this.mindMap.setThemeConfig({}, true)
              this.data.theme.config = {}
              this.changeTheme(theme, {})
            } else if (action === 'cancel') {
              this.changeTheme(theme, customThemeConfig)
            }
          }
        })
      } else {
        this.changeTheme(theme, customThemeConfig)
      }
    },

    changeTheme(theme, config) {
      this.$root.$bus.$emit('showLoading')
      this.mindMap.setTheme(theme.value)
      this.$root.$bus.$emit('storeData', {
        theme: {
          template: theme.value,
          config
        }
      })
    },

    handleDark() {
      if (this.$root.$obsidianAPI.getSettings().themeMode === 'follow') return
      let target = [...this.themeList].find(item => {
        return item.value === this.theme
      })
      this.setLocalConfig({
        isDark: target.dark
      })
      this.$root.$obsidianAPI.updateSettings({
        themeMode: target.dark ? 'dark' : 'light'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.themeGroupList {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  &.isDark {
    .name {
      color: #fff;
    }
  }

  .tabBox {
    flex-shrink: 0;

    /deep/ .el-tabs__nav-wrap {
      display: flex;
      justify-content: center;
    }
  }

  .themeListTheme {
    height: 100%;
    overflow-y: auto;
    padding: 0 12px;

    .themeItem {
      width: 100%;
      cursor: pointer;
      border-bottom: 1px solid #e9e9e9;
      margin-bottom: 20px;
      padding-bottom: 20px;
      transition: all 0.2s;
      border: 3px solid transparent;
      border-radius: 5px;
      overflow: hidden;

      &:last-of-type {
        border: none;
      }

      &:hover {
        box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
          0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
      }

      &.active {
        border: 3px solid var(--color-accent);
      }

      .imgBox {
        width: 100%;

        img {
          width: 100%;
        }
      }
      .name {
        text-align: center;
        font-size: 14px;
      }
    }
  }
}
</style>
