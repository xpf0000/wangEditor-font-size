import Vue from 'vue'
import App from './App'
import E from 'wangeditor'
import FontSizeMenu from './FontSizeMenu'
E.registerMenu('font-size', FontSizeMenu)
new Vue({
  el: '#app',
  render: (h) => h(App)
})
