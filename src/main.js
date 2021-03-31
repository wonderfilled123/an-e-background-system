import Vue from 'vue'
import App from './App.vue'
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//只有router是小写
import router from './router/index.js'
import './assets/css/global.css'
import axios from 'axios'
import { MessageBox } from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入进度条加载插件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// import { config } from 'vue/types/umd';

Vue.component('tree-table', TreeTable)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
// 通过这行代码，每一个vue组件都可以通过this直接访问到$http从而发起ajax请求

// 在request 拦截器中展示进度条
axios.interceptors.request.use(config=>{
  console.log(config);
  Nprogress.start()
  config.headers.Authorization= window.sessionStorage.getItem('token')
  return config
})

// 在respose 拦截器中 隐藏进度条

axios.interceptors.response.use(config=>{
  Nprogress.done()
  return config
})
//  挂载原型对象
Vue.prototype.$http=axios
//设置请求根路径
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1'
// 为vue的原型对象挂载弹出框
Vue.prototype.$message=Message
Vue.config.productionTip = false
Vue.prototype.$confirm=MessageBox.confirm


// 注册全局的过滤器

Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y =dt.getFullYear()
  const m =(dt.getMonth()+1+'').padStart(2,'0')
  const d =(dt.getDate()+'').padStart(2,'0')

  const hh =(dt.getHours()+'').padStart(2,'0')
  const mm =(dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
