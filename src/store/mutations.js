// 定义修改的操作
// mutations 定义对数据修改的逻辑
import * as types from './mutation-type'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CUREENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST] (state, list) {
    state.toplist = list
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITE_LIST] (state, list) {
    state.favoriteList = list
  }
}

export default mutations
