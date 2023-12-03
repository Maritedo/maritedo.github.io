import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { type ExtendedRecord } from '@/scripts/normal'
import {
  Briefcase,
  Home,
  Settings,
  InformationCircle,
  Flask,
  ColorPalette,
  Construct,
  Flash,
  Fish,
  Warning
} from '@vicons/ionicons5'

const legacy = true
const useHash = import.meta.env.MODE !== 'development' && legacy
const baseUrl = import.meta.env.BASE_URL
const defaultTitle = '未命名'

type dispNameMapper = {
  original: string,
  display: string
}
/** 
 * todo 优化算法
 * * 目前时间复杂度O(N*R) => O(N)
 * ? 其中N为面包屑长度，R为路由条目总数
 */
export const getDisplayNames = (names: string[]): dispNameMapper[] => {
  const result: dispNameMapper[] = []
  let curNodes: ExtendedRecord[] | undefined = routes, curNode: ExtendedRecord | undefined
  for (const curName of names)
    if ((curNode = curNodes?.find((v) => (
      v.name == curName || (v.children && v.children.length && v.children[0].name == curName)
    )))) {
      curNodes = curNode.children
      result.push({
        original: curName,
        display: curNode.meta?.title || defaultTitle,
      })
    }
  return result
}

// * 1 叶子节点 具有 component 属性且没有children
// * 2 子树节点 具有 children 属性且不具有 component 属性
// * 3 指针节点 不具有 children 属性和 page 属性但具有 redirect 属性
export const portal: ExtendedRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/PageHome.vue'),
    alias: ['/index', '/index.html', '/home'],
    meta: {
      title: "主页",
      icon: Home
    }
  },
  {
    path: '/dev',
    name: 'dev',
    component: () => import('@/views/GroupDev.vue'),
    meta: {
      title: '开发',
      icon: Construct
    },
    children: [
      {
        path: 'undone',
        name: 'undone',
        meta: {
          title: '测试中项目',
          icon: Flask
        },
        children: [
          {
            path: 'newfolder',
            name: 'newfolder',
            component: () => import('@/views/dev/undone/ColorGame.vue'),
            meta: {
              title: '新建文件夹（1）',
              icon: Fish,
              keepAlive: true
            }
          }
        ]
      },
      {
        path: 'almost',
        name: 'almost',
        meta: {
          title: '几近完成的项目',
          icon: Flash
        },
        children: [
          {
            path: 'colors',
            name: 'colors',
            component: () => import('@/views/dev/undone/ColorPalette.vue'),
            meta: {
              title: '调色板',
              icon: ColorPalette,
              keepAlive: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/tool',
    name: 'tool',
    component: () => import('@/views/GroupTool.vue'),
    meta: {
      title: '工具',
      icon: Briefcase
    },
    children: [
    ]
  },
  {
    path: '/dev404',
    name: 'dev404',
    redirect: '404',
    meta: {
      title: '[DEV]404',
      icon: Warning
    }
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
    component: () => import('@/views/app/AppInfo.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      icon: Settings,
      title: "设置"
    },
    component: () => import('@/views/app/AppSetting.vue')
  }
]
export const result: ExtendedRecord[] = [
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/PageNotFound.vue')
  }
]

export const routes: ExtendedRecord[] = (function (...rawDatas: ExtendedRecord[][]) {
  rawDatas.forEach((function _(datas: ExtendedRecord[]) {
    for (const data of datas)
      if (data.children && data.children.length > 0 && _(data.children) && data.component) {
        const mappedName = `$${String(data.name)}`
        data.children.unshift({
          path: '',
          name: mappedName,
          component: data.component,
          meta: {
            title: data.meta?.title || defaultTitle,
            virtual: true
          }
        })
        data.component = undefined
        data.redirect = { name: mappedName }
      }
    return datas
  }))
  return Array.prototype.concat.apply([] as ExtendedRecord[][], rawDatas)
})(portal, action, result)

const router = createRouter({
  history: useHash ?
    createWebHashHistory(baseUrl) :
    createWebHistory(baseUrl),
  routes: (routes as unknown) as RouteRecordRaw[],
})
export default router