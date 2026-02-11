<template>
  <Sidebar ref="sidebar" :title="$t('baseStyle.associativeLineStyle')">
    <div
      class="associativeLineContent smmCommonSidebarContent"
      :class="{ isDark: isDark }"
    >
      <div class="smmSidebarGroupTitle noTop">
        {{ $t('baseStyle.associativeLine') }}
      </div>
      <div class="row">
        <div class="rowItem mr">
          <span class="name">{{ $t('baseStyle.associativeLineColor') }}</span>
          <span
            class="block"
            v-popover:popover4
            :style="{ backgroundColor: style.associativeLineColor }"
          ></span>
          <el-popover ref="popover4" placement="bottom" trigger="hover">
            <Color
              :color="style.associativeLineColor"
              @change="
                color => {
                  update('associativeLineColor', color)
                }
              "
            ></Color>
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ $t('baseStyle.associativeLineWidth') }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.associativeLineWidth"
            placeholder=""
            @change="
              value => {
                update('associativeLineWidth', value)
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
        </div>
      </div>
      <div class="row">
        <div class="rowItem mr">
          <span class="name">{{
            $t('baseStyle.associativeLineActiveColor')
          }}</span>
          <span
            class="block"
            v-popover:popover5
            :style="{ backgroundColor: style.associativeLineActiveColor }"
          ></span>
          <el-popover ref="popover5" placement="bottom" trigger="hover">
            <Color
              :color="style.associativeLineActiveColor"
              @change="
                color => {
                  update('associativeLineActiveColor', color)
                }
              "
            ></Color>
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{
            $t('baseStyle.associativeLineActiveWidth')
          }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.associativeLineActiveWidth"
            placeholder=""
            @change="
              value => {
                update('associativeLineActiveWidth', value)
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
        </div>
      </div>
      <div class="row">
        <div class="rowItem half pr5">
          <span class="name">{{ $t('style.style') }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.associativeLineDasharray"
            placeholder=""
            @change="
              value => {
                update('associativeLineDasharray', value)
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
                    style.associativeLineDasharray === item.value
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
      <!-- 关联线文字 -->
      <div class="smmSidebarGroupTitle">
        {{ $t('baseStyle.associativeLineText') }}
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ $t('baseStyle.fontFamily') }}</span>
          <el-select
            size="mini"
            style="width: 130px;"
            v-model="style.associativeLineTextFontFamily"
            placeholder=""
            @change="update('associativeLineTextFontFamily', $event)"
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
        <div class="rowItem mr">
          <span class="name">{{ $t('baseStyle.color') }}</span>
          <span
            class="block"
            v-popover:popover6
            :style="{ backgroundColor: style.associativeLineTextColor }"
          ></span>
          <el-popover ref="popover6" placement="bottom" trigger="hover">
            <Color
              :color="style.associativeLineTextColor"
              @change="
                color => {
                  update('associativeLineTextColor', color)
                }
              "
            ></Color>
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ $t('baseStyle.fontSize') }}</span>
          <el-select
            size="mini"
            style="width: 80px"
            v-model="style.associativeLineTextFontSize"
            placeholder=""
            @change="update('associativeLineTextFontSize', $event)"
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
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Color from './Color.vue'
import { lineWidthList, fontSizeList, borderDasharrayList } from '@/config'
import { mapState, mapMutations } from 'vuex'
import fontFamilyMixin from '@/mixins/fontFamily'

const defaultStyle = {
  associativeLineColor: '',
  associativeLineWidth: 0,
  associativeLineActiveWidth: 0,
  associativeLineDasharray: '',
  associativeLineActiveColor: '',
  associativeLineTextFontSize: 0,
  associativeLineTextColor: '',
  associativeLineTextFontFamily: ''
}

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
      activeLineNode: null,
      activeLineToNode: null,
      style: {
        ...defaultStyle
      }
    }
  },
  computed: {
    ...mapState({
      activeSidebar: state => state.activeSidebar,
      isDark: state => state.localConfig.isDark
    }),

    borderDasharrayList() {
      return borderDasharrayList[this.$i18n.locale] || borderDasharrayList.en
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'associativeLineStyle') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    this.mindMap.on('associative_line_click', this.onAssociativeLineClick)
    this.mindMap.on(
      'associative_line_deactivate',
      this.associativeLineDeactivate
    )
  },
  methods: {
    ...mapMutations([
      'setActiveSidebar',
      'appendPrependSidebarList',
      'removePrependSidebarList'
    ]),

    onAssociativeLineClick(a, b, node, toNode) {
      this.activeLineNode = node
      this.activeLineToNode = toNode
      const styleConfig = this.mindMap.associativeLine.getStyleConfig(
        node,
        toNode
      )
      Object.keys(this.style).forEach(item => {
        this.style[item] = styleConfig[item]
      })
      this.appendPrependSidebarList({
        value: 'associativeLineStyle',
        name: '关联线',
        icon: 'iconlianjiexian'
      })
    },

    associativeLineDeactivate() {
      this.removePrependSidebarList('associativeLineStyle')
      if (this.activeSidebar === 'associativeLineStyle') {
        this.setActiveSidebar(null)
      }
      this.activeLineNode = null
      this.activeLineToNode = null
      this.style = {
        ...defaultStyle
      }
    },

    update(prop, value) {
      this.style[prop] = value
      const associativeLineStyle =
        this.activeLineNode.getData('associativeLineStyle') || {}
      const toNodeUid = this.activeLineToNode.getData('uid')
      const lineStyle = associativeLineStyle[toNodeUid] || {}
      this.activeLineNode.setData({
        associativeLineStyle: {
          ...associativeLineStyle,
          [toNodeUid]: {
            ...lineStyle,
            ...this.style
          }
        }
      })
      this.mindMap.associativeLine.updateActiveLineStyle()
    }
  }
}
</script>

<style lang="less" scoped>
.associativeLineContent {
}
</style>
