import { h } from 'vue'
import { RouterLink, type RouteRecordRaw, type RouteRecordName } from 'vue-router'
import { type MenuOption, NIcon, type MenuDividerOption, type MenuGroupOption } from 'naive-ui'
import type { AllowedComponentProps, ComponentCustomProps, ComponentOptionsMixin, DefineComponent, EmitsOptions, VNodeProps } from 'vue'

export const lower = (v: string) => String.fromCharCode(v.charCodeAt(0) | 32)
export const upper = (v: string) => String.fromCharCode(v.charCodeAt(0) & 95)
export const conve = (v: string) => String.fromCharCode(v.charCodeAt(0) ^ 32)

export function renderActionOption(title: string, callback?: (e: PointerEvent) => {}) {
  return () => h('a', {
    onclick: (e: PointerEvent) => {
      e.preventDefault()
      callback && callback(e)
    }
  },
    title
  )
}

export class Timer {
  public duration: number;
  public onUpdateCallback: (v: number) => void;
  public onEndCallback: () => void;
  public tickInterval: number;
  public remainedTime;
  private _lastStart: number = 0;
  private _lastTick: number = 0;
  private resetFlag = false;

  private _paused = true;
  public get paused() {
    return this._paused;
  }
  public set paused(val: boolean) {
    this._paused = val;
    if (!val)
      this.__frame__(this);
  }

  constructor(duration: number, onUpdateCallback: (v: number) => void, onEndCallback: () => void, tickInterval: number = 16) {
    this.duration = duration;
    this.remainedTime = duration;
    this.onUpdateCallback = onUpdateCallback;
    this.onEndCallback = onEndCallback;
    this.tickInterval = tickInterval;
  }

  reset() {
    if (this.paused) {
      this.__reset__();
    } else {
      this.resetFlag = true;
      this.paused = true;
    }
  }

  __reset__() {
    this.resetFlag = false;
    this.remainedTime = this.duration;
  }

  start() {
    if (this.paused) {
      this.onUpdateCallback(this.remainedTime);
      this._lastStart = Date.now();
      this._lastTick = this._lastStart;
      this.paused = false;
    }
  }

  pause() {
    this.paused = true;
  }

  __frame__(timer: Timer) {
    if (!timer.paused) {
      const timeNow = Date.now();
      const timeLasted = timeNow - timer._lastStart
      if (timeLasted < timer.remainedTime) {
        if (timeNow - timer._lastTick >= timer.tickInterval) {
          timer._lastTick = timeNow;
          timer.onUpdateCallback(timer.remainedTime - timeLasted);
        }
        requestAnimationFrame(() => timer.__frame__(timer));
      } else {
        timer.__end__();
      }
    } else {
      if (timer.resetFlag) {
        timer.__reset__();
      } else {
        timer.remainedTime -= (Date.now() - timer._lastStart);
      }
    }
  }

  __end__() {
    this.remainedTime = 0;
    this.paused = true;
    this.onUpdateCallback(0);
    this.onEndCallback();
  }
}


export function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}


export function renderLink(label: string, to: RouteRecordName | undefined) {
  return () => h(RouterLink, { to: { name: to } }, { default: () => label })
}


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

export const simulateClick = (ele: HTMLElement | Element) => {
  ele.dispatchEvent(new PointerEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true
  }))
}

export type ExtendedRecord = RouteRecordRaw & {
  meta?: {
    title: string,
    virtual?: boolean, // 针对具有自己的页面的树节点自动建立的虚拟子节点使用的判别属性
    icon?: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<any>, {}, {}>,
    [key: string]: any // 其他属性
  },
  children?: ExtendedRecord[],
}

export type DiversedOption = MenuOption | MenuDividerOption | MenuGroupOption
export const genMenuOptions = (records: ExtendedRecord[]): DiversedOption[] => {
  const result: DiversedOption[] = []
  for (const route of records) {
    const m = route.meta
    if (m && !m.virtual)
      result.push({
        label: (route.name && route.component || route.redirect) ? renderLink(m.title, route.name) : () => h('a', { innerText: m.title }),
        key: String(route.name),
        icon: m.icon ? renderIcon(m.icon) : undefined,
        children: route.children && route.children.length ? genMenuOptions(route.children) : undefined
      })
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

export function getOverrided<T>(origin: T, overrides: object) {
  return Object.assign(Object.assign({}, origin), overrides) as T
}

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