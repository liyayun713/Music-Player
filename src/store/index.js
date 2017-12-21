import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'     // 每次通过 mutation 修改 state，在控制台打印日志

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// 相当于是一个单例模式，Store的一个实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,     // 检测 state 的修改是否来自 mutation
  plugins: debug ? [createLogger()] : []
})
