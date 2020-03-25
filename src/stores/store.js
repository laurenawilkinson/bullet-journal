import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layers: 0
  },
  mutations: {
    addLayer (state) {
      state.layers += 1;
    }
  },
  actions: {
    async addLayer ({ commit }) {
      commit('addLayer')
    }
  }
})

export default store;