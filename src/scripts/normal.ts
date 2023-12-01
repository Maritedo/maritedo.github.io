import { h } from 'vue'
import { RouterLink, type RouteRecordRaw, type RouteRecordName } from 'vue-router'
import { type MenuOption, NIcon } from 'naive-ui'
import type { AllowedComponentProps, ComponentCustomProps, ComponentOptionsMixin, DefineComponent, EmitsOptions, VNodeProps } from 'vue'

export const renderActionOption = (title: string, callback: (e: PointerEvent) => {}) =>
  () => h('a', {
    onclick: (e: PointerEvent) => {
      e.preventDefault()
      callback(e)
    }
  },
    title
  )

export const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const renderLink = (label: string, to: RouteRecordName | undefined, key = to) => ({
  label: () => h(RouterLink, { to: { name: to } }, { default: () => label }),
  key: String(key)
})

export const configureThemeColor = (color: string) => {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color)
  })
}

export const getArgs = () => {
  const args: { [key: string]: string } = {}
  decodeURI(document.URL).split("?")[1].split("&").forEach((e) => {
    const [a, b] = e.split("=")
    args[a] = b
  })
  return args
}

export const simulateClick = (ele: HTMLElement) => {
  ele.dispatchEvent(new PointerEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true
  }))
}

export type ExtendedRecord = RouteRecordRaw & {
  meta?: {
    title: string,
    icon?: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<any>, {}, {}>,
    menuDefault?: boolean,
    menuGroup?: boolean,
    keepAlive?: boolean,
    [key: string]: any
  },
  page?: () => Promise<any>,
  children?: ExtendedRecord[],
}

export const genMenuOptions = (records: ExtendedRecord[]): MenuOption[] => {
  const result = new Array<MenuOption>
  for (const route of records) {
    const m = route.meta
    if (m && !m.menuDefault) {
      const link = renderLink(
        m.title,
        (route.children && route.children[0].meta?.menuDefault) ? route.children[0].name : route.name)
      const option: MenuOption = {
        label: link.label,
        key: link.key
      }
      if (m.icon)
        option.icon = renderIcon(m.icon)
      if (route.children)
        option.children = genMenuOptions(route.children)
      result.push(option)
    }
  }
  return result
}

export const propIsTrue = (val: string | boolean | null) => {
  if (typeof (val) == 'string')
    return (val == '' || val.toLowerCase() == 'true')
  else
    return val === null ? false : val
}

export const addClassTo = (element: HTMLElement) => (className: string) => element.classList.add(className)

export const keepIn = (x: number, _min: number, _max: number) => {
  return Math.max(Math.min(_max, x), _min)
}

const rate1 = .7, rate2 = .1
const cmin = 255 * rate1, cmax = 255 - 255 * rate2
const range = [0, 255]
const _r = range[1] - range[0]

export const randomColor = () => {
  const _vals: number[] = []
  for (let _i = 0; _i < 3; _i++)
    _vals.push(range[0] + Math.round(Math.random() * _r))
  const imin = _vals[0] > _vals[1] ? (_vals[1] >= _vals[2] ? 2 : 1) : (_vals[0] > _vals[2] ? 2 : 0)
  const imax = _vals[0] < _vals[1] ? (_vals[1] <= _vals[2] ? 2 : 1) : (_vals[0] < _vals[2] ? 2 : 0)
  if (_vals[imax] < cmin) _vals[imax] = cmax
  if (_vals[imin] > cmax) _vals[imin] = cmin
  return {
    R: _vals[0],
    G: _vals[1],
    B: _vals[2]
  }
}

export const getDPI = (/* ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D */) => {
  return window.devicePixelRatio || 1// Dece / (ctx.backingStorePixelRatio || 1)
}

export const Rec = (r: number, theta: number) => ({
  x: Math.cos(theta) * r,
  y: Math.sin(theta) * r
})

export const Pol = (x: number, y: number) => ({
  r: Math.sqrt(x ** 2 + y ** 2),
  theta: Math.atan2(y, x) % 360
})

export const random = {
  chars: "112233445566778899abcdefghijkmnrtuyzABDEFGHIJKLMNQRTVY",
  fonts: [
    'century',
    'monaco',
    'verdana',
    'sans-serif',
    'sans',
    'copperplate'
  ],
  char: () => {
    return random.chars[Math.round(Math.random() * (random.chars.length - 1))]
  },
  color: (opacity: number) => {
    const c = randomColor()
    return opacity ?
      `rgba(${c.R}, ${c.G}, ${c.B}, 0.7)` :
      `rgb(${c.R}, ${c.G}, ${c.B})`
  },
  size: (_fontH: number) => {
    return _fontH * 1.0 * (1 + Math.random() / 5)
  },
  angle: () => {
    return (2 * Math.random() - 1) * Math.PI / 12
  },
  offset: (_fontH: number, _fontW: number) => {
    const _p = 0.125
    return {
      x: Math.random() * _p * _fontW,
      y: Math.random() * _p * _fontH
    }
  },
  font: () => {
    return random.fonts[Math.round(Math.random() * (random.fonts.length - 1))]
  },
}

export const between = (val: number, val1: number, val2: number) => {
  return val1 <= val2 ?
    (val1 <= val && val <= val2) :
    (val2 <= val && val <= val1)
}