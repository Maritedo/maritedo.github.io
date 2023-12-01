import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { type ExtendedRecord } from '@/scripts/normal'
import {
  Briefcase,
  Home,
  Settings,
  InformationCircle,
  Flask,
  ColorPalette,
  Construct
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
    component: () => import('@/views/PageHome.vue')
  },
  {
    path: '/dev',
    name: 'dev',
    meta: {
      title: '开发',
      icon: Construct
    },
    page: () => import('@/views/GroupDev.vue'),
    children: [
      {
        path: 'undone',
        name: 'undone',
        meta: {
          title: '测试中项目',
          icon: Flask
        },
        // page: () => ,
        children: [
          {
            path: 'distinguish',
            name: 'distinguish',
            meta: {
              title: '辩色龙',
              icon: ColorPalette,
              keepAlive: true
            },
            component: () => import('@/views/dev/undone/ColorGame.vue')
          },
          {
            path: 'colors',
            name: 'colors',
            meta: {
              title: '调色板',
              icon: ColorPalette,
              keepAlive: true
            },
            component: () => import('@/views/dev/undone/ColorPalette.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/tool',
    name: 'tool',
    meta: {
      title: '工具',
      icon: Briefcase
    },
    page: () => import('@/views/GroupTool.vue'),
    children: [
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
    component: () => import('@/views/app/AppSetting.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      icon: Settings,
      title: "设置"
    },
    component: () => import('@/views/app/AppInfo.vue')
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
            virtual: true
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