<template>
  <el-tree
    ref="tree"
    class="smmOutlineTree"
    node-key="uid"
    :draggable="!isReadonly"
    default-expand-all
    :class="{ isDark: isDark }"
    :data="data"
    :props="defaultProps"
    :highlight-current="true"
    :expand-on-click-node="false"
    :allow-drag="checkAllowDrag"
    @node-drop="onNodeDrop"
    @current-change="onCurrentChange"
    @mouseenter.native="isInTreArea = true"
    @mouseleave.native="isInTreArea = false"
  >
    <span
      class="smmOutlineTreeCustomNode"
      slot-scope="{ node, data }"
      :data-id="data.uid"
      @click="onClick(data)"
    >
      <span
        class="smmOutlineTreeCustomNodeEdit"
        :contenteditable="!isReadonly"
        :key="getKey()"
        @keydown.stop="onNodeInputKeydown($event, node)"
        @keyup.stop
        @blur="onBlur($event, node)"
        @paste="onPaste($event, node)"
        v-html="node.label"
      ></span>
    </span>
  </el-tree>
</template>

<script>
import { mapState } from 'vuex'
import {
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap,
  createUid,
  htmlEscape,
  handleInputPasteText
} from 'simple-mind-map/src/utils'
import { linkRichToObUrlText, obUrlToLinkRich } from '@/utils'
import CursorTextHandler from '@/utils/CursorTextHandler'

export default {
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        label: 'label'
      },
      currentData: null,
      notHandleDataChange: false,
      isHandleNodeTreeRenderEnd: false,
      beInsertNodeUid: '',
      insertType: '',
      isInTreArea: false,
      isAfterCreateNewNode: false,
      beingSplitNodeContent: ''
    }
  },
  computed: {
    ...mapState({
      isReadonly: state => state.isReadonly,
      isDark: state => state.localConfig.isDark
    })
  },
  created() {
    window.addEventListener('keydown', this.onKeyDown)
    this.$root.$bus.$on('data_change', this.handleDataChange)
    this.$root.$bus.$on('node_tree_render_end', this.handleNodeTreeRenderEnd)
    this.$root.$bus.$on('hide_text_edit', this.handleHideTextEdit)
  },
  mounted() {
    this.refresh()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown)
    this.$root.$bus.$off('data_change', this.handleDataChange)
    this.$root.$bus.$off('node_tree_render_end', this.handleNodeTreeRenderEnd)
    this.$root.$bus.$off('hide_text_edit', this.handleHideTextEdit)
  },
  methods: {
    handleHideTextEdit() {
      if (this.notHandleDataChange) {
        this.notHandleDataChange = false
        this.refresh()
      }
    },

    handleDataChange() {
      if (this.notHandleDataChange) {
        this.notHandleDataChange = false
        this.isAfterCreateNewNode = false
        return
      }
      if (this.isAfterCreateNewNode) {
        this.isAfterCreateNewNode = false
        return
      }
      this.refresh()
    },

    handleNodeTreeRenderEnd() {
      if (this.insertType) {
        this[this.insertType]()
        this.insertType = ''
        return
      }
      if (this.isHandleNodeTreeRenderEnd) {
        this.isHandleNodeTreeRenderEnd = false
        this.refresh()
        this.$nextTick(() => {
          this.afterCreateNewNode()
        })
      }
    },

    refresh() {
      this.fileNameToPath = {}
      let data = this.mindMap.getData()
      data.root = true
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
      walk(data)
      if (data.data.freeNodeTrees && data.data.freeNodeTrees.length > 0) {
        data.data.freeNodeTrees.forEach(item => {
          item.root = true
          walk(item)
        })
      }
      this.data = [data, ...data.data.freeNodeTrees]
    },

    afterCreateNewNode() {
      let id = this.beInsertNodeUid
      if (id && this.$refs.tree) {
        try {
          this.isAfterCreateNewNode = true
          this.$refs.tree.setCurrentKey(id)
          let node = this.$refs.tree.getNode(id)
          this.onCurrentChange(node.data)
          this.onClick(node.data)
          const el = document.querySelector(
            `.smmOutlineTreeCustomNode[data-id="${id}"] .smmOutlineTreeCustomNodeEdit`
          )
          if (el) {
            let selection = window.getSelection()
            let range = document.createRange()
            range.selectNodeContents(el)
            selection.removeAllRanges()
            selection.addRange(range)
            let offsetTop = el.offsetTop
            this.$emit('scrollTo', offsetTop)
          }
        } catch (error) {}
      }
      this.beInsertNodeUid = ''
    },

    checkAllowDrag(node) {
      return !node.data.root
    },

    onBlur(e, node) {
      if (node.data.textCache === e.target.innerHTML) {
        if (this.insertType) {
          this[this.insertType]()
          this.insertType = ''
        }
        return
      }
      const richText = node.data.data.richText
      let text = richText ? e.target.innerHTML : e.target.innerText
      const targetNode = this.mindMap.renderer.findNodeByUid(node.data.uid)
      if (!targetNode) return
      this.notHandleDataChange = !this.insertType
      if (richText) {
        text = textToNodeRichTextWithWrap(text)
        text = obUrlToLinkRich(text)
        targetNode.setText(text, true)
      } else {
        targetNode.setText(text)
      }
    },

    onPaste(e) {
      handleInputPasteText(e)
    },

    getKey() {
      return Math.random()
    },

    onNodeInputKeydown(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        this.insertType = e.ctrlKey ? 'splitInsertNode' : 'insertNode'
        if (e.ctrlKey) {
          const cursorTextHandler = new CursorTextHandler(e.target)
          const afterText = cursorTextHandler.getTextAfterCursor()
          if (!afterText) {
            return
          }
          const beforeText = cursorTextHandler.getTextBeforeCursor()
          e.target.innerHTML = beforeText
          this.beingSplitNodeContent = afterText
        }
        e.target.blur()
      }
      if (e.keyCode === 9) {
        e.preventDefault()
        if (e.shiftKey) {
          this.insertType = 'moveUp'
          e.target.blur()
        } else {
          this.insertType = 'moveDown'
          e.target.blur()
        }
      }
    },

    moveUp() {
      this.mindMap.execCommand('MOVE_UP_ONE_LEVEL')
    },

    moveDown() {
      this.mindMap.execCommand('MOVE_DOWN_ONE_LEVEL')
    },

    splitInsertNode() {
      if (!this.beingSplitNodeContent) {
        return
      }
      this.notHandleDataChange = true
      this.isHandleNodeTreeRenderEnd = true
      this.beInsertNodeUid = createUid()
      const richText = !!this.mindMap.richText
      this.mindMap.execCommand('INSERT_NODE', false, [], {
        uid: this.beInsertNodeUid,
        text: richText
          ? textToNodeRichTextWithWrap(this.beingSplitNodeContent)
          : this.beingSplitNodeContent,
        richText
      })
      this.beingSplitNodeContent = ''
    },

    insertNode() {
      const activeNode = this.mindMap.renderer.getActiveNodeList()[0]
      let commandName = 'INSERT_NODE'
      if (activeNode && activeNode.isRoot) {
        commandName = 'INSERT_CHILD_NODE'
      }
      this.notHandleDataChange = true
      this.isHandleNodeTreeRenderEnd = true
      this.beInsertNodeUid = createUid()
      this.mindMap.execCommand(commandName, false, [], {
        uid: this.beInsertNodeUid
      })
    },

    insertChildNode() {
      this.notHandleDataChange = true
      this.isHandleNodeTreeRenderEnd = true
      this.beInsertNodeUid = createUid()
      this.mindMap.execCommand('INSERT_CHILD_NODE', false, [], {
        uid: this.beInsertNodeUid
      })
    },

    onClick(data) {
      const targetNode = this.mindMap.renderer.findNodeByUid(data.uid)
      if (targetNode && targetNode.nodeData.data.isActive) return
      this.notHandleDataChange = true
      this.mindMap.execCommand('GO_TARGET_NODE', data.uid, () => {
        this.notHandleDataChange = false
      })
    },

    onNodeDrop(data, target, postion) {
      this.notHandleDataChange = true
      const node = this.mindMap.renderer.findNodeByUid(data.data.uid)
      const targetNode = this.mindMap.renderer.findNodeByUid(target.data.uid)
      if (!node || !targetNode) {
        return
      }
      switch (postion) {
        case 'before':
          this.mindMap.execCommand('INSERT_BEFORE', node, targetNode)
          break
        case 'after':
          this.mindMap.execCommand('INSERT_AFTER', node, targetNode)
          break
        case 'inner':
          this.mindMap.execCommand('MOVE_NODE_TO', node, targetNode)
          break
        default:
          break
      }
    },

    onCurrentChange(data) {
      this.currentData = data
    },

    onKeyDown(e) {
      if (!this.isInTreArea) return
      if ([46, 8].includes(e.keyCode) && this.currentData) {
        e.stopPropagation()
        this.mindMap.renderer.textEdit.hideEditTextBox()
        const node = this.mindMap.renderer.findNodeByUid(this.currentData.uid)
        if (node && !node.isRoot) {
          this.notHandleDataChange = true
          this.$refs.tree.remove(this.currentData)
          this.mindMap.execCommand('REMOVE_NODE', [node])
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
