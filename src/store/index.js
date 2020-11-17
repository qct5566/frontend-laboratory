import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'
import { createPersistedState } from './plugin'
import { STATE_STORAGE } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ...modules
  },
  // state: {},
  // mutations: {},
  // actions: {},
  getters,
  plugins: [
    createPersistedState(STATE_STORAGE) // 刷新后根据缓存获取vuex
  ]
})
