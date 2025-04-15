import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OutputView from '../views/OutputView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Let Me GPT That For You'
      }
    },
    {
      path: '/output',
      name: 'output',
      component: OutputView,
      meta: {
        title: 'Showing How to GPT'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - LMGPTTFY`
  next()
})

export default router