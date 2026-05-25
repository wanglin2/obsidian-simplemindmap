<template>
  <div
    class="fileSelectListContainer"
    :style="{ left: position.left + 'px', top: position.top + 'px' }"
    :class="{ isDark: isDark }"
    @click.stop.passive
    @mousedown.stop
  >
    <div class="fileSelectListSearch">
      <el-input
        v-model="searchText"
        :placeholder="$t('fileSelectList.searchPlaceholder')"
      ></el-input>
    </div>
    <div class="fileSelectList smmCustomScrollbar" ref="fileSelectListRef">
      <div
        class="fileSelectItem"
        v-for="(item, index) in list"
        :key="item.path"
        :class="{ active: activeIndex === index }"
        @click="onSelect(item)"
      >
        <div class="fileSelectItemTitle">{{ item.basename }}</div>
        <div
          class="fileSelectItemNote"
          v-if="item.folder && item.folder !== '/'"
        >
          {{ item.folder }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    position: {
      type: Object
    }
  },
  data() {
    return {
      searchText: '',
      allList: null,
      list: [],
      searchTimer: null,
      activeIndex: 0
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    searchText() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.activeIndex = 0
        this.getFileList()
      }, 300)
    }
  },
  created() {
    this.getFileList()
    document.body.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    clearTimeout(this.searchTimer)
    document.body.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    getFileList() {
      let list = []
      if (this.allList) {
        list = this.allList
      } else {
        list = this.allList = this.$root.$obsidianAPI
          .getObAllFiles()
          .map(item => {
            return {
              folder: item.parent.path,
              path: item.path,
              basename: item.basename
            }
          })
      }
      if (this.searchText.trim()) {
        list = list.filter(item =>
          item.basename.includes(this.searchText.trim())
        )
      }
      this.list = list.slice(0, 50)
    },

    onSelect(item) {
      this.$emit('select', item)
    },

    onKeydown(e) {
      if ([38, 40, 13].includes(e.keyCode)) {
        e.stopPropagation()
        e.preventDefault()
        if (e.keyCode === 38) {
          this.activeIndex = Math.max(0, this.activeIndex - 1)
          this.updateScroll()
        } else if (e.keyCode === 40) {
          this.activeIndex = Math.min(
            this.list.length - 1,
            this.activeIndex + 1
          )
          this.updateScroll()
        } else if (e.keyCode === 13) {
          if (this.list[this.activeIndex]) {
            this.onSelect(this.list[this.activeIndex])
          }
        }
      }
    },

    updateScroll() {
      const activeItem = this.$refs.fileSelectListRef.children[this.activeIndex]
      if (activeItem) {
        const activeItemRect = activeItem.getBoundingClientRect()
        const fileSelectListRect = this.$refs.fileSelectListRef.getBoundingClientRect()
        if (activeItemRect.top < fileSelectListRect.top) {
          this.$refs.fileSelectListRef.scrollTop -= activeItemRect.height + 10
        } else if (activeItemRect.bottom > fileSelectListRect.bottom) {
          this.$refs.fileSelectListRef.scrollTop += activeItemRect.height + 10
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fileSelectListContainer {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.028),
    0px 3.4px 6.7px rgba(0, 0, 0, 0.042), 0px 15px 30px rgba(0, 0, 0, 0.07);
  border: 1px solid #f6f6f6;
  z-index: 3001;
  position: absolute;
  width: 300px;
  height: 300px;
  overflow: hidden;
  padding: 8px 10px;

  &.isDark {
    background-color: #363b3f;
    border-color: #363b3f;

    .fileSelectList {
      .fileSelectItem {
        color: #fff;

        &:hover {
          background-color: hsla(0, 0%, 100%, 0.05);
        }

        &.active {
          background-color: hsla(0, 0%, 100%, 0.05);
        }

        .fileSelectItemNote {
          color: hsla(0, 0%, 100%, 0.6);
        }
      }
    }
  }

  .fileSelectListSearch {
    flex-shrink: 0;
  }

  .fileSelectList {
    overflow-y: auto;
    overflow-x: hidden;

    .fileSelectItem {
      cursor: pointer;
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 15px;
      overflow: hidden;

      &:hover {
        background-color: rgba(0, 0, 0, 0.067);
      }

      &.active {
        background-color: rgba(0, 0, 0, 0.067);
      }

      .fileSelectItemTitle {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fileSelectItemNote {
        margin-top: 5px;
        font-size: 12px;
        color: #5c5c5c;
        width: 100%;
        flex-basis: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
