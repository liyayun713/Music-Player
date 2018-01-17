<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div ref="showcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(hotkey.k, index)" class="item" v-for="(hotkey, index) in hotKey">
                <span>{{hotkey.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list @select="addQuery"
                         @delete="deleteSearchHistory"
                         :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm
      ref="confirm"
      title="是否清空所有搜索历史"
      confirmBtnText="清空"
      @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '@/base/search-box/search-box';
  import Suggest from '@/components/suggest/suggest';
  import { getHotkey } from '@/api/search';
  import { ERR_OK } from '@/api/config';
  import { mapActions } from 'vuex';
  import SearchList from '@/base/search-list/searchlist';
  import Confirm from '@/base/confirm/confirm';
  import Scroll from '@/base/scroll/scroll';
  import { playListMixin, searchMixin } from '@/common/js/mixin';

  export default {
    mixins: [playListMixin, searchMixin],
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    data () {
      return {
        hotKey: []
      };
    },
    computed: {
      shortcut () {
        return this.hotKey.concat(this.searchHistory);
      }
    },
    created () {
      this._getHotkey();
    },
    methods: {
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '60px' : '';

        this.$refs.showcutWrapper.style.bottom = bottom;
        this.$refs.shortcut.refresh();

        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();
      },
//      可省略
//      deleteOne (item) {
//        this.deleteSearchHistory(item);
//      },
//      deleteAll () {
//        this.clearSearchHistory();
//      },
      showConfirm () {
        this.$refs.confirm.show();
      },
      _getHotkey () {
        getHotkey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        });
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      // 当DOM未改变时，手动刷新组件
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20)
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-l
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background $color-highlight-background
            font-size $font-size-medium
            color $color-text-d
        .search-history
          position relative
          margin 0 20px
          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-l
            .text
              flex 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position fixed
      width 100%
      top 178px
      bottom 0
</style>
