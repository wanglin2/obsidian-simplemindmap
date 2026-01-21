<template>
  <FileSelectList
    v-if="showFileSelectList"
    :position="fileSelectListPosition"
    @select="onFileSelect"
  ></FileSelectList>
</template>

<script>
import FileSelectList from './FileSelectList.vue'
import { isHyperlink, linkRichToObUrlText, getObLinkShowName } from '@/utils'

export default {
  components: {
    FileSelectList
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      showFileSelectList: false,
      fileSelectListPosition: null,
      lastRange: null
    }
  },
  created() {
    this.mindMap.on('node_click', this.handleNodeTextATagClick)
    this.mindMap.on('node_text_edit_change', this.onNodeTextEditChange)
    this.mindMap.on('scale', this.hide)
    this.mindMap.on('translate', this.hide)
    this.mindMap.on('svg_mousedown', this.hide)
    this.mindMap.on('expand_btn_click', this.hide)
    this.mindMap.opt.transformRichTextOnEnterEdit.push(this.linkRichToText)
    this.mindMap.opt.beforeHideRichTextEdit.push(this.textToLink)
  },
  beforeDestroy() {
    this.mindMap.off('node_text_edit_change', this.onNodeTextEditChange)
    this.mindMap.off('node_click', this.handleNodeTextATagClick)
    this.mindMap.off('scale', this.hide)
    this.mindMap.off('translate', this.hide)
    this.mindMap.off('svg_mousedown', this.hide)
    this.mindMap.off('expand_btn_click', this.hide)
    this.removeHandlers()
  },
  methods: {
    removeHandlers() {
      const index = this.mindMap.opt.transformRichTextOnEnterEdit.find(item => {
        return item === this.linkRichToText
      })
      if (index > -1) {
        this.mindMap.opt.transformRichTextOnEnterEdit.splice(index, 1)
      }
      const index2 = this.mindMap.opt.beforeHideRichTextEdit.find(item => {
        return item === this.textToLink
      })
      if (index2 > -1) {
        this.mindMap.opt.beforeHideRichTextEdit.splice(index2, 1)
      }
    },

    onNodeTextEditChange() {
      const quill = this.mindMap.richText.quill
      const selection = quill.getSelection()
      this.lastRange = selection
      if (!selection) return
      const cursorPos = selection.index
      const linkPos = cursorPos - 2
      let textBefore = quill.getText(Math.max(0, linkPos), 2)
      if (/【【/.test(textBefore)) {
        quill.deleteText(linkPos, 2)
        quill.insertText(linkPos, '[[')
        textBefore = '[['
      }
      if (/\[\[/.test(textBefore)) {
        const textEditNode = this.mindMap.richText.textEditNode
        const rect = textEditNode.getBoundingClientRect()
        const cursorBounds = quill.getBounds(cursorPos)
        const elRect = this.mindMap.elRect
        let left = rect.left + cursorBounds.left - elRect.left
        let top = rect.top + cursorBounds.bottom + 10 - elRect.top
        if (left + 300 > elRect.width) {
          left = elRect.width - 300
        }
        if (top + 300 > elRect.height) {
          top = rect.top + cursorBounds.top - 300 - 10 - elRect.top
        }
        this.fileSelectListPosition = {
          left,
          top
        }
        this.showFileSelectList = true
      } else {
        this.hide()
      }
    },

    handleNodeTextATagClick(node, e) {
      this.hide()
      const el = e.target
      if (el.tagName.toLowerCase() === 'a') {
        e.preventDefault()
        const link = el.getAttribute('data-href') || el.getAttribute('href')
        if (!isHyperlink(link)) {
          const {
            embedLinkNewWindowOpen
          } = this.$root.$obsidianAPI.getSettings()
          const isNewTab = embedLinkNewWindowOpen || e.ctrlKey || e.metaKey
          this.$root.$obsidianAPI.openFile(link, isNewTab, true)
        } else {
          this.$root.$obsidianAPI.openWebLink(link)
        }
      }
    },

    onFileSelect(file) {
      const quill = this.mindMap.richText.quill
      const curRange = quill.getSelection()
      const range = curRange || this.lastRange
      if (!range) return
      const linkPos = range.index - 2
      const oldFormat = quill.getFormat(linkPos, 2)
      const res = this.$root.$obsidianAPI.createLinkInfoFromFilePath(file.path)
      if (res) {
        quill.deleteText(linkPos, 2)
        quill.insertText(linkPos, res.linkText, {
          ...oldFormat
        })
      }
      this.lastRange = null
      if (!curRange) {
        quill.setSelection(linkPos + res.linkText.length)
      }
      this.hide()
    },

    linkRichToText(nodeText) {
      nodeText = linkRichToObUrlText(nodeText, () => {
        if (this.mindMap.opt.openRealtimeRenderOnNodeTextEdit) {
          setTimeout(() => {
            this.mindMap.emit('node_text_edit_change', {
              node: this.mindMap.richText.node,
              text: this.mindMap.richText.getEditText(),
              richText: true
            })
          }, 0)
        }
      })
      return nodeText
    },

    textToLink(richText) {
      const contents = richText.quill.getContents()
      const ops = contents.ops
      for (let i = ops.length - 1; i >= 0; i--) {
        const op = ops[i]
        const insert = op.insert
        if (insert && typeof insert !== 'object' && insert !== '\n') {
          if (/\[\[[^\[\]]+\]\]/g.test(insert)) {
            const m = [...insert.matchAll(/\[\[[^\[\]]+\]\]/g)]
            const arr = insert.split(/\[\[[^\[\]]+\]\]/g)
            for (let j = m.length - 1; j >= 0; j--) {
              const exp = m[j] && m[j][0] ? m[j][0].slice(2, -2) || null : null
              if (exp !== null && exp.trim().length > 0) {
                arr.splice(j + 1, 0, {
                  insert: getObLinkShowName(exp),
                  attributes: { link: exp }
                })
              } else {
                arr.splice(j + 1, 0, '')
              }
            }
            while (arr.length > 0) {
              let v = arr.pop()
              let attributes = {}
              if (typeof v === 'string') {
                if (v.length < 1) continue
                v = { insert: v }
              } else if (typeof v === 'object') {
                attributes = v['attributes'] || {}
              }
              v['attributes'] = {
                ...ops[i]['attributes'],
                ...attributes
              }
              ops.splice(i + 1, 0, v)
            }
            ops.splice(i, 1)
          }
        }
      }
      richText.quill.setContents(contents)
    },

    hide() {
      this.showFileSelectList = false
    }
  }
}
</script>
