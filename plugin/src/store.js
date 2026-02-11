import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: {
      localConfig: {
        isZenMode: false,
        useLeftKeySelectionRightKeyDrag: false,
        isShowScrollbar: false,
        isDark: false,
        isShowBottomToolbar: true,
        autoSaveTime: 5
      },
      activeSidebar: '',
      isOutlineEdit: false,
      isReadonly: false,
      extraTextOnExport: '',
      isMobile: false,
      prependSidebarList: []
    },
    mutations: {
      setLocalConfig(state, data) {
        Object.keys(data).forEach(key => {
          state.localConfig[key] = data[key]
        })
      },

      setActiveSidebar(state, data) {
        state.activeSidebar = data
      },

      setIsOutlineEdit(state, data) {
        state.isOutlineEdit = data
      },

      setIsReadonly(state, data) {
        state.isReadonly = data
      },

      setExtraTextOnExport(state, data) {
        state.extraTextOnExport = data
      },

      setIsMobile(state, data) {
        state.isMobile = data
      },

      appendPrependSidebarList(state, data) {
        state.prependSidebarList.push(data)
      },

      clearPrependSidebarList(state) {
        state.prependSidebarList = []
      },

      removePrependSidebarList(state, data) {
        state.prependSidebarList = state.prependSidebarList.filter(
          item => item.value !== data
        )
      }
    },
    actions: {}
  })
}

export default createStore
