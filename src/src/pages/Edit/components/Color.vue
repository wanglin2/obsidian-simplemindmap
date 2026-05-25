<template>
  <div class="colorContainer" :class="{ isDark: isDark }">
    <div class="colorList">
      <span
        class="colorItem iconfont"
        v-for="item in colorList"
        :style="{ backgroundColor: item }"
        :class="{ icontouming: item === 'transparent' }"
        :key="item"
        @click="clickColorItem(item)"
      ></span>
    </div>
    <div class="moreColor">
      <span>{{ $t('color.moreColor') }}</span>
      <el-color-picker
        popper-class="smmColorPicker"
        size="mini"
        show-alpha
        v-model="selectColor"
        @change="changeColor"
      ></el-color-picker>
    </div>
  </div>
</template>

<script>
import { colorList } from '@/config'
import { mapState } from 'vuex'

export default {
  props: {
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      colorList,
      selectColor: ''
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    color() {
      this.selectColor = this.color
    }
  },
  created() {
    this.selectColor = this.color
  },
  methods: {
    clickColorItem(color) {
      this.$emit('change', color)
    },

    changeColor() {
      this.$emit('change', this.selectColor)
    }
  }
}
</script>

<style lang="less" scoped>
.colorContainer {
  &.isDark {
    .moreColor {
      color: hsla(0, 0%, 100%, 0.6);
    }
  }
}

.colorList {
  width: 240px;
  display: flex;
  flex-wrap: wrap;

  .colorItem {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}

.moreColor {
  display: flex;
  align-items: center;

  span {
    margin-right: 5px;
  }
}
</style>
<style lang="less">
.smmColorPicker {
  .el-color-dropdown__btns {
    .el-color-dropdown__link-btn {
      color: var(--text-accent) !important;
      background-color: transparent;
      box-shadow: none;
    }
  }
}
</style>