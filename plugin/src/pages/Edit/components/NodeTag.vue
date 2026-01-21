<template>
  <el-dialog
    class="nodeTagDialog smmElDialog"
    :title="$t('nodeTag.title')"
    :visible.sync="dialogVisible"
    :width="'90%'"
    :top="isMobile ? '20px' : '15vh'"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-input
      v-model="tag"
      @keyup.native.enter="add"
      @keyup.native.stop
      @keydown.native.stop
      :disabled="tagArr.length >= max"
      :placeholder="$t('nodeTag.addTip')"
    >
      <el-button slot="append" @click="add">{{ $t('nodeTag.add') }}</el-button>
    </el-input>
    <div class="tagList">
      <div
        class="tagItem"
        v-for="(item, index) in tagArr"
        :key="index"
        :style="getTagStyle(item)"
      >
        {{ item.text }}
        <div class="delBtn" @click="del(index)">
          <span class="iconfont iconshanchu"></span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small" class="smmElButtonSmall">{{
        $t('dialog.cancel')
      }}</el-button>
      <el-button
        type="primary"
        @click="confirm"
        size="small"
        class="smmElButtonSmall"
        >{{ $t('dialog.confirm') }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { generateColorByContent } from 'simple-mind-map/src/utils/index'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      dialogVisible: false,
      tagArr: [],
      tag: '',
      activeNodes: [],
      max: 5
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.isMobile
    })
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (!val && oldVal) {
        this.$root.$bus.$emit('endTextEdit')
      }
      if (val && !oldVal) {
        this.handleNodeActive('', this.activeNodes)
      }
    }
  },
  created() {
    this.$root.$bus.$on('node_active', this.handleNodeActive)
    this.$root.$bus.$on('showNodeTag', this.handleShowNodeTag)
  },
  beforeDestroy() {
    this.$root.$bus.$off('node_active', this.handleNodeActive)
    this.$root.$bus.$off('showNodeTag', this.handleShowNodeTag)
  },
  methods: {
    generateColorByContent,

    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        this.tagArr = (firstNode.getData('tag') || []).map(item => {
          const data = {
            text: typeof item === 'string' ? item : item.text
          }
          if (item.style) {
            data.style = {
              ...item.style
            }
          }
          return data
        })
      } else {
        this.tagArr = []
        this.tag = ''
      }
    },

    getTagStyle(item) {
      const style = item.style || {}
      return {
        backgroundColor: style.fill || generateColorByContent(item.text),
        borderRadius: (style.radius || 3) + 'px',
        fontSize: (style.fontSize || 12) + 'px',
        height: (style.height || 20) + 'px',
        padding: `0 ${style.paddingX || 8}px`
      }
    },

    handleShowNodeTag() {
      if (this.activeNodes.length === 0) return
      this.$root.$bus.$emit('startTextEdit')
      this.dialogVisible = true
    },

    add() {
      const text = this.tag.trim()
      if (!text) return
      const data = {
        text
      }
      this.tagArr.push(data)
      this.tag = ''
    },

    del(index) {
      this.tagArr.splice(index, 1)
    },

    cancel() {
      this.dialogVisible = false
    },

    confirm() {
      this.activeNodes.forEach(node => {
        node.setTag(JSON.parse(JSON.stringify(this.tagArr)))
      })
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped>
.nodeTagDialog {
  /deep/ .el-dialog {
    max-width: 600px;
  }

  .tagList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;

    .tagItem {
      position: relative;
      margin-right: 5px;
      margin-bottom: 5px;
      color: #fff;
      display: flex;
      align-items: center;

      .delBtn {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        visibility: hidden;
      }

      &:hover {
        .delBtn {
          visibility: visible;
        }
      }
    }
  }
}
</style>
