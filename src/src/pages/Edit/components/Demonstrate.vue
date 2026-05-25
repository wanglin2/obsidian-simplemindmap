<template>
  <div class="demonstrateContainer" :class="{ isDark: isDark }">
    <div
      class="exitDemonstrateBtn"
      @click="exit"
      ref="exitDemonstrateBtnRef"
      :class="{ show: showDemonstrateOperations }"
      @mousedown.stop
      @mousemove.stop
      @mouseup.stop
    >
      <span class="icon iconfont iconguanbi"></span>
    </div>
    <div
      class="stepBox"
      ref="stepBoxRef"
      :class="{ show: showDemonstrateOperations }"
      @mousedown.stop
      @mousemove.stop
      @mouseup.stop
    >
      <div class="jump" @click="prev" :class="{ disabled: curStepIndex <= 0 }">
        <span class="icon el-icon-back"></span>
      </div>
      <div class="step">{{ curStepIndex + 1 }} / {{ totalStep }}</div>
      <div
        class="jump"
        @click="next"
        :class="{ disabled: curStepIndex >= totalStep - 1 }"
      >
        <span class="icon el-icon-right"></span>
      </div>
      <div class="input">
        <input
          type="text"
          v-model="inputStep"
          @keyup.enter.stop="onEnter"
          @keydown.stop
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      showDemonstrateOperations: false,
      curStepIndex: 0,
      totalStep: 0,
      inputStep: '',
      exitDemoModeTimer: null,
      enterDemoModeTimer: null
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark
    })
  },
  created() {
    this.$root.$bus.$on('demonstrate_jump', this.onJump)
    this.$root.$bus.$on('exit_demonstrate', this.onExit)
    this.$root.$bus.$on('enter_demonstrate', this.onEnterDemonstrate)
  },
  mounted() {
    this.mindMap.el.appendChild(this.$refs.exitDemonstrateBtnRef)
    this.mindMap.el.appendChild(this.$refs.stepBoxRef)
  },
  beforeDestroy() {
    clearTimeout(this.enterDemoModeTimer)
    clearTimeout(this.exitDemoModeTimer)
    this.$root.$bus.$off('demonstrate_jump', this.onJump)
    this.$root.$bus.$off('exit_demonstrate', this.onExit)
    this.$root.$bus.$off('enter_demonstrate', this.onEnterDemonstrate)
  },
  methods: {
    onEnterDemonstrate() {
      this.enterDemoModeTimer = setTimeout(() => {
        this.mindMap.resize()
        this.mindMap.demonstrate.jump(0)
      }, 1000)
      this.showDemonstrateOperations = true
      this.mindMap.demonstrate.enter()
    },

    exit() {
      this.mindMap.demonstrate.exit()
    },

    onExit() {
      this.showDemonstrateOperations = false
      this.curStepIndex = 0
      this.totalStep = 0
      this.exitDemoModeTimer = setTimeout(() => {
        this.mindMap.resize()
      }, 1000)
    },

    onJump(index, total) {
      this.curStepIndex = index
      this.totalStep = total
    },

    prev() {
      this.mindMap.demonstrate.prev()
    },

    next() {
      this.mindMap.demonstrate.next()
    },

    onEnter() {
      const num = Number(this.inputStep)
      if (Number.isNaN(num)) {
        this.inputStep = ''
      } else if (num >= 1 && num <= this.totalStep) {
        this.mindMap.demonstrate.jump(num - 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.demonstrateContainer {
  display: none;

  &.isDark {
    .btn {
      color: hsla(0, 0%, 100%, 0.6);

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .item {
    margin-right: 12px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .btn {
    cursor: pointer;
    font-size: 20px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #ecf5ff;
    }
  }
}

.exitDemonstrateBtn,
.stepBox {
  position: absolute;
  right: 40px;
  z-index: 10001;
  visibility: hidden;
  pointer-events: none;

  &.show {
    visibility: visible;
    pointer-events: all;
  }
}

.exitDemonstrateBtn {
  top: 20px;
  cursor: pointer;

  .icon {
    font-size: 28px;
    color: #fff;
  }
}

.stepBox {
  bottom: 20px;
  display: flex;
  align-items: center;

  .step {
    color: #fff;
    margin: 0 12px;
  }

  .jump {
    color: #fff;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      color: #999;
    }
  }

  .input {
    margin-left: 12px;
    display: flex;
    align-items: center;

    input {
      width: 50px;
      height: 30px;
      text-align: center;
      background-color: transparent;
      border: 1px solid #999;
      outline: none;
      color: #fff;
      caret-color: #fff;
    }
  }
}
</style>
