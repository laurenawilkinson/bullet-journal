import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    layers: 0,
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
    }
  },
  mutations: {
    addLayer (state) {
      state.layers += 1;
    },
    setActiveItem (state, item) { 
      state.activeItem = item;
    },
    setKeepAlive (state, value) { 
      state.keepAlive = value;
    },
    setActivePropValue (state, { prop, value }) {
      if (state.activeItem == null) return;

      const found = state.activeItem.options.findIndex(x => x.text === prop);
      if (found > -1) state.activeItem.options[found].value = value;
    }
  },
  actions: {
    async addLayer ({ commit }) {
      commit('addLayer')
    },
    setActiveItem ({ commit }, item) {
      commit('setActiveItem', item)
    },
    updateActiveItemOptions({ commit }, options) {
      for (const opt in options) {
        commit('setActivePropValue', { prop: opt.text, value: opt.value })
      }
    },
    keepAlive ({ commit }, value) {
      commit('setKeepAlive', value)
    }
  }
})

export default store;