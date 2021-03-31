import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
// import { component } from 'vue/types/umd'
import Welcome from '../components/Welcome'
import User from '../components/user/User.vue' 
import Logintest from '../components/test/Logintest'
// import { component } from 'vue/types/umd'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Good from '../components/goods/Good.vue'
import Order from '../components/order/Order'
import Data from '../components/Data/Data.vue'
// import { component } from 'vue/types/umd'
import Addgood from '../components/goods/Addgood.vue'



Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:User
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
          path:'/params',
          component:Params
      },
      {
        path:'/goods',
        component:Good
      },
      {
        path:'/orders',
        component:Order
      },
      {
        path:'/reports',
        component:Data
      },
      {
        path:'/goods/add',
        component:Addgood
      }
    ]
  },
  {
    path:'/test',
    component:Logintest
  },
]
const router = new VueRouter({
  routes,
  mode:'history'
})
// 路由导航守卫控制页面的访问权限
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  //获取token
  const tokenstr =  window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})

export default router
