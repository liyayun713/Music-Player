import { mapGetters } from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList);
  },
  activated () {
    this.handlePlayList(this.playList);
  },
  methods: {
    handlePlayList () {
      // 组件必须实现这个函数，如果没有抛出异常，如果有替换 mixin 中的函数
      throw new Error('component must implement handlePlayList method')
    }
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal);
    }
  }
}
