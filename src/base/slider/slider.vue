<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots"></div>
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
        default: 4000
      }
    },
    data () {
      return {};
    },
    mounted () {
      // 浏览器最小17毫秒刷新一次
      setTimeout(() => {
        this._setSliderWidth();
        this._initSlider();
      }, 20);
    },
    methods: {
      // 横向滚动需要设置一个slider的宽度
      _setSliderWidth () {
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
        if (this.loop) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      // 初始化slider
      _initSlider () {
        // 配置better-scroll
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,      // 横向滚动
          scrollY: false,     // 纵向滚动
          momentum: false,    // 惯性
          snap: true,         //
          snapLoop: this.loop,//
          snapThresHold: 0.3, //
          snapSpeed: 400,     // 
          click: true         // 是否可点击
        });
      }
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
      white-space nowrap // white-space属性指定元素内的空白怎样处理(nowrap 不换行)
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
      bottom 0
      text-align center
      font-size 0

</style>
