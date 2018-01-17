<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" :data="favoriteList" v-if="currentIndex === 0">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" :data="playHistory" v-if="currentIndex === 1">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from '@/base/switches/switches';
  import { mapGetters, mapActions } from 'vuex';
  import Scroll from '@/base/scroll/scroll';
  import SongList from '@/base/song-list/song-list';
  import Song from '@/common/js/song';
  import { playListMixin } from '@/common/js/mixin';
  import NoResult from '@/base/no-result/no-result';

  export default {
    mixins: [playListMixin],
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    },
    data () {
      return {
        switches: [
          {name: '我的最爱'},
          {name: '最近播放'}
        ],
        currentIndex: 0
      };
    },
    computed: {
      noResult () {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length;
        } else {
          return !this.playHistory.length;
        }
      },
      noResultTitle () {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲';
        } else {
          return '你还没有听过歌曲哦';
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.listWrapper.style.bottom = bottom;
        this.$refs.favoriteList && this.$refs.favoriteList.refresh();
        this.$refs.playList && this.$refs.playList.refresh();
      },
      random () {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
        if (list.length === 0) {
          return;
        }
        // list 不是一个Song 的实例，没有 getLyric 方法等
        list = list.map((song) => {
          return new Song(song);
        });
        this.randomPlay({
          list
        });
      },
      back () {
        this.$router.back();
      },
      switchItem (index) {
        this.currentIndex = index;
      },
      selectSong (song) {
        this.insertSong(new Song(song));
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    }
  };
</script>

<style scoped rel="stylesheet/stylus" lang="stylus">
  @import "~common/stylus/variable"

  .user-center
    position fixed
    top 0
    bottom 0
    z-index 100
    width 100%
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .switches-wrapper
      margin 10px 0 30px 0
    .play-btn
      box-sizing border-box
      width 135px
      padding 7px 0
      margin 0 auto
      text-align center
      border 1px solid $color-text-l
      color $color-text-l
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
    .list-wrapper
      position absolute
      top 110px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding 20px 30px
    .no-result-wrapper
      position absolute
      top 50%
      width 100%
      transform translateY(-50%)
</style>
