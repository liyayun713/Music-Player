<template>
  <div class="singer" ref="singer">
    <listview :data="singers" @select="selectSinger" ref="singerListview"></listview>
    <!--增加 router-view，承载子路由-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from '@/api/singer';
  import { ERR_OK } from '@/api/config';
  import Singer from '@/common/js/singer'
  import Listview from '@/base/listview/listview'
  import { mapMutations } from 'vuex';
  import { playListMixin } from '@/common/js/mixin'

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default {
    mixins: [playListMixin],
    components: {
      Listview
    },
    data () {
      return {
        singers: []
      };
    },
    created () {
      this._getSingerList();
    },
    methods: {
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.singerListview.refresh();
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        // 实现对一个数据的提交，简写
        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };

        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }

          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: item.Findex,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });

        // 为了得到有序列表，我们需要处理 map
        let ret = [];
        let hot = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }

        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
    overflow hidden
</style>
