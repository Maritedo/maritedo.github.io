import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { type ExtendedRecord } from '../scripts/normal'
import { Albums, FishOutline, Home } from '@vicons/ionicons5'

const legacy = true
const useHash = import.meta.env.MODE !== 'development' && legacy
const baseUrl = import.meta.env.BASE_URL
const defaultTitle = 'Unnamed'

export const getDisplayNames = (names: string[]): { original: string, display: string }[] => {
  const result: { original: string, display: string }[] = []
  let curNode: ExtendedRecord[] | undefined = routes
  for (const curName of names) {
    curNode = curNode?.find((v: ExtendedRecord) => {
      if (v.name == curName || v.page && v.children && v.children[0].name == curName) {
        result.push({
          original: curName,
          display: v.meta?.title || defaultTitle
        })
        return true
      }
      return false
    })?.children
    if (!curNode) break
  }
  return result
}

export const routes: ExtendedRecord[] = (function _(datas: ExtendedRecord[]) {
  for (const data of datas)
    if (data.children && _(data.children))
      data.page && data.children.unshift({
        path: '',
        name: `$${String(data.name)}`,
        component: data.page,
        meta: {
          title: data.meta?.title || defaultTitle,
          menuDefault: true
        }
      })
  return datas
})([
  {
    path: '/',
    name: 'home',
    alias: ['/index', '/index.html', '/home'],
    meta: {
      title: "主页",
      icon: Home
    },
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/test',
    name: 'test',
    meta: {
      title: '测试集',
      icon: FishOutline
    },
    page: () => import('@/views/TestGroup.vue'),
    children: [
      {
        path: '1',
        name: 'test1',
        meta: {
          title: '测试其一',
          keepAlive: true
        },
        page: () => import('@/views/ColorGame.vue'),
        children: [
          {
            name: 'emm',
            path: '000',
            component: () => import('@/views/TestMain.vue'),
            meta: {
              title: '测试嵌套'
            }
          }
        ]
      },
      {
        path: '2',
        name: 'test2',
        meta: {
          title: '测试其二',
          keepAlive: true
        },
        component: () => import('@/views/TestMain.vue')
      }
    ]
  },
  {
    path: '/tool',
    name: 'tool',
    meta: {
      title: '功能',
      icon: Albums
    },
    page: () => import('@/views/ToolGroup.vue'),
    children: [
      {
        path: '1',
        name: 'func1',
        meta: {
          title: "饼图",
          keepAlive: true
        },
        component: () => import('@/views/PieChartTest.vue')
      },
      {
        path: '2',
        name: 'func2',
        meta: {
          title: "不是验证码是识字游戏。",
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
])

const router = createRouter({
  history: useHash ?
    createWebHashHistory(baseUrl) :
    createWebHistory(baseUrl),
  routes: (routes as unknown) as RouteRecordRaw[],
})
export default router