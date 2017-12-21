<template>
  <transition name="slide">
    <div class="singer-detail">

    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex';
  import { getSingerDetail } from '@/api/singer';
  import { ERR_OK } from '@/api/config';
  import { createSong } from '@/common/js/song';

  export default {
    data () {
      return {
        songs: []
      };
    },
    computed: {
      // 取数据
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getDetail(this.singer.id);
    },
    methods: {
      _getDetail (id) {
        if (!id) {
          this.$router.push({path: '/singer'});
          return;
        }
        getSingerDetail(id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list);
            console.log(this.songs);
          }
        }, error => {
          console.log(error);
        });
      },
      _normalizeSongs (list) {
        let ret = [];
        list.forEach((item) => {
          // 取得 item 中的 musicData，并 let 为 musicData
          let {musicData} = item;
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    }
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 100
    background $color-background

  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
