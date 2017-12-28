<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchstart"
           @touchmove.prevent="progressTouchmove"
           @touchend="progressTouchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { prefixStyle } from '@/common/js/dom';

  const transform = prefixStyle('transform');
  const progressBtnWidth = 16;

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      // 创建实例时，用一个对象进行数据的共享
      this.touch = {};
    },
    methods: {
      progressClick (e) {
        // 当我们点击 progress-btn 的时候，e.offsetX获取不对，使用 pageX
        const rect = this.$refs.progressBar.getBoundingClientRect();
        const left = rect.left;
        const pageX = e.pageX;
        const delta = pageX - left;
        this._offset(delta);
        // 直接获取偏移量
        // this._offset(e.offsetX);
        // 通知外层
        this._triggerPercent();
      },
      progressTouchstart (e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchmove (e) {
        if (!this.touch.initiated) return;
        let deltaX = e.touches[0].pageX - this.touch.startX;
        let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX));
        this._offset(offsetWidth);
      },
      progressTouchend () {
        this.touch.initiated = false;
        this._triggerPercent();
      },
      _offset (offsetWidth) {
        this.$refs.progress.style.width = offsetWidth + 'px';
        // this.$refs.progressBtn.style.left = offsetWidth - 8 + 'px';         // 使用 transform 和 left 都可
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      },
      _triggerPercent () {
        let width = this.$refs.progressBar.clientWidth - progressBtnWidth;
        let percent = this.$refs.progress.clientWidth / width;
        this.$emit('percentChange', percent);
      }
    },
    watch: {
      percent (newVal) {
        if (newVal >= 0 && !this.touch.initiated) {
          // let width = this.$refs.progressBar.getBoundingClientRect().width;      // 使用 getBoundingClientRect() 也行
          let width = this.$refs.progressBar.clientWidth - progressBtnWidth;
          let offsetWidth = width * newVal;
          this._offset(offsetWidth)
        }
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, 0.4)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        height 30px
        width 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
