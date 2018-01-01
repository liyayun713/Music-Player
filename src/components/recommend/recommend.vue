<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="item in recommends">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="list-item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations } from 'vuex';
  import { getRecommend, getDiscList } from '@/api/recommend'
  import { ERR_OK } from '@/api/config'
  import Slider from '@/base/slider/slider'
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
  import { playListMixin } from '@/common/js/mixin'

  export default {
    mixins: [playListMixin],
    data () {
      return {
        recommends: [],
        discList: [],
        checkLoaded: false
      };
    },
    components: {
      Slider,
      Scroll,
      Loading
    },
    created () {
      this._getRecommend();
      this._getDiscList();
    },
    activated () {
      // keep-alive组件激活时调用
      // 该钩子在服务器端渲染期间不被调用
      setTimeout(() => {
        this.$refs.slider && this.$refs.slider.refresh()
      }, 20)
    },
    methods: {
      selectItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getRecommend () {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        }, err => {
          console.log(err);
        });
      },
      _getDiscList () {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
        }, err => {
          console.log(err);
        });
      },
      loadImage () {
        if (this.checkLoaded) return;
        this.checkLoaded = true;
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position fixed
    top 88px
    width 100%
    bottom 0
    overflow hidden
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        height 0
        padding-top 40%
        overflow hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .list-item
          display flex
          align-items center // 交叉轴上对其方式
          box-sizing border-box
          padding 0 20px 20px
          .icon
            flex 0 0 60px
            width 60px
            padding-right 20px
          .text
            flex 1
            display flex
            flex-direction column
            justify-content center // 主轴上的对齐方式
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
      .loading-container
        position absolute
        top 50%
        width 100%
        transform translateY(-50%)
</style>
