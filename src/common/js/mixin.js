import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import { randomListFn } from '@/common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  methods: {
    handlePlayList () {
      // 组件必须实现这个函数，如果没有抛出异常，如果有替换 mixin 中的函数
      throw new Error('component must implement handlePlayList method')
    }
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal)
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favoriteIcon () {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    getFavoriteIcon (song) {
      // return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    changeMode () {
      // 改变模式
      const mode = (this.mode + 1) % 3
      // const mode = this.mode === playMode.sequence ? playMode.loop : this.mode === playMode.loop ? playMode.random : playMode.sequence;
      this.setMode(mode)
      // 修改当前播放列表 playList
      let list = null
      if (mode === playMode.random) {
        list = randomListFn(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 重置 currentSong 的 currentIndex
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return this.currentSong.id === item.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST',
      setCurrentIndex: 'SET_CUREENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    onQueryChange (query) {
      this.query = query
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
