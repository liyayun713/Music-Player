import { playMode } from '@/common/js/config'
import { loadSearch, loadPlay, loadFavorite } from '@/common/js/cache'

// 传递的是歌手信息，状态树
const state = {
  singer: {},
  playing: false,                 // 是否播放
  fullScreen: false,              // 播放界面是否全屏
  playList: [],                   // 歌单
  sequenceList: [],               // 顺序歌单
  mode: playMode.sequence,        // 播放模式
  currentIndex: -1,               // 当前播放歌曲索引
  disc: {},                       // 推荐详情
  toplist: {},                    // 排行榜详情
  searchHistory: loadSearch(),    // 搜索历史
  playHistory: loadPlay(),        // 播放历史
  favoriteList: loadFavorite()    // 收藏列表
}

export default state
