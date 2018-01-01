<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(hotkey, index)" class="item" v-for="(hotkey, index) in hotkeyList">
              <span>{{hotkey.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @select="" :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '@/base/search-box/search-box';
  import Suggest from '@/components/suggest/suggest';
  import { getHotkey } from '@/api/search';
  import { ERR_OK } from '@/api/config';
  import { mapActions, mapGetters } from 'vuex';
  import SearchList from '@/base/search-list/searchlist';

  export default {
    components: {
      SearchBox,
      Suggest,
      SearchList
    },
    data () {
      return {
        hotkeyList: [],
        query: ''
      };
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    created () {
      this._getHotkey();
    },
    methods: {
      saveSearch () {
        this.saveSearchHistory(this.query);
      },
      blurInput () {
        this.$refs.searchBox.blur();
      },
      onQueryChange (query) {
        this.query = query;
      },
      addQuery (hotkey, index) {
        if (index === 0) {
          location.href = hotkey.special_url;
        } else {
          this.$refs.searchBox.setQuery(hotkey.k);
        }
      },
      _getHotkey () {
        getHotkey().then(res => {
          if (res.code === ERR_OK) {
            this.hotkeyList.push({
              k: res.data.special_key,
              special_url: res.data.special_url
            });
            this.hotkeyList = this.hotkeyList.concat(res.data.hotkey.slice(0, 9));
          }
        });
      },
      ...mapActions([
        'saveSearchHistory'
      ])
    },
    watch: {
//      query (newQuery) {
//        if (!newQuery) {
//          setTimeout(() => {
//            this.$refs.shortcut.refresh();
//          }, 20)
//        }
//      }
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
            &:first-child
              color $color-theme
              border 1px solid
              border-color $color-theme
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
