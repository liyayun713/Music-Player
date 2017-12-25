<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { getSingerDetail } from '@/api/singer';
  import { ERR_OK } from '@/api/config';
  import { createSong } from '@/common/js/song';
  import MusicList from '@/components/music-list/music-list';

  export default {
    components: {
      MusicList
    },
    data () {
      return {
        songs: []
      };
    },
    computed: {
      title () {
        return this.singer.name;
      },
      bgImage () {
        return this.singer.avatar;
      },
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

  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
