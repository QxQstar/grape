import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/app1',
    name: 'home',
    component: Home
  },
  {
    path:'/app1/about',
    component: () => import('../views/about.vue')
  },
  {
    path:'/app1/list',
    component: () => import('../views/list.vue')
  },
  {
    path:'/app1/detail',
    component: () => import('../views/detail.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
