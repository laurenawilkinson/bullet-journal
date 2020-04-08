import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layers: 0,
    activeItem: null
  },
  mutations: {
    addLayer (state) {
      state.layers += 1;
    },
    setActiveItem (state, item = null) { 
      state.activeItem = item;
    }
  },
  actions: {
    async addLayer ({ commit }) {
      commit('addLayer')
    },
    setActiveItem ({ commit }, item) {
      commit('setActiveItem', item)
    }
  }
})

export default store;