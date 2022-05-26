import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./scene/Server.vue') },
  { path: '/log', component: () => import('./scene/Log.vue') },
  { path: '/setting', component: () => import('./scene/Setting.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
