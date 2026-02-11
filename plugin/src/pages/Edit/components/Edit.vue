<template>
  <div ref="editContainer" class="editContainer" v-loading="loading">
    <div
      class="mindMapContainer"
      id="mindMapContainer"
      ref="mindMapContainer"
      @dragover.prevent
      @dragenter="onDragEnter"
      @drop="onDrop"
    ></div>
    <Navigator v-if="mindMap" :mindMap="mindMap"></Navigator>
    <NavigatorToolbar
      :mindMap="mindMap"
      v-if="!isZenMode && isShowBottomToolbar"
    ></NavigatorToolbar>
    <OutlineSidebar v-if="mindMap" :mindMap="mindMap"></OutlineSidebar>
    <Style v-if="mindMap && !isZenMode" :mindMap="mindMap"></Style>
    <BaseStyle
      v-if="mindMap"
      :data="mindMapData"
      :configData="mindMapConfig"
      :mindMap="mindMap"
    ></BaseStyle>
    <AssociativeLineStyle
      v-if="mindMap"
      :mindMap="mindMap"
    ></AssociativeLineStyle>
    <Theme v-if="mindMap" :data="mindMapData" :mindMap="mindMap"></Theme>
    <Structure v-if="mindMap" :mindMap="mindMap"></Structure>
    <ShortcutKey v-if="mindMap"></ShortcutKey>
    <Contextmenu v-if="mindMap" :mindMap="mindMap"></Contextmenu>
    <RichTextToolbar v-if="mindMap" :mindMap="mindMap"></RichTextToolbar>
    <NodeNoteContentShow
      v-if="mindMap"
      :mindMap="mindMap"
    ></NodeNoteContentShow>
    <NodeImgPreview v-if="mindMap" :mindMap="mindMap"></NodeImgPreview>
    <SidebarTrigger
      v-if="!isZenMode && mindMap"
      :mindMap="mindMap"
    ></SidebarTrigger>
    <Search v-if="mindMap" :mindMap="mindMap"></Search>
    <NodeIconSidebar v-if="mindMap" :mindMap="mindMap"></NodeIconSidebar>
    <NodeIconToolbar v-if="mindMap" :mindMap="mindMap"></NodeIconToolbar>
    <Scrollbar v-if="isShowScrollbar && mindMap" :mindMap="mindMap"></Scrollbar>
    <FormulaSidebar v-if="mindMap" :mindMap="mindMap"></FormulaSidebar>
    <NodeOuterFrame v-if="mindMap" :mindMap="mindMap"></NodeOuterFrame>
    <NodeTagStyle v-if="mindMap" :mindMap="mindMap"></NodeTagStyle>
    <Setting
      v-if="mindMap"
      :configData="mindMapConfig"
      :mindMap="mindMap"
    ></Setting>
    <NodeImgPlacementToolbar
      v-if="mindMap"
      :mindMap="mindMap"
    ></NodeImgPlacementToolbar>
    <NodeNoteSidebar v-if="mindMap" :mindMap="mindMap"></NodeNoteSidebar>
    <NodeTextInputObLink
      v-if="mindMap"
      :mindMap="mindMap"
    ></NodeTextInputObLink>
    <Demonstrate v-if="mindMap" :mindMap="mindMap"></Demonstrate>
    <el-dialog
      class="confirmSplitLineDialog"
      :title="$t('edit.tip')"
      :visible.sync="confirmSplitLineDialogVisible"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialogContent" :class="{ isDark: isDark }">
        <span class="icon el-icon-info"></span>
        <span class="text">{{ $t('edit.splitByWrap') }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          class="elButtonSmall"
          @click="handleSplitLine(1)"
          >{{ $t('edit.notSplit') }}</el-button
        >
        <el-button
          type="success"
          size="small"
          class="elButtonSmall"
          @click="handleSplitLine(2)"
          >{{ $t('edit.keepLevel') }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          class="elButtonSmall"
          @click="handleSplitLine(3)"
          >{{ $t('edit.ignoreLevel') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MindMap from 'simple-mind-map'
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js'
import Watermark from 'simple-mind-map/src/plugins/Watermark.js'
import KeyboardNavigation from 'simple-mind-map/src/plugins/KeyboardNavigation.js'
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
import Export from 'simple-mind-map/src/plugins/Export.js'
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'
import TouchEvent from 'simple-mind-map/src/plugins/TouchEvent.js'
import NodeImgAdjust from 'simple-mind-map/src/plugins/NodeImgAdjust.js'
import SearchPlugin from 'simple-mind-map/src/plugins/Search.js'
import Painter from 'simple-mind-map/src/plugins/Painter.js'
import ScrollbarPlugin from 'simple-mind-map/src/plugins/Scrollbar.js'
import Formula from 'simple-mind-map/src/plugins/Formula.js'
import RainbowLines from 'simple-mind-map/src/plugins/RainbowLines.js'
import DemonstratePlugin from 'simple-mind-map/src/plugins/Demonstrate.js'
import OuterFrame from 'simple-mind-map/src/plugins/OuterFrame.js'
import MindMapLayoutPro from 'simple-mind-map/src/plugins/MindMapLayoutPro.js'
import NodeBase64ImageStorage from 'simple-mind-map/src/plugins/NodeBase64ImageStorage.js'
import Themes from 'simple-mind-map-plugin-themes'
import { isSameObject, getImageSize } from 'simple-mind-map/src/utils/index.js'
import OutlineSidebar from './OutlineSidebar.vue'
import Style from './Style.vue'
import BaseStyle from './BaseStyle.vue'
import Theme from './Theme.vue'
import Structure from './Structure.vue'
import NavigatorToolbar from './NavigatorToolbar.vue'
import ShortcutKey from './ShortcutKey.vue'
import Contextmenu from './Contextmenu.vue'
import RichTextToolbar from './RichTextToolbar.vue'
import NodeNoteContentShow from './NodeNoteContentShow.vue'
import Navigator from './Navigator.vue'
import NodeImgPreview from './NodeImgPreview.vue'
import SidebarTrigger from './SidebarTrigger.vue'
import { mapState } from 'vuex'
import icon from '@/config/icon'
import Search from './Search.vue'
import NodeIconSidebar from './NodeIconSidebar.vue'
import NodeIconToolbar from './NodeIconToolbar.vue'
import handleClipboardText from '@/utils/handleClipboardText'
import Scrollbar from './Scrollbar.vue'
import FormulaSidebar from './FormulaSidebar.vue'
import NodeOuterFrame from './NodeOuterFrame.vue'
import NodeTagStyle from './NodeTagStyle.vue'
import Setting from './Setting.vue'
import AssociativeLineStyle from './AssociativeLineStyle.vue'
import NodeImgPlacementToolbar from './NodeImgPlacementToolbar.vue'
import NodeNoteSidebar from './NodeNoteSidebar.vue'
import {
  isHyperlink,
  isObLinkText,
  isNormalUrl,
  getFilenameWithExtension,
  checkMindTreeHasImg,
  parseInnerLinkAndText,
  isImgFile
} from '@/utils'
import NodeTextInputObLink from './NodeTextInputObLink.vue'
import Demonstrate from './Demonstrate.vue'
import { imgFail, obFileHyperlinkIcon, hyperlinkIcon } from '@/config/icons'
import imgHostingUpload from '@/mixins/imgHostingUpload'

MindMap.usePlugin(MiniMap)
  .usePlugin(Watermark)
  .usePlugin(Drag)
  .usePlugin(KeyboardNavigation)
  .usePlugin(ExportPDF)
  .usePlugin(ExportXMind)
  .usePlugin(Export)
  .usePlugin(Select)
  .usePlugin(AssociativeLine)
  .usePlugin(NodeImgAdjust)
  .usePlugin(TouchEvent)
  .usePlugin(SearchPlugin)
  .usePlugin(Painter)
  .usePlugin(Formula)
  .usePlugin(RainbowLines)
  .usePlugin(DemonstratePlugin)
  .usePlugin(OuterFrame)
  .usePlugin(MindMapLayoutPro)
  .usePlugin(NodeBase64ImageStorage)
  .usePlugin(RichText)

Themes.init(MindMap)

export default {
  mixins: [imgHostingUpload],
  components: {
    OutlineSidebar,
    Style,
    BaseStyle,
    Theme,
    Structure,
    NavigatorToolbar,
    ShortcutKey,
    Contextmenu,
    RichTextToolbar,
    NodeNoteContentShow,
    Navigator,
    NodeImgPreview,
    SidebarTrigger,
    Search,
    NodeIconSidebar,
    NodeIconToolbar,
    Scrollbar,
    FormulaSidebar,
    NodeOuterFrame,
    NodeTagStyle,
    Setting,
    AssociativeLineStyle,
    NodeImgPlacementToolbar,
    NodeNoteSidebar,
    NodeTextInputObLink,
    Demonstrate
  },
  data() {
    return {
      enableShowLoading: true,
      tmpMindMap: null,
      mindMap: null,
      mindMapData: null,
      mindMapConfig: {},
      loading: false,
      isFirst: true,
      autoSaveTimer: null,
      isSaving: false,
      savingTimer: null,
      storeConfigTimer: null,
      isNotTriggerDataChange: false,
      dragEnterNode: null,
      confirmSplitLineDialogVisible: false,
      confirmSplitLineTaskResolve: null,
      confirmSplitLineTaskReject: null
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      isShowScrollbar: state => state.localConfig.isShowScrollbar,
      useLeftKeySelectionRightKeyDrag: state =>
        state.localConfig.useLeftKeySelectionRightKeyDrag,
      extraTextOnExport: state => state.extraTextOnExport,
      autoSaveTime: state => state.localConfig.autoSaveTime,
      isShowBottomToolbar: state => state.localConfig.isShowBottomToolbar,
      isReadonly: state => state.isReadonly,
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    isShowScrollbar() {
      if (this.isShowScrollbar) {
        this.addScrollbarPlugin()
      } else {
        this.removeScrollbarPlugin()
      }
    }
  },
  mounted() {
    this.showLoading()
    this.getData()
    this.init()
    this.$root.$bus.$on('execCommand', this.execCommand)
    this.$root.$bus.$on('paddingChange', this.onPaddingChange)
    this.$root.$bus.$on('export', this.export)
    this.$root.$bus.$on('setData', this.setData)
    this.$root.$bus.$on('startTextEdit', this.handleStartTextEdit)
    this.$root.$bus.$on('endTextEdit', this.handleEndTextEdit)
    this.$root.$bus.$on(
      'createAssociativeLine',
      this.handleCreateLineFromActiveNode
    )
    this.$root.$bus.$on('startPainter', this.handleStartPainter)
    this.$root.$bus.$on('node_tree_render_end', this.handleHideLoading)
    this.$root.$bus.$on('showLoading', this.handleShowLoading)
    this.$root.$bus.$on('hideLoading', this.hideLoading)
    this.$root.$bus.$on('windowResize', this.handleResize)
    this.$root.$bus.$on('saveToLocal', this.manuallySave)
    this.$root.$bus.$on('storeData', this.updateMindMapData)
    this.$root.$bus.$on(
      'updateMindMapDataFromOb',
      this.onUpdateMindMapDataFromOb
    )
    this.$root.$bus.$on('clearAutoSave', this.clearAutoSave)
    this.$root.$bus.$on('getMindMapCurrentData', this.emitMindMapCurrentData)
    this.$root.$bus.$on('obTabDeactivate', this.onObTabDeactivate)
    this.$root.$bus.$on('toggleReadonly', this.onToggleReadonly)
    this.$root.$bus.$on('jumpToNodeByUid', this.jumpToNodeByUid)
  },
  beforeDestroy() {
    this.$root.$bus.$off('execCommand', this.execCommand)
    this.$root.$bus.$off('paddingChange', this.onPaddingChange)
    this.$root.$bus.$off('export', this.export)
    this.$root.$bus.$off('setData', this.setData)
    this.$root.$bus.$off('startTextEdit', this.handleStartTextEdit)
    this.$root.$bus.$off('endTextEdit', this.handleEndTextEdit)
    this.$root.$bus.$off(
      'createAssociativeLine',
      this.handleCreateLineFromActiveNode
    )
    this.$root.$bus.$off('startPainter', this.handleStartPainter)
    this.$root.$bus.$off('node_tree_render_end', this.handleHideLoading)
    this.$root.$bus.$off('showLoading', this.handleShowLoading)
    this.$root.$bus.$off('hideLoading', this.hideLoading)
    this.$root.$bus.$off('windowResize', this.handleResize)
    this.$root.$bus.$off('saveToLocal', this.manuallySave)
    this.$root.$bus.$off('storeData', this.updateMindMapData)
    this.$root.$bus.$off(
      'updateMindMapDataFromOb',
      this.onUpdateMindMapDataFromOb
    )
    this.$root.$bus.$off('clearAutoSave', this.clearAutoSave)
    this.$root.$bus.$off('getMindMapCurrentData', this.emitMindMapCurrentData)
    this.$root.$bus.$off('obTabDeactivate', this.onObTabDeactivate)
    this.$root.$bus.$off('toggleReadonly', this.onToggleReadonly)
    this.$root.$bus.$off('jumpToNodeByUid', this.jumpToNodeByUid)
    clearTimeout(this.autoSaveTimer)
    clearTimeout(this.savingTimer)
    this.mindMap.destroy()
  },
  methods: {
    onToggleReadonly(isReadonly) {
      if (this.mindMap) {
        this.mindMap.setMode(isReadonly ? 'readonly' : 'edit')
      }
    },

    showLoading() {
      this.loading = true
    },

    hideLoading() {
      this.loading = false
    },

    handleStartTextEdit() {
      this.mindMap.renderer.startTextEdit()
    },

    handleEndTextEdit() {
      this.mindMap.renderer.endTextEdit()
    },

    handleCreateLineFromActiveNode() {
      this.mindMap.associativeLine.createLineFromActiveNode()
      this.$root.$obsidianAPI.showTip(this.$t('edit.createAssociativeLineTip'))
    },

    handleStartPainter() {
      this.mindMap.painter.startPainter()
      this.$root.$obsidianAPI.showTip(this.$t('edit.painterTip'))
    },

    handleResize() {
      if (!this.mindMap) return
      this.mindMap.resize()
    },

    handleShowLoading() {
      this.enableShowLoading = true
      this.showLoading()
    },

    handleHideLoading() {
      if (this.enableShowLoading) {
        this.enableShowLoading = false
        this.hideLoading()
      }
    },

    getData() {
      this.mindMapData = JSON.parse(
        this.$root.$obsidianAPI.getInitMindMapData()
      )
      this.mindMapConfig = this.$root.$obsidianAPI.getMindMapConfig() || {}
    },

    init() {
      let { root, layout, theme, view } = this.mindMapData
      const config = this.mindMapConfig
      this.tmpMindMap = new MindMap({
        el: this.$refs.mindMapContainer,
        touchEventBindEl: this.$refs.mindMapContainer,
        data: root,
        fit: false,
        layout: layout,
        theme: theme.template,
        themeConfig: theme.config,
        viewData: view,
        nodeTextEditZIndex: 1000,
        nodeNoteTooltipZIndex: 1000,
        customNoteContentShow: {
          show: (...args) => {
            this.$root.$bus.$emit('showNoteContent', ...args)
          },
          hide: () => {}
        },
        openRealtimeRenderOnNodeTextEdit: false,
        enableAutoEnterTextEditWhenKeydown: true,
        demonstrateConfig: {
          openBlankMode: false
        },
        ...(config || {}),
        iconList: [...icon],
        useLeftKeySelectionRightKeyDrag: this.useLeftKeySelectionRightKeyDrag,
        customInnerElsAppendTo: this.$refs.editContainer,
        handleElPositionOnCustomInnerElsAppendTo: (left, top) => {
          return {
            left: left - this.mindMap.elRect.left,
            top: top - this.mindMap.elRect.top
          }
        },
        textEidtNoOverCanvas: true,
        customHandleClipboardText: handleClipboardText,
        defaultNodeImage: imgFail,
        initRootNodePosition: ['center', 'center'],
        defaultInsertSecondLevelNodeText: this.$t(
          'edit.defaultInsertSecondLevelNodeText'
        ),
        defaultInsertBelowSecondLevelNodeText: this.$t(
          'edit.defaultInsertBelowSecondLevelNodeText'
        ),
        defaultGeneralizationText: this.$t('edit.defaultGeneralizationText'),
        defaultAssociativeLineText: this.$t('edit.defaultAssociativeLineText'),
        defaultOuterFrameText: this.$t('edit.defaultOuterFrameText'),
        handleIsSplitByWrapOnPasteCreateNewNode: () => {
          return new Promise((resolve, reject) => {
            this.confirmSplitLineTaskResolve = resolve
            this.confirmSplitLineTaskReject = reject
            this.confirmSplitLineDialogVisible = true
          })
        },
        errorHandler: (code, err) => {
          switch (code) {
            case 'export_error':
              this.$root.$obsidianAPI.showTip(this.$t('edit.exportError'))
              break
            default:
              break
          }
        },
        addContentToFooter: () => {
          const text = this.extraTextOnExport.trim()
          if (!text) return null
          const el = document.createElement('div')
          el.className = 'footer'
          el.innerHTML = text
          const cssText = `
            .footer {
              width: 100%;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              color: #979797;
            }
          `
          return {
            el,
            cssText,
            height: 30
          }
        },
        expandBtnNumHandler: num => {
          return num >= 100 ? '…' : num
        },
        beforeDeleteNodeImg: node => {
          return new Promise(resolve => {
            this.$confirm(
              this.$t('edit.deleteNodeImgTip'),
              this.$t('edit.tip'),
              {
                confirmButtonText: this.$t('edit.yes'),
                cancelButtonText: this.$t('edit.no'),
                type: 'warning',
                customClass: 'smmCustomElConfirm'
              }
            )
              .then(() => {
                resolve(false)
              })
              .catch(() => {
                resolve(true)
              })
          })
        },
        customHyperlinkJump: (link, node, e) => {
          const linkTitle = node.getData('hyperlinkTitle') || ''
          if (link) {
            if (!isHyperlink(link) && isObLinkText(linkTitle)) {
              const {
                embedLinkNewWindowOpen
              } = this.$root.$obsidianAPI.getSettings()
              const isNewTab = embedLinkNewWindowOpen || e.ctrlKey || e.metaKey
              this.$root.$obsidianAPI.openFile(link, isNewTab)
            } else {
              this.$root.$obsidianAPI.openWebLink(link)
            }
          }
        },
        transformImageUrl: url => {
          if (isNormalUrl(url)) {
            return url
          }
          return this.$root.$obsidianAPI.getResourcePath(url)
        },
        enableQuillFormatList: ['link'],
        customExtendQuill: Quill => {
          const Inline = Quill.import('blots/inline')
          class CustomLinkBlot extends Inline {
            static create(url) {
              const node = super.create()
              node.setAttribute('href', url)
              node.setAttribute('data-href', url)
              return node
            }
            static formats(node) {
              return node.getAttribute('href')
            }
          }
          CustomLinkBlot.blotName = 'link'
          CustomLinkBlot.tagName = 'a'
          Quill.register('formats/link', CustomLinkBlot)
        },
        handleNodePasteImg: async imgFile => {
          try {
            this.handleShowLoading()
            const {
              nodePasteImageNameFormat,
              useImgHosting
            } = this.$root.$obsidianAPI.getSettings()
            const file = new File(
              [imgFile],
              getFilenameWithExtension(
                this.$root.$obsidianAPI.getFormatFileName(
                  nodePasteImageNameFormat
                ) || this.$t('edit.pasteImage'),
                imgFile.type
              ),
              {
                type: imgFile.type
              }
            )
            let url = ''
            let viewUrl = ''
            if (useImgHosting) {
              url = await this.uploadImgToHosting(file)
              viewUrl = url
            } else {
              url = await this.$root.$obsidianAPI.saveFileToVault(file)
              viewUrl = this.$root.$obsidianAPI.getResourcePath(url)
            }
            const size = await getImageSize(viewUrl)
            this.handleHideLoading()
            return {
              url,
              size
            }
          } catch (error) {
            this.handleHideLoading()
            this.$root.$obsidianAPI.showTip('上传失败')
          }
        },
        dynamicGetHyperlinkIcon: (node, link, linkTitle) => {
          if (!isHyperlink(link) && isObLinkText(linkTitle)) {
            return {
              icon: obFileHyperlinkIcon,
              style: {}
            }
          } else {
            return {
              icon: hyperlinkIcon,
              style: {}
            }
          }
        }
      })
      this.afterInitMindMap(this.tmpMindMap)
    },

    afterInitMindMap(mindMap) {
      mindMap.on('node_tree_render_end', this.onFirstNodeTreeRenderEnd)

      this.loadPlugins(mindMap)
      ;[
        'node_active',
        'data_change',
        'view_data_change',
        'back_forward',
        'node_contextmenu',
        'node_click',
        'draw_click',
        'expand_btn_click',
        'svg_mousedown',
        'mouseup',
        'mode_change',
        'node_tree_render_end',
        'rich_text_selection_change',
        'transforming-dom-to-images',
        'generalization_node_contextmenu',
        'painter_start',
        'painter_end',
        'scrollbar_change',
        'scale',
        'translate',
        'node_attachmentClick',
        'node_attachmentContextmenu',
        'demonstrate_jump',
        'exit_demonstrate',
        'node_note_dblclick',
        'node_mousedown',
        'node_img_dblclick'
      ].forEach(event => {
        mindMap.on(event, (...args) => {
          this.$root.$bus.$emit(event, ...args)
        })
      })
      this.bindSaveEvent()
    },

    onObTabDeactivate() {
      if (!this.mindMap) return
      this.mindMap.renderer.textEdit.hideEditTextBox()
      if (this.mindMap.associativeLine) {
        this.mindMap.associativeLine.hideEditTextBox()
      }
      if (this.mindMap.outerFrame) {
        this.mindMap.outerFrame.hideEditTextBox()
      }
      this.mindMap.emit('svg_mousedown')
      this.mindMap.emit('draw_click')
    },

    onFirstNodeTreeRenderEnd() {
      this.mindMap = this.tmpMindMap
      this.tmpMindMap = null
      this.$root.$getCurrentMindMap = () => this.mindMap
      let nodeId = this.$root.$obsidianAPI.getInitLocationNodeId()
      if (nodeId) {
        nodeId = nodeId
          .replace(/^#\^/, '')
          .replace(/^#/, '')
          .replace(/^\^/, '')
        this.mindMap.execCommand('GO_TARGET_NODE', nodeId)
      }
      this.mindMap.off('node_tree_render_end', this.onFirstNodeTreeRenderEnd)
      this.hideLoading()
      this.$emit('loadend')
    },

    jumpToNodeByUid(uid) {
      if (!this.mindMap) {
        return
      }
      this.mindMap.execCommand('GO_TARGET_NODE', uid)
    },

    handleSplitLine(type) {
      if (type === 1) {
        this.confirmSplitLineTaskReject()
      } else {
        this.confirmSplitLineTaskResolve(type === 2 ? 'tree' : 'array')
      }
      this.confirmSplitLineDialogVisible = false
    },

    loadPlugins(mindMap) {
      if (this.isShowScrollbar) this.addScrollbarPlugin(mindMap)
    },

    setData(data) {
      this.handleShowLoading()
      if (data.root) {
        this.mindMapData = data
        this.mindMap.setFullData(data)
      } else {
        this.updateMindMapData(
          {
            root: data
          },
          false
        )
        this.mindMap.setData(data)
      }
      this.mindMap.view.reset()
      this.saveToLocal()
    },

    onUpdateMindMapDataFromOb(data, ignoreLayoutAndTheme = false) {
      try {
        this.isNotTriggerDataChange = true
        data = JSON.parse(data)
        this.mindMap.updateData(data.root)
        if (ignoreLayoutAndTheme) {
          this.updateMindMapData(
            {
              root: data.root
            },
            false
          )
        } else {
          if (data.layout !== this.mindMap.getLayout()) {
            this.mindMap.setLayout(data.layout)
          }
          if (data.theme) {
            if (
              data.theme.template &&
              data.theme.template !== this.mindMap.getTheme()
            ) {
              this.mindMap.setTheme(data.theme.template)
            }
            if (
              data.theme.config &&
              !isSameObject(
                data.theme.config,
                this.mindMap.getCustomThemeConfig()
              )
            ) {
              this.mindMap.setThemeConfig(data.theme.config)
            }
          }
          this.updateMindMapData(data, false)
        }
      } catch (error) {}
    },

    updateMindMapData(data, isSaveToLocal = true) {
      this.mindMapData = {
        ...this.mindMapData,
        ...data
      }
      if (isSaveToLocal) {
        this.saveToLocal()
      }
    },

    bindSaveEvent() {
      this.$root.$bus.$on('data_change', data => {
        if (this.isNotTriggerDataChange) {
          this.isNotTriggerDataChange = false
          return
        }
        if (!this.isFirst) {
          this.autoSave()
        } else {
          this.isFirst = false
        }
        this.updateMindMapData({ root: data }, false)
      })
      this.$root.$bus.$on('view_data_change', data => {
        clearTimeout(this.storeConfigTimer)
        this.storeConfigTimer = setTimeout(() => {
          this.updateMindMapData({ view: data }, false)
        }, 300)
      })
    },

    autoSave() {
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = setTimeout(() => {
        this.saveToLocal()
      }, this.autoSaveTime * 1000)
    },

    clearAutoSave() {
      clearTimeout(this.autoSaveTimer)
    },

    manuallySave(...args) {
      clearTimeout(this.autoSaveTimer)
      this.saveToLocal(...args)
    },

    // 保存到本地文件
    async saveToLocal(isShowTip = false, getSvg = false) {
      if (this.isSaving) {
        this.$root.$obsidianAPI.showTip(this.$t('edit.savingTip'))
        return
      }
      clearTimeout(this.savingTimer)
      this.savingTimer = setTimeout(async () => {
        try {
          this.isSaving = true
          const data = this.mindMap.getData(true)
          if (!data.root) {
            this.$root.$obsidianAPI.showTip(this.$t('edit.savingTip2'))
            this.isSaving = false
            return
          }
          const {
            compressImageIsTransparent,
            saveCanvasViewData,
            embedImageIsSeparateFile
          } = this.$root.$obsidianAPI.getSettings()
          if (!saveCanvasViewData) {
            data.view = null
          }
          let svgData = ''
          if (getSvg) {
            const hasImg = checkMindTreeHasImg(data.root)
            svgData = await this.mindMap.export(
              embedImageIsSeparateFile ? 'svg' : hasImg ? 'png' : 'svg',
              false,
              '',
              compressImageIsTransparent
            )
          }
          await this.$root.$obsidianAPI.saveMindMapData('', svgData)
          if (isShowTip) {
            this.$root.$obsidianAPI.showTip(this.$t('edit.savingTip3'))
          }
          this.isSaving = false
        } catch (error) {
          this.$root.$obsidianAPI.showTip(error || this.$t('edit.savingTip4'))
          this.isSaving = false
        }
      }, 200)
    },

    // 发送最新数据给ob保存
    emitMindMapCurrentData() {
      try {
        if (!this.mindMap) return
        const data = this.mindMap.getData(true)
        if (!data || !data.root) {
          this.$root.$obsidianAPI.showTip(this.$t('edit.savingTip2'))
          return
        }
        const { saveCanvasViewData } = this.$root.$obsidianAPI.getSettings()
        if (!saveCanvasViewData) {
          data.view = null
        }
        const { linkData, textData } = parseInnerLinkAndText(
          data,
          this.$root.$obsidianAPI
        )
        this.$root.$obsidianAPI.getMindMapCurrentData(
          JSON.stringify(data),
          linkData,
          textData
        )
      } catch (error) {}
    },

    reRender() {
      this.mindMap.reRender()
    },

    execCommand(...args) {
      this.mindMap.execCommand(...args)
    },

    async export(...args) {
      try {
        this.showLoading()
        await this.mindMap.export(...args)
        this.hideLoading()
      } catch (error) {
        this.hideLoading()
      }
    },

    onPaddingChange(data) {
      this.mindMap.updateConfig(data)
    },

    addScrollbarPlugin(mindMap) {
      mindMap = mindMap || this.mindMap
      if (!mindMap) return
      mindMap.addPlugin(ScrollbarPlugin)
    },

    removeScrollbarPlugin() {
      this.mindMap.removePlugin(ScrollbarPlugin)
    },

    onDragEnter(e) {
      if (this.isReadonly) return
      e.preventDefault()
      const node = this.getDragEnterNode(e)
      if (node) {
        if (this.dragEnterNode && this.dragEnterNode.uid === node.uid) {
        } else {
          if (this.dragEnterNode) {
            if (this.dragEnterNode.getData('isActive')) {
              this.mindMap.renderer.removeNodeFromActiveList(this.dragEnterNode)
            }
          }
          this.mindMap.renderer.addNodeToActiveList(node)
          this.dragEnterNode = node
          this.mindMap.renderer.emitNodeActiveEvent()
        }
      } else {
        if (this.dragEnterNode) {
          this.mindMap.renderer.removeNodeFromActiveList(this.dragEnterNode)
          this.mindMap.renderer.emitNodeActiveEvent()
          this.dragEnterNode = null
        }
      }
    },

    getDragEnterNode(e) {
      let res = null
      const { x, y } = this.mindMap.toPos(e.clientX, e.clientY)
      const {
        scaleX,
        scaleY,
        translateX,
        translateY
      } = this.mindMap.draw.transform()
      const check = node => {
        let { left, top, width, height } = node
        let right = (left + width) * scaleX + translateX
        let bottom = (top + height) * scaleY + translateY
        left = left * scaleX + translateX
        top = top * scaleY + translateY
        return x > left && x < right && y > top && y < bottom
      }
      const walk = node => {
        if (check(node)) {
          res = node
          return
        }
        if (node._generalizationList && node._generalizationList.length > 0) {
          let exist = false
          node._generalizationList.forEach(item => {
            if (check(item.generalizationNode)) {
              res = item.generalizationNode
              exist = true
            }
          })
          if (exist) {
            return
          }
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach(item => {
            walk(item)
          })
        }
      }
      const treeList = this.mindMap.renderer.getAllRenderRoot()
      if (treeList.length) {
        treeList.forEach(item => {
          walk(item)
        })
      }
      return res
    },

    onDrop(e) {
      if (this.isReadonly) return
      e.preventDefault()
      if (!this.dragEnterNode) return
      const textData = e.dataTransfer?.getData('text/plain')
      const files = e.dataTransfer?.files
      if (textData || files.length > 0) {
        this.insertDragDataToNode({ textData, files, node: this.dragEnterNode })
      }
      this.dragEnterNode = null
    },

    async insertDragDataToNode({ textData, files, node }) {
      try {
        this.handleShowLoading()
        const { useImgHosting } = this.$root.$obsidianAPI.getSettings()
        let err = ''
        let fileUrl = ''
        if (textData) {
          const tFile = this.$root.$obsidianAPI.getFileFromUri(textData)
          if (tFile) {
            fileUrl = tFile.path
          }
        }
        if (!fileUrl && files.length > 0) {
          const file = files[0]
          const isImg = isImgFile(file.name)
          let result = ''
          if (useImgHosting && isImg) {
            result = await this.uploadImgToHosting(file)
          } else {
            result = await this.$root.$obsidianAPI.saveFileToVault(file, isImg)
          }
          if (result) {
            fileUrl = result
          } else {
            err = this.$t('nodeHyperlink.tip4')
          }
        }
        if (!fileUrl) {
          this.handleHideLoading()
          this.$root.$obsidianAPI.showTip(err || this.$t('nodeHyperlink.tip5'))
          return
        }
        if (isImgFile(fileUrl)) {
          const viewUrl = useImgHosting
            ? fileUrl
            : this.$root.$obsidianAPI.getResourcePath(fileUrl)
          const { width, height } = await getImageSize(viewUrl)
          node.setImage({
            url: fileUrl,
            title: '',
            width,
            height
          })
        } else {
          const result = this.$root.$obsidianAPI.createLinkInfoFromFilePath(
            fileUrl
          )
          if (!result) {
            this.$root.$obsidianAPI.showTip(this.$t('nodeHyperlink.tip2'))
            return
          }
          node.setHyperlink(result.link, result.linkText || '')
        }
        this.handleHideLoading()
      } catch (error) {
        console.log(error)
        this.handleHideLoading()
        this.$root.$obsidianAPI.showTip('上传失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;

  .mindMapContainer {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}

.confirmSplitLineDialog {
  /deep/ .el-dialog__body {
    padding: 10px 15px;
  }

  .dialogContent {
    display: flex;

    &.isDark {
      .text {
        color: #fff;
      }
    }

    .icon {
      color: #e6a23c;
      font-size: 24px;
      margin-right: 12px;
    }

    .text {
      line-height: 24px;
    }
  }
}
</style>
