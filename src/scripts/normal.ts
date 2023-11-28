import { h } from 'vue'
import { RouterLink, type RouteRecordRaw, type RouteRecordName } from 'vue-router'
import { type MenuOption, NIcon } from 'naive-ui'

import type { AllowedComponentProps, ComponentCustomProps, ComponentOptionsMixin, DefineComponent, EmitsOptions, VNodeProps } from 'vue'

export const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const renderLink = (label: string, to: RouteRecordName | undefined, key = to) => {
  return {
    label: () => h(RouterLink, { to: { name: to } }, { default: () => label }),
    key: String(key)
  }
}

export const configureThemeColor = (color: string) => {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color);
  })
}

export const getArgs = () => {
  const args: { [key: string]: string } = {};
  decodeURI(document.URL).split("?")[1].split("&").forEach((e) => {
    const [a, b] = e.split("=");
    args[a] = b;
  });
  return args
}


export type ExtendedRecord = RouteRecordRaw & {
  meta?: {
    title: string,
    menuDefault?: boolean,
    menuGroup?: boolean,
    epAlive?: boolean,
    icon?: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<any>, {}, {}>,
    [key: string]: any
  },
  page?: () => Promise<any>,
  children?: ExtendedRecord[],
}

export const genMenuOptions = (records: ExtendedRecord[]): MenuOption[] => {
  const result = new Array<MenuOption>;
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