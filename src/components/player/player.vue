<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchstart"
             @touchmove.prevent="middleTouchmove"
             @touchend="middleTouchend">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   v-for="(line, index) in currentLyric.lines"
                   :class="{'current': currentLineNum === index}">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="min">
      <div class="min-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" height="40" width="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop.prevent="togglePlaying" class="icon-min" :class="minIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { prefixStyle } from '@/common/js/dom';
  import { playMode } from '@/common/js/config';
  import { randomListFn } from '@/common/js/util';
  import animations from 'create-keyframe-animation';
  import ProgressBar from '@/base/progress-bar/progress-bar';
  import ProgressCircle from '@/base/progress-circle/progress-circle';
  import Lyric from 'lyric-parser';
  import Scroll from '@/base/scroll/scroll';

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    },
    data () {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      };
    },
    computed: {
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      },
      cdCls () {
        return this.playing ? 'play' : 'play pause';
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      minIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      disableCls () {
        return this.songReady ? '' : 'disable';
      },
      percent () {
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    created () {
      // 并不需要添加 getter 和 setter 所以在 created 钩子函数中添加即可
      this.touch = {};
    },
    methods: {
      middleTouchstart (e) {
        // 设置标识
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchmove (e) {
        if (!this.touch.initiated) return;
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        // 如果纵向滚动大于横向滚动，return
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        // this.$refs.lyricList是一个vue组件，没法操作，所以使用$el
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      middleTouchend () {
        let offsetWidth, opacity;
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0;
            this.currentShow = 'cd';
            opacity = 1;
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      },
      changeMode () {
        // 改变模式
        // const mode = (this.mode + 1) % 3;
        const mode = this.mode === playMode.sequence ? playMode.loop : this.mode === playMode.loop ? playMode.random : playMode.sequence;
        this.setMode(mode);
        // 修改当前播放列表 playList
        let list = null;
        if (mode === playMode.random) {
          list = randomListFn(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        // 重置 currentSong 的 currentIndex
        this.resetCurrentIndex(list);
        this.setPlayList(list);
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return this.currentSong.mid === item.mid;
        });
        this.setCurrentIndex = index;
      },
      onProgressBarChange (percent) {
        const currentTime = this.currentSong.duration * percent;
        // 改变 audio 的currentTime
        this.$refs.audio.currentTime = currentTime;
        if (!this.playing) this.togglePlaying();
        if (this.currentLyric) this.currentLyric.seek(currentTime * 1000);
      },
      updateTime (e) {
        // 将 audio 的 timeupdate 事件回调的 e.target.currentTime 赋值给 currentTime
        this.currentTime = e.target.currentTime;
      },
      format (interval) {
        // 向下取整
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = interval % 60 | 0;
        return `${minute}:${this._pad(second)}`;
      },
      _pad (num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      end () {
        // 如果是单曲循环模式，进行循环
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      loop () {
        // 单曲循环把播放时间置为0
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) this.currentLyric.seek(0);
      },
      next () {
        if (!this.songReady) return;
        if (this.playing.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          // 提交一个mutation
          this.setCurrentIndex(index);
          if (!this.playing) this.togglePlaying();
        }
        this.songReady = false;
      },
      prev () {
        if (!this.songReady) return;
        if (this.playing.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          // 提交一个mutation
          this.setCurrentIndex(index);
          if (!this.playing) this.togglePlaying();
        }
        this.songReady = false;
      },
      togglePlaying () {
        if (!this.songReady) return;
        // 提交一个mutation
        this.setPlayingState(!this.playing);
        if (this.currentLyric) this.currentLyric.togglePlay();
      },
      ready () {
        this.songReady = true;
      },
      error () {
        this.songReady = true;
      },
      // 动画钩子函数
      enter (el, done) {
        const {x, y, scale} = this._getPosAndScale();
        // 定义animation
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        };
        // 注册动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });
        // 运行动画，(DOM节点, 动画名称, 回调)，done执行过后跳到 afterEnter
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter () {
        // 清空 animation
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave (el, done) {
        // 与 enter 是一个相反的过程，不存在放大再缩小，所以直接使用 transform
        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      afterLeave () {
        // 清空动画
        this.$refs.cdWrapper.style.animation = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      _getPosAndScale () {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingBottom - paddingTop - width / 2;
        return {
          x,
          y,
          scale
        };
      },
      back () {
        // 提交一个mutation
        this.setFullScreen(false);
      },
      open () {
        // 提交一个mutation
        this.setFullScreen(true);
      },
      getLyric () {
        this.currentSong.getLyric().then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) this.currentLyric.play();
        }).catch(() => {
          // 如果获取歌词数据异常，做一些清理操作
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        });
      },
      handleLyric ({lineNum, txt}) {
        // 歌词发生改变时的回调函数，歌词自动滚动
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      // 映射
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CUREENT_INDEX',
        setMode: 'SET_MODE',
        setPlayList: 'SET_PLAY_LIST'
      })
    },
    watch: {
      currentSong (newVal, oldVal) {
        if (newVal.id === oldVal.id) return;
        if (this.currentLyric) this.currentLyric.stop();
        // 调用 play() 的时候去请求src，所以使用 this.$nextTick()
        setTimeout(() => {
          this.$refs.audio.play();
          this.getLyric();
        }, 1000);
      },
      playing (newPlaying) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause();
        });
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position absolute
        top 0
        left 0
        height 100%
        width 100%
        z-index -1
        opacity 0.6
        filter blur(20px)
      .top
        position relative
        margin-bottom 25px
        .back
          position absolute
          top 0
          left 6px
          z-index 50
          .icon-back
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          line-height 40px
          text-align center
          no-wrap()
          font-size $font-size-large
          color $color-text
        .subtitle
          line-height 20px
          text-align center
          font-size $font-size-medium
          color $color-text
      .middle
        position fixed
        top 80px
        bottom 170px
        width 100%
        white-space nowrap
        font-size 0
        .middle-l
          display inline-block
          position relative
          vertical-align top
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            top 0
            left 10%
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255, 255, 255, 0.1)
              border-radius 50%
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
              .image
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
          .playing-lyric-wrapper
            margin 30px auto 0 auto
            width 80%
            overflow hidden
            text-align center
            .playing-lyric
              height 20px
              line-height 20px
              font-size $font-size-medium
              color $color-text-l
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric-wrapper
            margin 0 auto
            width 80%
            overflow hidden
            text-align center
            .text
              line-height 32px
              color $color-text-l
              font-size $font-size-medium
              &.current
                color $color-text
      .bottom
        position absolute
        bottom 50px
        width 100%
        .dot-wrapper
          text-align center
          font-size 0
          .dot
            display inline-block
            vertical-align middle
            margin 0 4px
            width 8px
            height 8px
            border-radius 50%
            background $color-text-l
            &.active
              width 20px
              border-radius 5px
              background $color-text-ll
        .progress-wrapper
          display flex
          align-items center
          margin 0 auto
          padding 10px 0
          width 80%
          .time
            flex 0 0 30px
            line-height 30px
            width 30px
            color $color-text
            font-size $font-size-small
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
        .operators
          display flex
          align-items center
          .icon
            flex 1
            color $color-theme
            &.disabled
              color $color-theme-d
            i
              font-size 30px
          .i-left
            text-align right
          .i-center
            padding 0 20px
            text-align center
            i
              font-size 40px
          .i-right
            text-align left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition all 0.4s
        .top, .bottom
          // 贝塞尔曲线，回弹效果
          transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        .top
          transform translate3d(0, -100px, 0)
        .bottom
          transform translate3d(0, 100px, 0)
    .min-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      width 100%
      height 60px
      z-index: 180
      background: $color-highlight-background
      &.min-enter-active, &.min-leave-active
        transition all 0.4s
      &.min-enter, &.min-leave-to
        opacity 0
      .icon
        flex 0 0 40px
        width 40px
        padding 0 10px 0 20px
        img
          border-radius 50%
          &.play
            animation rotate 10s linear infinite
          &.pause
            animation-play-state paused
      .text
        flex 1
        display flex
        flex-direction column
        justify-content center
        line-height 20px
        overflow hidden
        .name
          margin-bottom 2px
          no-wrap()
          font-size $font-size-medium
          color $color-text
        .desc
          no-wrap()
          font-size $font-size-small
          color $color-text-d
      .control
        flex 0 0 30px
        width 30px
        padding  0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size 30px
          color $color-theme-d
        .icon-min
          position absolute
          top 0
          left 0
          font-size 32px
</style>
