<template>
  <div class="guideContainer">
    <div class="closeBtn" @click="closeGuide">{{ $t('guide.btn') }}</div>
    <div class="tip" style="top: -6px; right: 193px;">
      <div class="icon iconfont icona-rongqi21"></div>
      <div class="text" style="width: 200px;">
        {{ $t('guide.tip1') }}
      </div>
    </div>
    <div class="tip" style="top: 50px; left: 50%; transform: translateX(-50%);">
      <div class="icon iconfont iconarrow-up"></div>
      <div class="text" style="width: 300px;">
        {{ $t('guide.tip2') }}
      </div>
    </div>
    <div
      class="tip hr"
      style="right: 70px; top: 50%; transform: translateY(-50%);"
    >
      <div class="icon iconfont iconarrow-left flipH bg"></div>
      <div class="text bg">
        {{ $t('guide.tip3') }}
      </div>
    </div>
    <div class="tip vr" style="left: 311px; bottom: 25px;">
      <div class="icon iconfont icona-rongqi21 flipVH"></div>
      <div class="text nowrap" style="transform: translateX(50%);">
        {{ $t('guide.tip4') }}
      </div>
    </div>
    <div class="tip vr" style="left: 150px; bottom: 30px;">
      <div class="icon iconfont iconarrow-up flipV"></div>
      <div class="text" style="width: 200px;">
        {{ $t('guide.tip5') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeGuide() {
      this.$root.$bus.$emit('setShowGuide', false)
    }
  }
}
</script>

<style lang="less" scoped>
.guideContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  overflow: hidden;

  .closeBtn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #999;
    cursor: pointer;
    padding: 8px 10px;
    border: 2px dotted #999;
    border-radius: 5px;
    width: max-content;
    background-color: rgba(255, 255, 255, 1);
    font-weight: 500;
  }

  .tip {
    width: 0;
    height: 0;
    position: absolute;
    color: #999;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    font-size: 14px;

    &.hr {
      flex-direction: row-reverse;
    }

    &.vr {
      flex-direction: column-reverse;
    }

    .icon {
      font-size: 40px;

      &.flipH {
        transform: scaleX(-1);
      }

      &.flipV {
        transform: scaleY(-1);
      }

      &.flipVH {
        transform: scaleY(-1) scaleX(-1);
      }

      &.bg {
        background-color: rgba(255, 255, 255, 1);
      }
    }

    .text {
      &.nowrap {
        white-space: nowrap;
      }

      &.bg {
        background-color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
