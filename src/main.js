import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载全局样式文件
import './styles/index.less'
// 加载 element 组件库
import ElementUI from 'element-ui'
// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.prototype.$axios = axios

// 全局注册 element 组件库
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
