<template>
  <div class="scaleContainer" :class="{ isDark: isDark, isMobile: isMobile }">
    <div
      class="btn el-icon-minus"
      @click="narrow"
      :aria-label="$t('scale.zoomOut')"
      data-tooltip-position="top"
    ></div>
    <div class="scaleInfo">
      <input
        ref="inputRef"
        type="text"
        v-model="scaleNum"
        @input="onScaleNumInput"
        @change="onScaleNumChange"
        @focus="onScaleNumInputFocus"
        @keydown.stop
        @keyup.stop
      />%
    </div>
    <div
      class="btn el-icon-plus"
      @click="enlarge"
      :aria-label="$t('scale.zoomIn')"
      data-tooltip-position="top"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    return {
      scaleNum: 100,
      cacheScaleNum: 0
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.isMobile
    })
  },
  watch: {
    mindMap(val, oldVal) {
      if (val && !oldVal) {
        this.mindMap.on('scale', this.onScale)
        this.mindMap.on('draw_click', this.onDrawClick)
        this.scaleNum = this.toPer(this.mindMap.view.scale)
      }
    }
  },
  beforeDestroy() {
    this.mindMap.off('scale', this.onScale)
    this.mindMap.off('draw_click', this.onDrawClick)
  },
  methods: {
    toPer(scale) {
      return (scale * 100).toFixed(0)
    },

    narrow() {
      this.mindMap.view.narrow()
    },

    enlarge() {
      this.mindMap.view.enlarge()
    },

    onScaleNumInputFocus() {
      this.cacheScaleNum = this.scaleNum
    },

    onScaleNumInput() {
      this.scaleNum = this.scaleNum.replace(/[^0-9]+/g, '')
    },

    onScaleNumChange() {
      const scaleNum = Number(this.scaleNum)
      if (Number.isNaN(scaleNum) || scaleNum <= 0) {
        this.scaleNum = this.cacheScaleNum
      } else {
        const cx = this.mindMap.width / 2
        const cy = this.mindMap.height / 2
        this.mindMap.view.setScale(this.scaleNum / 100, cx, cy)
      }
    },

    onScale(scale) {
      this.scaleNum = this.toPer(scale)
    },

    onDrawClick() {
      if (this.$refs.inputRef) this.$refs.inputRef.blur()
    }
  }
}
</script>

<style lang="less" scoped>
.scaleContainer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &.isMobile {
    flex-direction: column;

    .scaleInfo {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  &.isDark {
    .btn {
      color: hsla(0, 0%, 100%, 0.6);

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }

    .scaleInfo {
      color: hsla(0, 0%, 100%, 0.6);

      input {
        color: hsla(0, 0%, 100%, 0.6);
      }
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

  .scaleInfo {
    margin-right: 2px;
    display: flex;
    align-items: center;

    input {
      width: 35px;
      text-align: center;
      background-color: transparent;
      border: none;
      outline: none;
      padding: 0;
    }
  }
}
</style>
