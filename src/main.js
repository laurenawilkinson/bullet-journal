import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './styles/main.scss'
import * as svgicon from 'vue-svgicon';
import './stores/store'

Vue.config.productionTip = false

Vue.use(svgicon);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
