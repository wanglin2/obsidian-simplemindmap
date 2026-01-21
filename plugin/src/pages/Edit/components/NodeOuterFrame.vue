<template>
  <Sidebar ref="sidebar" :title="$t('nodeOuterFrame.nodeOuterFrameStyle')">
    <div
      class="nodeOuterFrameContent smmCommonSidebarContent smmCustomScrollbar"
      :class="{ isDark: isDark }"
    >
      <div class="panelHeader noTop">
        <span class="name" :title="$t('nodeOuterFrame.outerFrameSetting')">{{
          $t('nodeOuterFrame.outerFrameSetting')
        }}</span>
        <span
          class="deleteBtn"
          :title="$t('nodeOuterFrame.deleteOuterFrame')"
          @click="deleteOuterFrame"
        >
          <span class="text">{{ $t('nodeOuterFrame.deleteOuterFrame') }}</span>
          <span class="iconfont iconshanchu"></span>
        </span>
      </div>
      <div class="panelBody">
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.boxStyle') }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="styleConfig.strokeWidth"
              placeholder=""
              @change="
                value => {
                  updateOuterFrame('strokeWidth', value)
                }
              "
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
            <el-select
              size="mini"
              style="width: 80px;margin-left: 4px;"
              v-model="styleConfig.strokeDasharray"
              placeholder=""
              @change="
                value => {
                  updateOuterFrame('strokeDasharray', value)
                }
              "
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
                      styleConfig.strokeDasharray === item.value
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
            <span class="name">{{ $t('nodeOuterFrame.boxColor') }}</span>
            <span
              class="block"
              v-popover:popover
              :style="{ backgroundColor: styleConfig.strokeColor }"
            ></span>
            <el-popover ref="popover" placement="bottom" trigger="hover">
              <Color
                :color="styleConfig.strokeColor"
                @change="
                  color => {
                    updateOuterFrame('strokeColor', color)
                  }
                "
              ></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.radius') }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="styleConfig.radius"
              placeholder=""
              @change="
                value => {
                  updateOuterFrame('radius', value)
                }
              "
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
        <div class="row">
          <div class="rowItem half pr5">
            <span class="name">{{ $t('nodeOuterFrame.fillColor') }}</span>
            <span
              class="block"
              v-popover:popover2
              :style="{ backgroundColor: styleConfig.fill }"
            ></span>
            <el-popover ref="popover2" placement="bottom" trigger="hover">
              <Color
                :color="styleConfig.fill"
                @change="
                  color => {
                    updateOuterFrame('fill', color)
                  }
                "
              ></Color>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="panelHeader">
        <span class="name" :title="$t('nodeOuterFrame.outerFrameText')">{{
          $t('nodeOuterFrame.outerFrameText')
        }}</span>
        <span
          class="deleteBtn"
          :title="$t('nodeOuterFrame.deleteOuterFrameText')"
          @click="deleteOuterFrameText"
        >
          <span class="text">{{
            $t('nodeOuterFrame.deleteOuterFrameText')
          }}</span>
          <span class="iconfont iconshanchu"></span>
        </span>
      </div>
      <div class="panelBody">
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.fontFamily') }}</span>
            <el-select
              size="mini"
              style="width: 130px;"
              v-model="styleConfig.fontFamily"
              placeholder=""
              @change="
                value => {
                  updateOuterFrame('fontFamily', value)
                }
              "
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
          </div>
        </div>
        <div class="row">
          <div class="smmFontStyleBtnList">
            <div
              class="styleBtn"
              v-popover:popover3
              :aria-label="$t('nodeOuterFrame.color')"
              data-tooltip-position="top"
            >
              A
              <span
                class="colorShow"
                :style="{ backgroundColor: styleConfig.color }"
              ></span>
            </div>
            <div
              class="styleBtn"
              :class="{
                actived: styleConfig.fontWeight === 'bold'
              }"
              @click="toggleFontWeight"
              :aria-label="$t('nodeOuterFrame.fontBold')"
              data-tooltip-position="top"
            >
              B
            </div>
            <div
              class="styleBtn i"
              :class="{
                actived: styleConfig.fontStyle === 'italic'
              }"
              @click="toggleFontStyle"
              :aria-label="$t('nodeOuterFrame.italic')"
              data-tooltip-position="top"
            >
              I
            </div>
          </div>
          <el-popover ref="popover3" placement="bottom" trigger="hover">
            <Color
              :color="styleConfig.color"
              @change="
                color => {
                  updateOuterFrame('color', color)
                }
              "
            ></Color>
          </el-popover>
        </div>
        <div class="row">
          <div class="rowItem mr">
            <span class="name" :title="$t('nodeOuterFrame.lineHeight')">{{
              $t('nodeOuterFrame.lineHeight')
            }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="styleConfig.lineHeight"
              placeholder=""
              @change="
                value => {
                  updateOuterFrame('lineHeight', value)
                }
              "
            >
              <el-option
                v-for="item in lineHeightList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.fontSize') }}</span>
            <el-select
              size="mini"
              style="width: 80px"
              v-model="styleConfig.fontSize"
              placeholder=""
              @change="
                color => {
                  updateOuterFrame('fontSize', color)
                }
              "
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
          </div>
        </div>
        <div class="row">
          <div class="rowItem mr">
            <span class="name">{{ $t('nodeOuterFrame.textFill') }}</span>
            <span
              class="block"
              v-popover:popover4
              :style="{ backgroundColor: styleConfig.textFill }"
            ></span>
            <el-popover ref="popover4" placement="bottom" trigger="hover">
              <Color
                :color="styleConfig.textFill"
                @change="
                  color => {
                    updateOuterFrame('textFill', color)
                  }
                "
              ></Color>
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name" :title="$t('nodeOuterFrame.textFillRadius')">{{
              $t('nodeOuterFrame.textFillRadius')
            }}</span>
            <el-select
              size="mini"
              style="width: 80px; flex-shrink: 0;"
              v-model="styleConfig.textFillRadius"
              placeholder=""
              @change="
                value => {
                  updateOuterFrame('textFillRadius', value)
                }
              "
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
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.textAlign') }}</span>
            <el-radio-group
              v-model="styleConfig.textAlign"
              size="mini"
              @change="
                value => {
                  updateOuterFrame('textAlign', value)
                }
              "
            >
              <el-radio-button label="left">{{
                $t('nodeOuterFrame.left')
              }}</el-radio-button>
              <el-radio-button label="center">{{
                $t('nodeOuterFrame.center')
              }}</el-radio-button>
              <el-radio-button label="right">{{
                $t('nodeOuterFrame.right')
              }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.paddingX') }}</span>
            <el-slider
              style="width: 180px"
              v-model="paddingStyle.paddingX"
              @change="
                value => {
                  updatePadding('x', value)
                }
              "
            ></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t('nodeOuterFrame.paddingY') }}</span>
            <el-slider
              style="width: 180px"
              v-model="paddingStyle.paddingY"
              @change="
                value => {
                  updatePadding('y', value)
                }
              "
            ></el-slider>
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Color from './Color.vue'
import { mapState, mapMutations } from 'vuex'
import {
  lineWidthList,
  borderDasharrayList,
  fontSizeList,
  borderRadiusList,
  lineHeightList
} from '@/config'
import OuterFrame from 'simple-mind-map/src/plugins/OuterFrame'
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
      lineHeightList,
      fontSizeList,
      borderRadiusList,
      styleConfig: {
        ...OuterFrame.defaultStyle
      },
      paddingStyle: {
        paddingX: 0,
        paddingY: 0
      }
    }
  },
  computed: {
    ...mapState({
      activeSidebar: state => state.activeSidebar,
      isDark: state => state.localConfig.isDark,
      borderDasharrayList() {
        return borderDasharrayList[this.$i18n.locale] || borderDasharrayList.en
      }
    })
  },
  watch: {
    activeSidebar(val) {
      if (val === 'nodeOuterFrameStyle') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    this.mindMap.on('outer_frame_active', this.onOuterFrameActive)
    this.mindMap.on('outer_frame_delete', this.hide)
    this.mindMap.on('outer_frame_deactivate', this.hide)
  },
  beforeDestroy() {
    this.mindMap.off('outer_frame_active', this.onOuterFrameActive)
    this.mindMap.off('outer_frame_delete', this.hide)
    this.mindMap.off('outer_frame_deactivate', this.hide)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    onOuterFrameActive(el, parentNode, range) {
      const firstNode = parentNode.children[range[0]]
      const firstNodeOuterFrame = firstNode.getData('outerFrame')
      Object.keys(this.styleConfig).forEach(key => {
        if (typeof firstNodeOuterFrame[key] !== 'undefined') {
          this.styleConfig[key] = firstNodeOuterFrame[key]
        } else {
          this.styleConfig[key] = OuterFrame.defaultStyle[key]
        }
      })
      const [pl, pt] = this.styleConfig.textFillPadding
      this.paddingStyle.paddingX = pl
      this.paddingStyle.paddingY = pt
      this.setActiveSidebar('nodeOuterFrameStyle')
    },

    updateOuterFrame(key, val) {
      this.styleConfig[key] = val
      this.mindMap.outerFrame.updateActiveOuterFrame({
        [key]: val
      })
    },

    toggleFontWeight() {
      const newValue =
        this.styleConfig.fontWeight === 'bold' ? 'normal' : 'bold'
      this.updateOuterFrame('fontWeight', newValue)
    },

    toggleFontStyle() {
      const newValue =
        this.styleConfig.fontStyle === 'italic' ? 'normal' : 'italic'
      this.updateOuterFrame('fontStyle', newValue)
    },

    updatePadding(dir, value) {
      const [pl, pt] = this.styleConfig.textFillPadding
      if (dir === 'x') {
        this.updateOuterFrame('textFillPadding', [value, pt, value, pt])
      } else if (dir === 'y') {
        this.updateOuterFrame('textFillPadding', [pl, value, pl, value])
      }
    },

    deleteOuterFrame() {
      this.mindMap.outerFrame.removeActiveOuterFrame()
    },

    deleteOuterFrameText() {
      this.mindMap.outerFrame.removeActiveOuterFrameText()
    },

    hide() {
      if (this.activeSidebar !== 'nodeOuterFrameStyle') {
        return
      }
      this.setActiveSidebar(null)
    }
  }
}
</script>

<style lang="less" scoped>
.nodeOuterFrameContent {
  &.isDark {
    .panelHeader {
      .name {
        color: #fff;
      }
    }
  }

  .panelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 35px;

    &.noTop {
      margin-top: 0;
    }

    .name {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(26, 26, 26, 0.9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 20px;
    }

    .deleteBtn {
      display: flex;
      align-items: center;
      color: #909090;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      overflow: hidden;

      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .iconfont {
        margin-left: 2px;
        font-size: 14px;
      }
    }
  }
}
</style>
