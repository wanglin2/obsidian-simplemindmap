<template>
  <div class="smmOutlineEditContainer" :class="{ isDark: isDark }">
    <div
      class="mobileActions"
      v-if="isMobile"
      :class="{ disabled: !currentData }"
    >
      <span class="iconBtn iconfont iconjiedian" @click="insertNode"></span>
      <span
        class="iconBtn iconfont icontianjiazijiedian"
        @click="insertChildNode"
      ></span>
      <span class="iconBtn iconfont iconshangyi" @click="upLevel"></span>
      <span class="iconBtn iconfont iconshanchu" @click="deleteNode"></span>
    </div>
    <div class="tip" v-else>
      <span class="tipItem">{{ $t('outline.tip1') }}Enter</span>
      <span class="tipItem">{{ $t('outline.tip2') }}Tab</span>
      <span class="tipItem">{{ $t('outline.tip3') }}Shift + Tab</span>
      <span class="tipItem">{{ $t('outline.tip4') }}Delete</span>
      <span class="tipItem">{{ $t('outline.tip5') }}</span>
    </div>
    <div class="smmOutlineEditBox" ref="smmOutlineEditBox">
      <div class="smmOutlineEditInner">
        <el-tree
          ref="tree"
          class="smmOutlineTree"
          node-key="uid"
          :draggable="!isReadonly"
          default-expand-all
          :class="{ isDark: isDark }"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :expand-on-click-node="false"
          :allow-drag="checkAllowDrag"
          @node-drop="onNodeDrop"
          @current-change="onCurrentChange"
        >
          <span
            class="smmOutlineTreeCustomNode"
            slot-scope="{ node, data }"
            :data-id="data.uid"
          >
            <span
              class="smmOutlineTreeCustomNodeEdit"
              :contenteditable="!isReadonly"
              :key="getKey()"
              @blur="onBlur($event, node)"
              @keydown.stop="onNodeInputKeydown($event, node)"
              @keyup.stop
              @paste="onPaste($event, node)"
              v-html="node.label"
            ></span>
          </span>
        </el-tree>
      </div>
    </div>
    <Import></Import>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap,
  createUid,
  simpleDeepClone,
  htmlEscape,
  handleInputPasteText
} from 'simple-mind-map/src/utils'
import {
  printOutline,
  linkRichToObUrlText,
  obUrlToLinkRich,
  parseInnerLinkAndText
} from '@/utils'
import Import from './Import.vue'
import CursorTextHandler from '@/utils/CursorTextHandler'

export default {
  components: {
    Import
  },
  data() {
    return {
      mindMapData: null,
      treeData: [],
      defaultProps: {
        label: 'label'
      },
      currentData: null,
      currentNode: null,
      autoSaveTimer: null
    }
  },
  computed: {
    ...mapState({
      isReadonly: state => state.isReadonly,
      isDark: state => state.localConfig.isDark,
      autoSaveTime: state => state.localConfig.autoSaveTime,
      isMobile: state => state.isMobile
    })
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown)
    this.$root.$bus.$on('getMindMapCurrentData', this.emitMindMapCurrentData)
    this.$root.$bus.$on(
      'updateMindMapDataFromOb',
      this.onUpdateMindMapDataFromOb
    )
    this.$root.$bus.$on('setData', this.onImportData)
    this.$root.$bus.$on('saveToLocal', this.manuallySave)
    this.$root.$bus.$on('clearAutoSave', this.clearAutoSave)
    this.$root.$bus.$on('printOutline', this.onPrint)
    this.getData()
  },
  beforeDestroy() {
    clearTimeout(this.autoSaveTimer)
    window.removeEventListener('keydown', this.onKeyDown)
    this.$root.$bus.$off('getMindMapCurrentData', this.emitMindMapCurrentData)
    this.$root.$bus.$off(
      'updateMindMapDataFromOb',
      this.onUpdateMindMapDataFromOb
    )
    this.$root.$bus.$off('setData', this.onImportData)
    this.$root.$bus.$off('saveToLocal', this.manuallySave)
    this.$root.$bus.$off('clearAutoSave', this.clearAutoSave)
    this.$root.$bus.$off('printOutline', this.onPrint)
  },
  methods: {
    getData() {
      this.mindMapData = JSON.parse(
        this.$root.$obsidianAPI.getInitMindMapData()
      )
      const rootData = this.mindMapData.root
      this.mindMapDataToTree(rootData)
    },

    mindMapDataToTree(rootData, callback = () => {}) {
      this.currentData = null
      this.currentNode = null
      this.treeData = []
      this.$nextTick(() => {
        rootData.root = true
        let walk = root => {
          let text = root.data.richText
            ? nodeRichTextToTextWithWrap(linkRichToObUrlText(root.data.text))
            : root.data.text
          text = htmlEscape(text)
          text = text.replace(/\n/g, '<br>')
          root.textCache = text
          root.label = text
          root.uid = root.data.uid
          if (root.children && root.children.length > 0) {
            root.children.forEach(item => {
              walk(item)
            })
          }
        }
        walk(rootData)
        const freeNodeTrees = rootData.data.freeNodeTrees || []
        delete rootData.data.freeNodeTrees
        if (freeNodeTrees && freeNodeTrees.length > 0) {
          freeNodeTrees.forEach(item => {
            item.root = true
            walk(item)
          })
        }
        this.treeData = [rootData, ...freeNodeTrees]
        callback()
      })
    },

    checkAllowDrag(node) {
      return !node.data.root
    },

    onNodeDrop() {
      this.autoSave()
    },

    onCurrentChange(data, node) {
      this.currentData = data
      this.currentNode = node
    },

    onBlur(e, node) {
      if (node.data.textCache === e.target.innerHTML) {
        return
      }
      const richText = node.data.data.richText
      let text = richText ? e.target.innerHTML : e.target.innerText
      if (richText) {
        let text2 = textToNodeRichTextWithWrap(text)
        text2 = obUrlToLinkRich(text2)
        node.data.data.text = text2
      }
      node.data.label = text
      node.data.textCache = e.target.innerHTML
      this.autoSave()
    },

    onNodeInputKeydown(e, node) {
      const richText = !!node.data.data.richText
      const uid = createUid()
      const data = {
        uid,
        textCache: '',
        label: '',
        data: {
          text: '',
          uid,
          richText
        },
        children: []
      }
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        if (e.ctrlKey) {
          const cursorTextHandler = new CursorTextHandler(e.target)
          const afterText = cursorTextHandler.getTextAfterCursor()
          if (!afterText) {
            return
          }
          const beforeText = cursorTextHandler.getTextBeforeCursor()
          e.target.innerHTML = beforeText
          data.label = afterText
          data.textCache = afterText
          data.data.text = richText
            ? textToNodeRichTextWithWrap(afterText)
            : afterText
          this.$refs.tree.insertAfter(data, node)
        } else {
          const text = this.$t('outline.nodeDefaultText')
          data.label = text
          data.textCache = text
          data.data.text = richText ? textToNodeRichTextWithWrap(text) : text
          if (node.data.root) {
            this.$refs.tree.append(data, node)
          } else {
            this.$refs.tree.insertAfter(data, node)
          }
        }
      }
      if (e.keyCode === 9) {
        e.preventDefault()
        if (node.data.root) {
          return
        }
        if (e.shiftKey) {
          this.onBlur(e, node)
          this.$refs.tree.insertAfter(node.data, node.parent)
        } else {
          const index = node.parent.childNodes.findIndex(item => {
            return item === node
          })
          if (index <= 0) return
          const prevNode = node.parent.childNodes[index - 1]
          if (prevNode) {
            this.$refs.tree.append(node.data, prevNode)
          }
        }
        this.$refs.tree.remove(node)
      }
      this.autoSave()
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(uid)
        const el = document.querySelector(
          `.smmOutlineTreeCustomNode[data-id="${uid}"] .smmOutlineTreeCustomNodeEdit`
        )
        if (el) {
          let selection = window.getSelection()
          let range = document.createRange()
          range.selectNodeContents(el)
          selection.removeAllRanges()
          selection.addRange(range)
          let offsetTop = el.offsetTop
          this.scrollTo(offsetTop)
        }
      })
    },

    onKeyDown(e) {
      if ([46, 8].includes(e.keyCode) && this.currentData) {
        e.stopPropagation()
        this.$refs.tree.remove(this.currentData)
        this.currentData = null
        this.currentNode = null
        this.autoSave()
      }
    },

    onPaste(e) {
      handleInputPasteText(e)
    },

    getKey() {
      return Math.random()
    },

    onPrint() {
      printOutline(this.$refs.smmOutlineEditBox)
    },

    scrollTo(y) {
      let container = this.$refs.smmOutlineEditBox
      let height = container.offsetHeight
      let top = container.scrollTop
      y += 50
      if (y > top + height) {
        container.scrollTo(0, y - height / 2)
      }
    },

    onImportData(data) {
      let rootNodeData = null
      if (data.root) {
        rootNodeData = data.root
      } else {
        rootNodeData = data
      }
      this.mindMapDataToTree(rootNodeData, () => {
        this.saveToLocal()
      })
    },

    getCurrentData() {
      let newNode = {}
      let node = this.treeData[0]
      let walk = (root, newRoot) => {
        newRoot.data = root.data
        newRoot.children = []
        ;(root.children || []).forEach(child => {
          const newChild = {}
          newRoot.children.push(newChild)
          walk(child, newChild)
        })
      }
      walk(node, newNode)
      const freeNodeTrees = []
      if (this.treeData.length > 1) {
        this.treeData.slice(1).forEach(item => {
          const newNode = {}
          freeNodeTrees.push(newNode)
          walk(item, newNode)
        })
        newNode.data.freeNodeTrees = freeNodeTrees
      }
      return simpleDeepClone(newNode)
    },

    emitMindMapCurrentData() {
      try {
        const curData = {
          ...this.mindMapData,
          root: this.getCurrentData()
        }
        const { linkData, textData } = parseInnerLinkAndText(
          curData,
          this.$root.$obsidianAPI
        )
        this.$root.$obsidianAPI.getMindMapCurrentData(
          JSON.stringify(curData),
          linkData,
          textData
        )
      } catch (error) {
      }
    },

    autoSave() {
      this.$root.$bus.$emit('data_change')
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = setTimeout(() => {
        this.saveToLocal()
      }, this.autoSaveTime * 1000)
    },

    clearAutoSave() {
      clearTimeout(this.autoSaveTimer)
    },

    manuallySave() {
      clearTimeout(this.autoSaveTimer)
      this.saveToLocal()
    },

    saveToLocal() {
      this.$root.$obsidianAPI.saveMindMapData()
    },

    onUpdateMindMapDataFromOb(data) {
      try {
        data = JSON.parse(data)
        this.mindMapDataToTree(data.root)
      } catch (e) {
      }
    },

    insertNode() {
      this.onNodeInputKeydown(
        {
          keyCode: 13,
          preventDefault: () => {}
        },
        this.currentNode
      )
    },

    insertChildNode() {
      this.onNodeInputKeydown(
        {
          keyCode: 9,
          preventDefault: () => {}
        },
        this.currentNode
      )
    },

    upLevel() {
      this.onNodeInputKeydown(
        {
          keyCode: 9,
          shiftKey: true,
          preventDefault: () => {}
        },
        this.currentNode
      )
    },

    deleteNode() {
      this.onKeyDown({
        keyCode: 46,
        stopPropagation: () => {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.smmOutlineEditContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  background-color: #fff;
  overflow: hidden;

  &.isDark {
    background-color: #262a2e;

    .tip {
      color: var(--text-normal);
    }

    .mobileActions {
      .iconBtn {
        color: hsla(0, 0%, 100%, 0.9);
        border: 1px solid #666;
      }
    }
  }

  .mobileActions {
    position: absolute;
    left: 12px;
    top: 0;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .iconBtn {
      display: flex;
      cursor: pointer;
      margin-right: 10px;
      height: 24px;
      width: 40px;
      border-radius: 4px;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: rgba(26, 26, 26, 0.8);
      border: 1px solid #eee;
      border-radius: 4px;
    }
  }

  .tip {
    position: absolute;
    left: 12px;
    top: 0;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .tipItem {
      font-size: 12px;
      border-right: 1px solid #ccc;
      padding-right: 10px;
      margin-right: 10px;
      white-space: nowrap;

      &:last-of-type {
        margin-right: 0;
        border-right: none;
      }
    }
  }

  .smmOutlineEditBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 30px 20px;

    .smmOutlineEditInner {
      width: 100%;
      height: 100%;
      overflow-y: auto;

      /deep/ .smmOutlineTreeCustomNode {
        .smmOutlineTreeCustomNodeEdit {
        }
      }
    }
  }
}

.smmOutlineTreeCustomNode {
  width: 100%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;

  .smmOutlineTreeCustomNodeEdit {
    outline: none;
    white-space: normal;
    padding-right: 20px;
  }
}
</style>
<style lang="less" scoped>
@import url('../../../style/outlineTree.less');
</style>
