<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="list-item">
              <div class="icon">
                <img width="60" height="60" :src="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend, getDiscList } from '@/api/recommend'
  import { ERR_OK } from '@/api/config'
  import Slider from '@/base/slider/slider'
  import Scroll from '@/base/scroll/scroll'

  export default {
    data () {
      return {
        recommends: [],
        discList: []
      };
    },
    components: {
      Slider,
      Scroll
    },
    created () {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
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
      }
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
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .list-item
          display flex
          align-items center            // 交叉轴上对其方式
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
            justify-content center      // 主轴上的对齐方式
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
</style>
