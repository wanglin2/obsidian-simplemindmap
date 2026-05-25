<template>
  <Sidebar ref="sidebar" :title="$t('style.title')">
    <div
      class="styleContent smmCommonSidebarContent smmCustomScrollbar"
      :class="{ isDark: isDark }"
      v-if="activeNodes.length > 0"
    >
      <div class="smmSidebarGroupTitle noTop">{{ $t('style.text') }}</div>
      <div class="row">
        <el-select
          size="mini"
          style="width: 105px"
          v-model="style.fontFamily"
          placeholder=""
          @change="update('fontFamily')"
        >
          <el-option
            v-for="item in fontFamilyList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
            :style="{ fontFamily: item.value }"
          >
          </el-option>
        </el-select>
        <el-select
          size="mini"
          style="width: 60px"
          v-model="style.fontSize"
          placeholder=""
          @change="update('fontSize')"
        >
          <el-option
            v-for="item in fontSizeList"
            :key="item"
            :label="item"
            :value="item"
            :style="{ fontSize: item + 'px' }"
          >
          </el-option>
        </el-select>
        <el-select
          size="mini"
          style="width: 85px"
          v-model="style.textAlign"
          placeholder=""
          @change="update('textAlign')"
        >
          <el-option
            v-for="item in alignList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="row">
        <div class="smmFontStyleBtnList">
          <div
            class="styleBtn"
            v-popover:popover
            :aria-label="$t('style.color')"
            data-tooltip-position="top"
          >
            A
            <span
              class="colorShow"
              :style="{ backgroundColor: style.color || '#eee' }"
            ></span>
          </div>
          <div
            class="styleBtn"
            :class="{
              actived: style.fontWeight === 'bold'
            }"
            @click="toggleFontWeight"
            placement="top"
            :aria-label="$t('style.addFontWeight')"
            data-tooltip-position="top"
          >
            B
          </div>
          <div
            class="styleBtn i"
            :class="{
              actived: style.fontStyle === 'italic'
            }"
            @click="toggleFontStyle"
            placement="top"
            :aria-label="$t('style.italic')"
            data-tooltip-position="top"
          >
            I
          </div>
          <div
            class="styleBtn u"
            :style="{ textDecoration: style.textDecoration || 'none' }"
            v-popover:popover2
            placement="top"
            :aria-label="$t('style.textDecoration')"
            data-tooltip-position="top"
          >
            U
          </div>
        </div>
        <el-popover ref="popover" placement="bottom" trigger="hover">
          <Color :color="style.color" @change="changeFontColor"></Color>
        </el-popover>
        <el-popover ref="popover2" placement="bottom" trigger="hover">
          <el-radio-group
            size="mini"
            v-model="style.textDecoration"
            @change="update('textDecoration')"
          >
            <el-radio-button label="none">{{
              $t('style.none')
            }}</el-radio-button>
            <el-radio-button label="underline">{{
              $t('style.underline')
            }}</el-radio-button>
            <el-radio-button label="line-through">{{
              $t('style.lineThrough')
            }}</el-radio-button>
            <el-radio-button label="overline">{{
              $t('style.overline')
            }}</el-radio-button>
          </el-radio-group>
        </el-popover>
      </div>
      <div class="smmSidebarGroupTitle">{{ $t('style.border') }}</div>
      <div class="row">
        <div class="rowItem mr">
          <span class="name">{{ $t('style.color') }}</span>
          <span
            class="block"
            v-popover:popover3
            :style="{ width: '80px', backgroundColor: style.borderColor }"
          ></span>
          <el-popover ref="popover3" placement="bottom" trigger="hover">
            <Color
              :color="style.borderColor"
              @change="changeBorderColor"
            ></Color>
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ $t('style.style') }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.borderDasharray"
            placeholder=""
            @change="update('borderDasharray')"
          >
            <el-option
              v-for="item in borderDasharrayList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
              <svg width="120" height="34">
                <line
                  x1="10"
                  y1="17"
                  x2="110"
                  y2="17"
                  stroke-width="2"
                  :stroke="
                    style.borderDasharray === item.value
                      ? 'var(--color-accent)'
                      : isDark
                      ? '#fff'
                      : '#000'
                  "
                  :stroke-dasharray="item.value"
                ></line>
              </svg>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="rowItem mr">
          <span class="name">{{ $t('style.width') }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.borderWidth"
            placeholder=""
            @change="update('borderWidth')"
          >
            <el-option
              v-for="item in borderWidthList"
              :key="item"
              :label="item"
              :value="item"
            >
              <span
                v-if="item > 0"
                class="smmBorderLine"
                :class="{ isDark: isDark }"
                :style="{ height: item + 'px' }"
              ></span>
            </el-option>
          </el-select>
        </div>
        <div class="rowItem" v-show="style.shape === 'rectangle'">
          <span class="name" :title="$t('style.borderRadius')">{{
            $t('style.borderRadius')
          }}</span>
          <el-select
            size="mini"
            style="width: 80px; flex-shrink: 0;"
            v-model="style.borderRadius"
            placeholder=""
            @change="update('borderRadius')"
          >
            <el-option
              v-for="item in borderRadiusList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="smmSidebarGroupTitle">{{ $t('style.background') }}</div>
      <div class="row">
        <div class="rowItem mr">
          <span class="name">{{ $t('style.color') }}</span>
          <span
            class="block"
            v-popover:popover4
            :style="{ backgroundColor: style.fillColor }"
          ></span>
          <el-popover ref="popover4" placement="bottom" trigger="hover">
            <Color :color="style.fillColor" @change="changeFillColor"></Color>
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ $t('style.gradientStyle') }}</span>
          <el-checkbox
            v-model="style.gradientStyle"
            @change="update('gradientStyle')"
          ></el-checkbox>
        </div>
      </div>
      <div class="row" v-if="style.gradientStyle">
        <div class="rowItem mr" style="width: 60%;">
          <span class="name">{{ $t('style.startColor') }}</span>
          <span
            class="block"
            v-popover:popover6
            :style="{ backgroundColor: style.startColor }"
          ></span>
          <el-popover ref="popover6" placement="bottom" trigger="hover">
            <Color :color="style.startColor" @change="changeStartColor"></Color>
          </el-popover>
        </div>
        <div class="rowItem mr" style="width: 60%;">
          <span class="name">{{ $t('style.endColor') }}</span>
          <span
            class="block"
            v-popover:popover7
            :style="{ backgroundColor: style.endColor }"
          ></span>
          <el-popover ref="popover7" placement="bottom" trigger="hover">
            <Color :color="style.endColor" @change="changeEndColor"></Color>
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name" :title="$t('style.direction')">{{
            $t('style.direction')
          }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.linearGradientDir"
            placeholder=""
            @change="update('linearGradientDir')"
          >
            <el-option
              v-for="item in linearGradientDirList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="smmSidebarGroupTitle">{{ $t('style.shape') }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('style.shape') }}</span>
          <el-select
            size="mini"
            style="width: 130px"
            v-model="style.shape"
            placeholder=""
            @change="update('shape')"
          >
            <el-option
              v-for="item in shapeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              style="display: flex; justify-content: center; align-items: center;"
            >
              <svg
                :width="item.width || 60"
                :height="item.height || 26"
                style="margin-top: 5px"
              >
                <path
                  :d="shapeListMap[item.value]"
                  fill="none"
                  :stroke="
                    style.shape === item.value
                      ? 'var(--color-accent)'
                      : isDark
                      ? '#fff'
                      : '#000'
                  "
                  stroke-width="2"
                ></path>
              </svg>
            </el-option>
          </el-select>
        </div>
      </div>
      <template v-if="!isGeneralization">
        <div class="smmSidebarGroupTitle">{{ $t('style.line') }}</div>
        <div class="row">
          <div class="rowItem mr">
            <span class="name">{{ $t('style.color') }}</span>
            <span
              class="block"
              v-popover:popover5
              :style="{ width: '80px', backgroundColor: style.lineColor }"
            ></span>
            <el-popover ref="popover5" placement="bottom" trigger="hover">
              <Color :color="style.lineColor" @change="changeLineColor"></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('style.style') }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="style.lineDasharray"
              placeholder=""
              @change="update('lineDasharray')"
            >
              <el-option
                v-for="item in borderDasharrayList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
                <svg width="120" height="34">
                  <line
                    x1="10"
                    y1="17"
                    x2="110"
                    y2="17"
                    stroke-width="2"
                    :stroke="
                      style.lineDasharray === item.value
                        ? 'var(--color-accent)'
                        : isDark
                        ? '#fff'
                        : '#000'
                    "
                    :stroke-dasharray="item.value"
                  ></line>
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem mr">
            <span class="name">{{ $t('style.width') }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="style.lineWidth"
              placeholder=""
              @change="update('lineWidth')"
            >
              <el-option
                v-for="item in borderWidthList"
                :key="item"
                :label="item"
                :value="item"
              >
                <span
                  v-if="item > 0"
                  class="smmBorderLine"
                  :class="{ isDark: isDark }"
                  :style="{ height: item + 'px' }"
                ></span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem mr">
            <span class="name">显示箭头</span>
            <span
              class="icon iconfont iconbangzhu"
              style="margin: 0 4px;"
              aria-label="设置到子级节点连线的箭头"
              data-tooltip-position="left"
            ></span>
            <el-checkbox
              v-model="style.showLineMarker"
              @change="update('showLineMarker')"
            ></el-checkbox>
          </div>
          <div class="rowItem">
            <span class="name" :title="$t('style.arrowDir')">{{
              $t('style.arrowDir')
            }}</span>
            <span
              class="icon iconfont iconbangzhu"
              style="margin: 0 4px;"
              aria-label="这个方向设置的是和父节点连线的箭头的方向"
              data-tooltip-position="left"
            ></span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="style.lineMarkerDir"
              placeholder=""
              @change="update('lineMarkerDir')"
            >
              <el-option
                key="start"
                :label="$t('style.arrowDirStart')"
                value="start"
              ></el-option>
              <el-option
                key="end"
                :label="$t('style.arrowDirEnd')"
                value="end"
              ></el-option>
            </el-select>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="smmSidebarGroupTitle">
          {{ $t('baseStyle.lineOfOutline') }}
        </div>
        <div class="row">
          <div class="rowItem mr">
            <span class="name">{{ $t('baseStyle.color') }}</span>
            <span
              class="block"
              v-popover:popover8
              :style="{ backgroundColor: style.generalizationLineColor }"
            ></span>
            <el-popover ref="popover8" placement="bottom" trigger="hover">
              <Color
                :color="style.generalizationLineColor"
                @change="changeGeneralizationLineColor"
              ></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('baseStyle.width') }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="style.generalizationLineWidth"
              placeholder=""
              @change="update('generalizationLineWidth')"
            >
              <el-option
                v-for="item in lineWidthList"
                :key="item"
                :label="item"
                :value="item"
              >
                <span
                  v-if="item > 0"
                  class="smmBorderLine"
                  :class="{ isDark: isDark }"
                  :style="{ height: item + 'px' }"
                ></span>
              </el-option>
            </el-select>
          </div>
        </div>
      </template>
      <div class="smmSidebarGroupTitle">{{ $t('style.nodePadding') }}</div>
      <div class="row noBottom">
        <div class="rowItem">
          <span class="name">{{ $t('style.horizontal') }}</span>
          <el-slider
            style="width: 200px"
            v-model="style.paddingX"
            @change="update('paddingX')"
          ></el-slider>
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('style.vertical') }}</span>
          <el-slider
            style="width: 200px"
            v-model="style.paddingY"
            @change="update('paddingY')"
          ></el-slider>
        </div>
      </div>
      <template v-if="!isFishLayout">
        <div class="title">节点外边距</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">下外边距</span>
            <el-slider
              :max="200"
              style="width: 175px"
              v-model="style.marginY"
              @change="update('marginY')"
            ></el-slider>
          </div>
        </div>
      </template>
      <div class="smmSidebarGroupTitle">{{ $t('style.img') }}</div>
      <div class="row">
        <div class="rowItem wrap">
          <span class="name mb">{{ $t('style.placement') }}</span>
          <el-radio-group
            v-model="style.imgPlacement"
            size="mini"
            class="fullWidth"
            @change="update('imgPlacement')"
          >
            <el-radio-button label="top">{{ $t('style.top') }}</el-radio-button>
            <el-radio-button label="bottom">{{
              $t('style.bottom')
            }}</el-radio-button>
            <el-radio-button label="left">{{
              $t('style.left')
            }}</el-radio-button>
            <el-radio-button label="right">{{
              $t('style.right')
            }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="smmSidebarGroupTitle">{{ $t('style.tag') }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('style.placement') }}</span>
          <el-radio-group
            v-model="style.tagPlacement"
            size="mini"
            @change="update('tagPlacement')"
          >
            <el-radio-button label="right">{{
              $t('style.right')
            }}</el-radio-button>
            <el-radio-button label="bottom">{{
              $t('style.bottom')
            }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="tipBox" v-else>
      <div class="tipIcon iconfont icontianjiazijiedian"></div>
      <div class="tipText">{{ $t('style.selectNodeTip') }}</div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Color from './Color.vue'
import {
  fontSizeList,
  borderWidthList,
  borderDasharrayList,
  borderRadiusList,
  shapeList,
  shapeListMap,
  linearGradientDirList,
  alignList,
  lineWidthList
} from '@/config'
import { mapState } from 'vuex'
import fontFamilyMixin from '@/mixins/fontFamily'

export default {
  mixins: [fontFamilyMixin],
  components: {
    Sidebar,
    Color
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      lineWidthList,
      fontSizeList,
      borderWidthList,
      borderRadiusList,
      activeNodes: [],
      style: {
        shape: '',
        paddingX: 0,
        paddingY: 0,
        color: '',
        fontFamily: '',
        fontSize: '',
        textDecoration: '',
        fontWeight: '',
        fontStyle: '',
        borderWidth: '',
        borderColor: '',
        fillColor: '',
        borderDasharray: '',
        borderRadius: '',
        lineColor: '',
        lineDasharray: '',
        lineWidth: '',
        showLineMarker: false,
        lineMarkerDir: '',
        gradientStyle: false,
        startColor: '',
        endColor: '',
        linearGradientDir: '',
        lineFlow: false,
        lineFlowForward: true,
        lineFlowDuration: 1,
        textAlign: '',
        imgPlacement: '',
        tagPlacement: '',
        generalizationLineWidth: '',
        generalizationLineColor: '',
        marginY: 0
      },
      isFishLayout: false
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      activeSidebar: state => state.activeSidebar
    }),
    borderDasharrayList() {
      return borderDasharrayList[this.$i18n.locale] || borderDasharrayList.en
    },
    shapeList() {
      return [
        ...(shapeList[this.$i18n.locale] || shapeList.en),
        ...this.mindMap.extendShapeList
          .filter(item => {
            return !['fishHead'].includes(item.name)
          })
          .map(item => {
            return {
              width: '40px',
              name: item.nameShow,
              value: item.name
            }
          })
      ]
    },
    shapeListMap() {
      const map2 = {}
      this.mindMap.extendShapeList.forEach(item => {
        map2[item.name] = item.path
      })
      return {
        ...shapeListMap,
        ...map2
      }
    },
    linearGradientDirList() {
      return (
        linearGradientDirList[this.$i18n.locale] || linearGradientDirList.en
      )
    },
    alignList() {
      return alignList[this.$i18n.locale] || alignList.en
    },
    isGeneralization() {
      return (
        this.activeNodes.length === 1 && this.activeNodes[0].isGeneralization
      )
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'nodeStyle') {
        this.$refs.sidebar.show = true
        this.isFishLayout = ['fishbone'].some(item => {
          return this.mindMap.renderer.isLayout(item)
        })
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    this.$root.$bus.$on('node_active', this.onNodeActive)
  },
  beforeDestroy() {
    this.$root.$bus.$off('node_active', this.onNodeActive)
  },
  methods: {
    onNodeActive(...args) {
      this.$nextTick(() => {
        this.activeNodes = [...args[1]]
        this.initNodeStyle()
      })
    },

    initNodeStyle() {
      if (this.activeNodes.length <= 0) {
        return
      }
      Object.keys(this.style).forEach(item => {
        this.style[item] = this.activeNodes[0].getStyle(item, false)
      })
      this.initLinearGradientDir()
    },

    initLinearGradientDir() {
      const startDir = this.activeNodes[0].getStyle('startDir', false)
      const endDir = this.activeNodes[0].getStyle('endDir', false)
      const target = this.linearGradientDirList.find(item => {
        return (
          item.start[0] === startDir[0] &&
          item.start[1] === startDir[1] &&
          item.end[0] === endDir[0] &&
          item.end[1] === endDir[1]
        )
      })
      if (target) {
        this.style.linearGradientDir = target.value
      }
    },

    update(prop) {
      if (prop === 'linearGradientDir') {
        const target = this.linearGradientDirList.find(item => {
          return item.value === this.style.linearGradientDir
        })
        this.activeNodes.forEach(node => {
          node.setStyles({
            startDir: [...target.start],
            endDir: [...target.end]
          })
        })
      } else {
        this.activeNodes.forEach(node => {
          node.setStyle(prop, this.style[prop])
        })
      }
    },

    toggleFontWeight() {
      if (this.style.fontWeight === 'bold') {
        this.style.fontWeight = 'normal'
      } else {
        this.style.fontWeight = 'bold'
      }
      this.update('fontWeight')
    },

    toggleFontStyle() {
      if (this.style.fontStyle === 'italic') {
        this.style.fontStyle = 'normal'
      } else {
        this.style.fontStyle = 'italic'
      }
      this.update('fontStyle')
    },

    changeFontColor(color) {
      this.style.color = color
      this.update('color')
    },

    changeBorderColor(color) {
      this.style.borderColor = color
      this.update('borderColor')
    },

    changeLineColor(color) {
      this.style.lineColor = color
      this.update('lineColor')
    },

    changeFillColor(color) {
      this.style.fillColor = color
      this.update('fillColor')
    },

    changeStartColor(color) {
      this.style.startColor = color
      this.update('startColor')
    },

    changeEndColor(color) {
      this.style.endColor = color
      this.update('endColor')
    },

    changeGeneralizationLineColor(color) {
      this.style.generalizationLineColor = color
      this.update('generalizationLineColor')
    }
  }
}
</script>

<style lang="less" scoped>
.styleContent {
  &.isDark {
  }

  .row {
    .rowItem {
      /deep/ .el-radio-group {
        display: flex;

        &.fullWidth {
          width: 100%;

          .el-radio-button,
          .el-radio-button__inner {
            width: 100%;
          }
        }
      }
    }
  }
}

.tipBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;

  .tipIcon {
    font-size: 100px;
  }
}
</style>
