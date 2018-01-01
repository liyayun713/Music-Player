<template>
  <transition name="slide">
    <music-list :songs="songs" :bgImage="bgImage" :title="title" :rank="rank"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getTopListDetail } from '@/api/rank';
  import { ERR_OK } from '@/api/config';
  import { createSong } from '@/common/js/song';

  export default {
    components: {
      MusicList
    },
    data () {
      return {
        songs: [],
        rank: true,
        bgImage: ''
      };
    },
    computed: {
      title () {
        return this.toplist.topTitle;
      },
      ...mapGetters([
        'toplist'
      ])
    },
    created () {
      console.log(this.toplist);
      this._getToplist(this.toplist.id);
    },
    methods: {
      _getToplist (id) {
        if (!this.toplist.id) {
          this.$router.push('/rank');
          return;
        }
        getTopListDetail(id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeTopListDetail(res.songlist);
            this.bgImage = res.topinfo.pic_album;
          }
        });
      },
      _normalizeTopListDetail (data) {
        let list = [];
        data.forEach(item => {
          const musicData = item.data;
          if (musicData.songid && musicData.albumid) {
            list.push(createSong(musicData));
          }
        });
        return list;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(-100%, 0, 0)
</style>
