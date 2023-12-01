import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { type ExtendedRecord } from '../scripts/normal'
import {
  Albums,
  Fish,
  Home,
  Settings,
  InformationCircle
} from '@vicons/ionicons5'

const legacy = true
const useHash = import.meta.env.MODE !== 'development' && legacy
const baseUrl = import.meta.env.BASE_URL
const defaultTitle = '未命名'

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

export const menu = [
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
      icon: Fish
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
            name: '0',
            path: 'emm',
            component: () => import('@/views/TestMulti.vue'),
            meta: {
              keepAlive: true,
              title: '测试其一·嵌套'
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
          title: "不是验证码。",
          keepAlive: true
        },
        component: () => import('@/views/VeriCodeTest.vue')
      }
    ]
  }
]
export const action: ExtendedRecord[] = [
  {
    path: '/about',
    name: 'about',
    meta: {
      icon: InformationCircle,
      title: "关于"
    },
    component: () => import('@/views/AppSetting.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      icon: Settings,
      title: "设置"
    },
    component: () => import('@/views/AppSetting.vue')
  }
]
export const result: ExtendedRecord[] = [
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/PageNotFound.vue')
  }
]
export const routes: ExtendedRecord[] = (function (...v: ExtendedRecord[][]) {
  v.forEach((function _(datas: ExtendedRecord[]) {
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
  }))
  return (function (...rawDatas: ExtendedRecord[][]) {
    let result: ExtendedRecord[] = []
    for (const item of rawDatas) {
      result = result.concat(item)
    }
    return result
  })(...v)
})(menu, action, result)

const router = createRouter({
  history: useHash ?
    createWebHashHistory(baseUrl) :
    createWebHistory(baseUrl),
  routes: (routes as unknown) as RouteRecordRaw[],
})
export default router