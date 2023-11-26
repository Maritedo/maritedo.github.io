import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { type ExtendedRecord } from '../scripts/normal'
import { Albums, FishOutline, Home } from '@vicons/ionicons5'

const legacy = true
const useHash = true//import.meta.env.MODE !== 'development' && legacy
const baseUrl = import.meta.env.BASE_URL

export const routes: ExtendedRecord[] = [
  {
    path: '/',
    name: 'home',
    alias: ['/index', '/index.html', '/home'],
    meta: {
      menuItem: true,
      name: "主页",
      icon: Home
    },
    component: () => import('@/views/TestMain.vue')
  },
  {
    path: '/test',
    name: 'test',
    redirect: '/test/1',
    meta: {
      menuGroup: true,
      name: '测试',
      icon: FishOutline
    },
    children: [
      {
        path: '1',
        name: 'test1',
        meta: {
          name: '测试其一',
          keepAlive: true
        },
        component: () => import('@/views/TestMain.vue')
      }

    ]
  },
  {
    path: '/tool',
    name: 'tool',
    redirect: '/tool/1',
    meta: {
      menuGroup: true,
      name: '功能',
      icon: Albums
    },
    children: [
      {
        path: '1',
        name: 'func1',
        meta: {
          menuItem: true,
          name: "饼图",
          keepAlive: true
        },
        component: () => import('@/views/PieChartTest.vue')
      },
      {
        path: '2',
        name: 'func2',
        meta: {
          menuItem: true,
          name: "不是验证码是识字游戏。",
          keepAlive: true
        },
        component: () => import('@/views/VeriCodeTest.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/PageNotFound.vue')
  }
]

const router = createRouter({
  history: useHash ?
    createWebHashHistory(baseUrl) :
    createWebHistory(baseUrl),
  routes: (routes as unknown) as RouteRecordRaw[],
})
export default router 