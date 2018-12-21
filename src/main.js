import Vue from 'vue'
import App from './App.vue'
import '@/assets/styles/reset.less'
import store from './store'
import router from './router'
import 'mint-ui/lib/style.css'
Vue.config.productionTip = false

// 运行时动态设置
pageResize()
window.onresize = pageResize;

function pageResize() { 
  let fontSize = Math.min(screen.width, document.documentElement.getBoundingClientRect().width) / 375 * 16
  document.documentElement.style.fontSize = (fontSize >= 32 ? 32 : fontSize) + 'px'
}


new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')