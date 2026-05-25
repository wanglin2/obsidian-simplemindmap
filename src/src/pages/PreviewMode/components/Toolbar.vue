<template>
  <div class="editInDocToolbarContainer" :class="{ isDark: isDark }">
    <el-select
      v-model="currentLayout"
      size="mini"
      style="width: 120px; margin-right: 8px;"
      @change="changeLayout"
    >
      <el-option
        v-for="item in layoutList"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="currentTheme"
      size="mini"
      style="width: 120px; margin-right: 8px;"
      @change="changeTheme"
    >
      <el-option
        v-for="item in themeList"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-dropdown @command="exportFile" v-if="!hideTools.includes('export')">
      <div
        class="toolbarBtn"
        :aria-label="$t('navigatorToolbar.export')"
        data-tooltip-position="bottom"
      >
        <span class="btnIcon iconfont iconexport"></span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="png">PNG</el-dropdown-item>
        <el-dropdown-item command="svg">SVG</el-dropdown-item>
        <el-dropdown-item command="pdf">PDF</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div
      class="toolbarBtn"
      :aria-label="$t('navigatorToolbar.backToRoot')"
      data-tooltip-position="top"
      @click="backToRoot"
    >
      <span class="btnIcon iconfont icondingwei"></span>
    </div>
    <div
      class="toolbarBtn"
      :aria-label="$t('contextmenu.fitCanvas')"
      data-tooltip-position="top"
      @click="fitCanvas"
    >
      <span
        class="btnIcon iconfont iconquanping1"
        style="font-size: 15px;"
      ></span>
    </div>
  </div>
</template>

<script>
import { layoutGroupList } from '@/config'
import themeList from 'simple-mind-map-plugin-themes/themeList'
import { mapState } from 'vuex'

export default {
  props: {
    mindMapData: {
      type: Object
    },
    mindMap: {
      type: Object
    },
    hideTools: {
      type: Array,
      default() {
        return []
      }
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
      currentLayout: '',
      currentTheme: ''
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    }),

    layoutList() {
      const groupList = layoutGroupList[this.$i18n.locale] || layoutGroupList.en
      const res = []
      groupList.forEach(group => {
        let list = [...group.list]
        if (!this.supportRightFishbone) {
          list = list.filter(item => {
            return !['rightFishbone'].includes(item)
          })
        }
        list.forEach((item2, index) => {
          res.push({
            name: group.name + (list.length > 1 ? index + 1 : ''),
            value: item2
          })
        })
      })
      return res
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.mindMapData) {
        return
      }
      this.currentLayout = this.mindMapData.layout
      this.currentTheme = this.mindMapData.theme.template
    },

    changeLayout(...args) {
      this.$emit('changeLayout', ...args)
    },

    changeTheme(...args) {
      this.$emit('changeTheme', ...args)
    },

    backToRoot() {
      this.mindMap.renderer.setRootNodeCenter()
    },

    fitCanvas() {
      this.mindMap.view.fit()
    },

    async exportFile(type) {
      let fileName = ''
      if (this.$root.$obsidianAPI.getFile) {
        const file = this.$root.$obsidianAPI.getFile()
        fileName = file.basename
      } else {
        fileName = this.$t('export.defaultFileName')
      }
      let args = []
      if (type === 'svg') {
        args = [
          type,
          true,
          fileName,
          `* {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }`
        ]
      } else if (type === 'png' || type === 'pdf') {
        args = [type, true, fileName, this.isTransparent]
      }
      await this.mindMap.export(...args)
    }
  }
}
</script>

<style lang="less" scoped>
.editInDocToolbarContainer {
  display: flex;
  align-items: center;

  &.isDark {
    .toolbarBtn {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
      color: hsla(0, 0%, 100%, 0.9);

      &:hover {
        background-color: #262a2e;
      }
    }
  }

  .toolbarBtn {
    padding: var(--size-2-2) var(--size-2-3);
    inset-inline-end: var(--size-2-2);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-muted);
    border-radius: var(--radius-s);
    cursor: var(--cursor);
    width: 28px;
    height: 28px;
    margin-right: 8px;

    &:hover {
      background-color: var(--background-modifier-hover);
    }

    .btnIcon {
      font-size: 18px;
    }
  }
}
</style>
