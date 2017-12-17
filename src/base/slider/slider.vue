<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{ active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import { addClass } from '@/common/js/dom';

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    mounted () {
      // 浏览器最小17毫秒刷新一次
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();     // new BScroll的时候会增加两个dom，所以 initDots 要在 initSlider 之前
        this._initSlider();

        if (this.autoPlay) this._play();
      }, 20);

      // 监听视口改变事件
      window.addEventListener('resize', () => {
        if (!this.slider) return;
        this._setSliderWidth(true);
        this.slider.refresh();
      });
    },
    methods: {
      // 横向滚动需要设置一个slider的宽度
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        // 如果是循环的轮播，左右各增加一个宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      // 初始化slider
      _initSlider () {
        // 配置better-scroll
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,          // 横向滚动
          scrollY: false,         // 纵向滚动
          momentum: false,        // 惯性---当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画
          snap: {                 // 这个配置是为了做 slide 组件用的，默认为 false
            loop: this.loop,      // 是否可以无缝循环轮播
            threshold: 0.3,       // 用手指滑动时页面可切换的阈值，大于这个阈值可以切换到下一页
            speed: 400            // 轮播图切换的动画事件
          }
          // click: true             // 是否触发click事件，与fastclick冲突导致不能点击跳转，所以注释掉
        });

        // 监听事件，获取当前index
        this.slider.on('scrollEnd', () => {
          // 获取当前index
          let pageIndex = this.slider.getCurrentPage().pageX;
          // if (this.loop) pageIndex -= 1;
          this.currentPageIndex = pageIndex;
          if (this.loop) {
            clearTimeout(this.timer);
            this._play();
          }
        });
      },
      _initDots () {
        // dots就是长度为歌单长度的空数组
        this.dots = new Array(this.children.length);
      },
      _play () {
        // let pageIndex = this.currentPageIndex + 1;
        // if (this.loop) pageIndex += 1;
        this.timer = setTimeout(() => {
          // goToPage方法进行切换，不能从最后一张图片再跳到第一张，所以使用next()
          // this.slider.goToPage(pageIndex, 0, 400);
          this.slider.next();
        }, this.interval);
      }
    },
    destroyed () {
      // 组件销毁的时候清除计时器
      clearTimeout(this.timer);
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap      // white-space属性指定元素内的空白怎样处理(nowrap 不换行)
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background: $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>
