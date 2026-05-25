<template>
  <div class="configImportOutputDropdownContainer" :class="{ isDark: isDark }">
    <el-dropdown placement="bottom" @command="handleCommand">
      <span class="iconBtn el-icon-more" style="font-size: 20px;"></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="output">
          <div class="dropdownItem">
            <span class="iconfont iconexport"></span>
            <span class="text">{{ $t('ciod.outputConfig') }}</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="import">
          <div class="dropdownItem">
            <span class="iconfont icondaoru"></span>
            <span class="text">{{ $t('ciod.importConfig') }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <input
      ref="inputRef"
      class="fileInput"
      type="file"
      accept=".json"
      @change="onFileInputChange"
    />
  </div>
</template>

<script>
import { readBlob, downloadFile } from 'simple-mind-map/src/utils'
import { mapState } from 'vuex'

export default {
  props: {
    type: {
      type: String
    },
    name: {
      type: String
    },
    getConfig: {
      type: Function
    },
    setConfig: {
      type: Function
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  methods: {
    async handleCommand(command) {
      if (command === 'output') {
        const config = this.getConfig()
        const data = {
          type: this.type,
          config
        }
        const content = JSON.stringify(data)
        const blob = new Blob([content])
        const res = await readBlob(blob)
        downloadFile(res, this.name + '.json')
      } else if (command === 'import') {
        this.$refs.inputRef.click()
      }
    },

    onFileInputChange(e) {
      const file = e.target.files[0]
      if (!/\.json$/.test(file.name)) {
        this.$root.$obsidianAPI.showTip(this.$t('ciod.tip1'))
        return
      }
      const fileReader = new FileReader()
      fileReader.readAsText(file)
      fileReader.onload = evt => {
        try {
          const data = JSON.parse(evt.target.result)
          if (
            typeof data !== 'object' ||
            data === null ||
            data.type !== this.type ||
            !data.config
          ) {
            this.$root.$obsidianAPI.showTip(this.$t('ciod.tip2'))
            return
          }
          this.setConfig(data.config)
          this.$root.$obsidianAPI.showTip(this.$t('ciod.tip3'))
        } catch (error) {
          console.log(error)
          this.$root.$obsidianAPI.showTip(this.$t('ciod.tip4'))
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.configImportOutputDropdownContainer {
  &.isDark {
    .iconBtn {
      color: hsla(0, 0%, 100%, 0.6);
    }
  }
}

.dropdownItem {
  display: flex;
  align-items: center;

  .iconfont {
    margin-right: 4px;
  }
}

.fileInput {
  display: none;
}
</style>
