import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './styles/main.scss'
import * as svgicon from 'vue-svgicon';
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

Vue.config.productionTip = false

Vue.use(svgicon);

import store from './stores/store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
