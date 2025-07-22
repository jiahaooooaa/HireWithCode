import Vue from 'vue'
import VueRouter from 'vue-router'
import welcomeView from '../views/welcomeView.vue'
import interviewguide from '../views/interviewguide.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcomeView',
    component: welcomeView
  },
  {
    path: '/guide',
    name: 'guide',

    component: () => import(/* webpackChunkName: "guide" */ '../views/interviewguide.vue')
  },
  {
    path: '/success',
    name: 'success',
    component: () => import(/* webpackChunkName: "success" */ '../views/finishchallenge.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
