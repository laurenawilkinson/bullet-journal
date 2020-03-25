import store from '@/stores/store';

export default class Stackable {
  constructor (order) {
    if (!order) {
      store.dispatch('addLayer');
      this.order = store.state.layers;
    } else {
      this.order = order;
    }
  }
} 