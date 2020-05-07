import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layers: 0,
    currentPage: 1,
    pages: [],
    activeItem: null,
    keepAlive: false
  },
  getters: {
    activeItemProps (state) {
      if (state.activeItem == null) return null;

      let props = {}
      
      state.activeItem.options.forEach(x => {
        props[x.prop] = x.value
      });

      return props;
    },
    currentPageObj (state) {
      let found = state.pages.find(x => x.id === state.currentPage);
      return found ? found : null;
    }
  },
  mutations: {
    addLayer (state) {
      state.layers += 1;
    },
    setActiveItem (state, item) { 
      state.activeItem = item;
    },
    setActivePage (state, number) { 
      state.currentPage = number;
    },
    setKeepAlive (state, value) { 
      state.keepAlive = value;
    },
    setActivePropValue (state, { prop, value }) {
      if (state.activeItem == null || !state.activeItem.options[prop]) return;
      state.activeItem.options[prop] = value;
    },
    updatePages (state, value) {
      state.pages = value;
    }
  },
  actions: {
    async addLayer ({ commit }) {
      commit('addLayer')
    },
    setActiveItem ({ commit }, item) {
      commit('setActiveItem', item)
    },
    setActivePage ({ commit }, number) {
      commit('setActivePage', number)
    },
    updateActiveItemOptions({ commit }, options) {
      for (const opt in options) {
        commit('setActivePropValue', { prop: opt.text, value: opt.value })
      }
    },
    updateActiveItemOption ({ commit }, { prop, value }) {
      commit('setActivePropValue', { prop, value })
    },
    keepAlive ({ commit }, value) {
      commit('setKeepAlive', value)
    },
    updatePages ({ commit}, value) {
      commit('updatePages', value)
    }
  }
})

export default store;