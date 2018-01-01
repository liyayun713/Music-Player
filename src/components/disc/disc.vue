<template>
  <transition name="slide">
    <music-list :songs="songs" :bgImage="bgImage" :title="title"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getSongList } from '@/api/recommend';
  import { ERR_OK } from '@/api/config';
  import { createSong } from '@/common/js/song';

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
        return this.disc.dissname;
      },
      bgImage () {
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSongList(this.disc.dissid);
    },
    methods: {
      _getSongList (id) {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }

    }
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
