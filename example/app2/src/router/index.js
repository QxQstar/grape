import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/app2',
    name: 'home',
    component: Home
  },
]

const router = new VueRouter({
  routes
})

export default router
