<template>
  <div
    class="richTextToolbar"
    ref="richTextToolbar"
    :style="style"
    :class="{ isDark: isDark }"
    @click.stop.passive
    @mousedown.stop.prevent
    v-show="showRichTextToolbar"
  >
    <div
      class="btn"
      :class="{ active: formatInfo.bold }"
      @click="toggleBold"
      :aria-label="$t('richTextToolbar.bold')"
      data-tooltip-position="top"
    >
      <span class="icon iconfont iconzitijiacu"></span>
    </div>

    <div
      class="btn"
      :class="{ active: formatInfo.italic }"
      @click="toggleItalic"
      :aria-label="$t('richTextToolbar.italic')"
      data-tooltip-position="top"
    >
      <span class="icon iconfont iconzitixieti"></span>
    </div>

    <div
      class="btn"
      :class="{ active: formatInfo.underline }"
      @click="toggleUnderline"
      :aria-label="$t('richTextToolbar.underline')"
      data-tooltip-position="top"
    >
      <span class="icon iconfont iconzitixiahuaxian"></span>
    </div>

    <div
      class="btn"
      :class="{ active: formatInfo.strike }"
      @click="toggleStrike"
      :aria-label="$t('richTextToolbar.strike')"
      data-tooltip-position="top"
    >
      <span class="icon iconfont iconshanchuxian"></span>
    </div>

    <el-popover placement="bottom" trigger="hover">
      <div class="fontOptionsList" :class="{ isDark: isDark }">
        <div
          class="fontOptionItem"
          v-for="item in fontFamilyList"
          :key="item.value"
          :style="{ fontFamily: item.value }"
          :class="{ active: formatInfo.font === item.value }"
          @click="changeFontFamily(item.value)"
        >
          {{ item.name }}
        </div>
      </div>
      <div
        class="btn"
        slot="reference"
        :aria-label="$t('richTextToolbar.fontFamily')"
        data-tooltip-position="top"
      >
        <span class="icon iconfont iconxingzhuang-wenzi"></span>
      </div>
    </el-popover>

    <el-popover placement="bottom" trigger="hover">
      <div class="fontOptionsList" :class="{ isDark: isDark }">
        <div
          class="fontOptionItem"
          v-for="item in fontSizeList"
          :key="item"
          :style="{
            fontSize: item + 'px',
            height: (item < 30 ? 30 : item + 10) + 'px'
          }"
          :class="{ active: formatInfo.size === item + 'px' }"
          @click="changeFontSize(item)"
        >
          {{ item }}px
        </div>
      </div>
      <div
        class="btn"
        slot="reference"
        :aria-label="$t('richTextToolbar.fontSize')"
        data-tooltip-position="top"
      >
        <span class="icon iconfont iconcase fontColor"></span>
      </div>
    </el-popover>

    <el-popover placement="bottom" trigger="hover">
      <Color :color="fontColor" @change="changeFontColor"></Color>
      <div
        class="btn"
        slot="reference"
        :style="{ color: formatInfo.color }"
        :aria-label="$t('richTextToolbar.color')"
        data-tooltip-position="top"
      >
        <span class="icon iconfont iconzitiyanse"></span>
      </div>
    </el-popover>

    <el-popover placement="bottom" trigger="hover">
      <Color
        :color="fontBackgroundColor"
        @change="changeFontBackgroundColor"
      ></Color>
      <div
        class="btn"
        slot="reference"
        :aria-label="$t('richTextToolbar.backgroundColor')"
        data-tooltip-position="top"
      >
        <span class="icon iconfont iconbeijingyanse"></span>
      </div>
    </el-popover>

    <el-popover placement="bottom" trigger="hover">
      <div class="fontOptionsList" :class="{ isDark: isDark }">
        <div
          class="fontOptionItem"
          v-for="item in alignList"
          :key="item.value"
          :class="{ active: formatInfo.align === item.value }"
          @click="changeTextAlign(item.value)"
        >
          {{ item.name }}
        </div>
      </div>
      <div
        class="btn"
        slot="reference"
        :aria-label="$t('richTextToolbar.textAlign')"
        data-tooltip-position="top"
      >
        <span class="icon iconfont iconjuzhongduiqi"></span>
      </div>
    </el-popover>

    <div
      class="btn"
      @click="removeFormat"
      :aria-label="$t('richTextToolbar.removeFormat')"
      data-tooltip-position="top"
    >
      <span class="icon iconfont iconqingchu"></span>
    </div>
  </div>
</template>

<script>
import { fontSizeList, alignList } from '@/config'
import Color from './Color.vue'
import { mapState } from 'vuex'
import fontFamilyMixin from '@/mixins/fontFamily'

export default {
  mixins: [fontFamilyMixin],
  components: {
    Color
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      fontSizeList,
      showRichTextToolbar: false,
      style: {
        left: 0,
        top: 0
      },
      fontColor: '',
      fontBackgroundColor: '',
      formatInfo: {}
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    }),

    alignList() {
      return alignList[this.$i18n.locale] || alignList.en
    }
  },
  created() {
    this.mindMap.on(
      'rich_text_selection_change',
      this.onRichTextSelectionChange
    )
  },
  mounted() {
    this.mindMap.el.parentNode.append(this.$refs.richTextToolbar)
  },
  beforeDestroy() {
    this.mindMap.off(
      'rich_text_selection_change',
      this.onRichTextSelectionChange
    )
  },
  methods: {
    onRichTextSelectionChange(hasRange, rect, formatInfo) {
      this.showRichTextToolbar = hasRange
      if (hasRange) {
        this.$nextTick(() => {
          const elRect = this.mindMap.elRect
          const boxRect = this.$refs.richTextToolbar.getBoundingClientRect()
          let left =
            rect.left + rect.width / 2 - boxRect.width / 2 - elRect.left
          let top = rect.top - 60 - elRect.top
          if (left < 0) {
            left = 0
          }
          if (left + boxRect.width > elRect.width) {
            left = elRect.width - boxRect.width
          }
          if (top < 0) {
            top = rect.bottom + 10 - elRect.top
          }
          if (top + boxRect.height > elRect.height) {
            top = rect.top - elRect.top - boxRect.height
          }
          this.style.left = left + 'px'
          this.style.top = top + 'px'
          this.formatInfo = { ...(formatInfo || {}) }
        })
      }
    },

    toggleBold() {
      this.formatInfo.bold = !this.formatInfo.bold
      this.mindMap.richText.formatText({
        bold: this.formatInfo.bold
      })
    },

    toggleItalic() {
      this.formatInfo.italic = !this.formatInfo.italic
      this.mindMap.richText.formatText({
        italic: this.formatInfo.italic
      })
    },

    toggleUnderline() {
      this.formatInfo.underline = !this.formatInfo.underline
      this.mindMap.richText.formatText({
        underline: this.formatInfo.underline
      })
    },

    toggleStrike() {
      this.formatInfo.strike = !this.formatInfo.strike
      this.mindMap.richText.formatText({
        strike: this.formatInfo.strike
      })
    },

    changeFontFamily(font) {
      this.formatInfo.font = font
      this.mindMap.richText.formatText({
        font
      })
    },

    changeFontSize(size) {
      this.formatInfo.size = size
      this.mindMap.richText.formatText({
        size: size + 'px'
      })
    },

    changeFontColor(color) {
      this.formatInfo.color = color
      this.mindMap.richText.formatText({
        color
      })
    },

    changeFontBackgroundColor(background) {
      this.formatInfo.background = background
      this.mindMap.richText.formatText({
        background
      })
    },

    changeTextAlign(align) {
      this.formatInfo.align = align
      this.mindMap.richText.formatText({
        align
      })
    },

    removeFormat() {
      this.mindMap.richText.removeFormat()
    }
  }
}
</script>

<style lang="less" scoped>
.richTextToolbar {
  position: absolute;
  z-index: 2000;
  height: 55px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;

  &.isDark {
    background: #363b3f;

    .btn {
      color: #fff;

      &:hover {
        background: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .btn {
    width: 55px;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #eefbed;
    }

    &.active {
      color: #12bb37;
    }

    .icon {
      font-size: 20px;

      &.fontColor {
        font-size: 26px;
      }
    }
  }
}

.fontOptionsList {
  width: 150px;

  &.isDark {
    .fontOptionItem {
      color: #fff;

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .fontOptionItem {
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #f7f7f7;
    }

    &.active {
      color: #12bb37;
    }
  }
}
</style>
