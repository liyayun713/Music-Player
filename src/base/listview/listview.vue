<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item"
            :class="{ 'current': index === currentIndex}"
            v-for="(one, index) in shortcutList"
            :data-index="index">
          {{one}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '@/base/scroll/scroll';
  import { getData } from '@/common/js/dom';
  import Loading from '@/base/loading/loading';

  const ANCHOR_HEIGHT = 18;
  const TITLE_HEIGHT = 30;

  export default {
    components: {
      Scroll,
      Loading
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      };
    },
    computed: {
      // 得到每一个元素的title
      shortcutList () {
        return this.data.map((item) => {
          // 只有一个字，所以substr
          return item.title.substr(0, 1);
        });
      },
      fixedTitle () {
        if (this.scrollY > 0) return '';
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    created () {
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = [];
      this.probeType = 3;
    },
    methods: {
      selectItem (item) {
        // 基础组件不会有任何业务逻辑相关的，所以派发出去
        this.$emit('select', item);
      },
      onShortcutTouchStart (e) {
        // 当前索引
        let anchorIndex = getData(e.target, 'index');
        // 手指第一个碰到的地方
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove (e) {
        // 从start位置到move位置计算一个距离，从而计算第几个元素
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        // | 0 向下取整，取到移动了几个锚点
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        let anchorIndex = +this.touch.anchorIndex + delta;
        // let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      scroll (pos) {
        this.scrollY = pos.y;
      },
      _scrollTo (index) {
        // 解决点击上下两侧的空地错误
        if (!index && index !== 0) return;
        // 解决滑动超过两侧的bug
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }
        this.scrollY = -this.listHeight[index];
        // 第二个参数，是滚动动画的时间
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight () {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          // 使用 clientHeight 获取DOM元素高度
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    watch: {
      data () {
        // 数据变化到DOM变化有一个时间，故延迟20ms
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY (newY) {
        const listHeight = this.listHeight;
        // 当滚动到底部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        // 当滚动到底部，且 -newY 大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2;
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        // translate3d开启3d加速
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        padding-left 20px
        height 30px
        line-height 30px
        background $color-highlight-background
        color $color-text-l
        font-size $font-size-small
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          height 50px
          width 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      top 50%
      right 0
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica
      .item
        padding 3px
        line-height 1
        color $color-text-l
        font-size $font-size-small-s
        &.current
          color $color-theme
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        background $color-highlight-background
        color $color-text-l
        font-size $font-size-small
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
