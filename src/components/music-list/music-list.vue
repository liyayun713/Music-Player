<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!--为了正确计算 scroll 组件高度，把 songs 作为 data 传进去-->
    <scroll @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :data="songs"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Scroll from '@/base/scroll/scroll';
  import SongList from '@/base/song-list/song-list';
  import Loading from '@/base/loading/loading';
  import { prefixStyle } from '@/common/js/dom';

  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');
  const RESERVED_HEIGHT = 40;

  export default {
    components: {
      Scroll,
      SongList,
      Loading
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        scrollY: 0
      };
    },
    computed: {
      bgStyle () {
        return `background: url(${this.bgImage})`;
      }
    },
    created () {
      // 监听滚动
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted () {
      // 记录图片的 clientHeight ，滚动时使用
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
      this.$refs.list.$el.style.top = this.$refs.bgImage.clientHeight + 'px';
    },
    methods: {
      random () {
        this.randomPlay({
          list: this.songs
        });
      },
      scroll (pos) {
        // scrollY 在Y轴的滚动距离设置成 scroll 组件的滚动距离
        this.scrollY = pos.y;
      },
      back () {
        this.$router.back();
      },
      selectItem (song, index) {
        this.selectPlay({
          list: this.songs,
          index
        });
      },
      // 通过 mapActions 将 selectPlay 包装成一个函数，供调用
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY (newVal) {
        // layer 层的最大移动距离
        let translateY = Math.max(this.minTranslateY, newVal);
        let zIndex = 0;
        let scale = 1;
        let blur = 0;     // 高斯模糊

        const percent = Math.abs(newVal / this.imageHeight);

        // 如果偏移量大于0，既总滑动量往下时，
        if (newVal > 0) {
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * percent, 20);
        }

        // bg-layer 往上移动，兼容 -webkit-
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;

        // 给filter设置高斯模糊，只支持ios
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`

        // 如果往上拉的距离大于（一个图片的高度减去title的高度），改变图片的 z-indx 和 height
        if (newVal < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = RESERVED_HEIGHT + 'px';
          this.$refs.playBtn.style.display = 'none';
        } else {
          // 重置
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playBtn.style.display = 'block';
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 100
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        color $color-theme
        font-size $font-size-large-x
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      color $color-text
      font-size $font-size-large
    .bg-image
      position relative             // 四个属性进行宽高比10：7的占位
      width 100%                    // 四个属性进行宽高比10：7的占位
      height 0                      // 四个属性进行宽高比10：7的占位
      padding-top 70%               // 四个属性进行宽高比10：7的占位
      transform-origin top          // transform-Origin属性允许您更改转换元素的位置；从顶部开始变换
      background-size cover         // 此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的*最小大小*
      .play-wrapper
        position absolute
        bottom 20px
        width 100%
        z-index 50
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          color $color-theme
          border-radius 100px
          font-size 0
          .icon-play
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
    .bg-layer
      position relative
      height 100%
      background $color-background
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      /*overflow hidden*/
      background $color-background
      .song-list-wrapper
        padding 20px 30px
      .loading-container
        position absolute
        top 50%
        width 100%
        transform translateY(-50%)
</style>
