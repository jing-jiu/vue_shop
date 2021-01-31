import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/users.vue'
import roles from '../components/user/roles.vue'
import rights from '../components/user/rights.vue'
import goods from '../components/user/goods.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children:
    [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/roles', component: roles },
      { path: '/rights', component: rights },
      { path: '/goods', component: goods }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  // to：将要访问的路径
  // form：从哪个路径跳转而来
  // next：放行函数
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    return next()
  }
})
export default router
