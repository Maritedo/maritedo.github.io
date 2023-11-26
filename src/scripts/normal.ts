import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { type MenuOption, NIcon } from 'naive-ui'

import type { AllowedComponentProps, ComponentCustomProps, ComponentOptionsMixin, DefineComponent, EmitsOptions, VNodeProps } from 'vue'

export const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const renderLink = (label: string, to: string, key: string = to) => {
  return {
    label: () => h(RouterLink, { to: { name: to } }, { default: () => label }),
    key: key
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

export type ExtendedRecord = {
  path: string,
  name: string,
  alias?: string[],
  redirect?: string,
  meta?: {
    menuGroup?: boolean,
    menuItem?: boolean | undefined,
    name: string,
    icon?: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<any>, {}, {}>,
    keepAlive?: boolean,
    [key: string]: any
  },
  component?: () => Promise<any>
  children?: ExtendedRecord[],
}

export const genMenuOptions = (records: ExtendedRecord[]): MenuOption[] => {
  const result = new Array<MenuOption>;
  for (const route of records) {
    const m = route.meta
    if (m) {
      const link = renderLink(m.name, route.name)
      const option: MenuOption = {
        label: link.label,
        key: link.key
      }
      if (m.icon) option.icon = renderIcon(m.icon)
      if (route.children) option.children = genMenuOptions(route.children)
      result.push(option)
    }
  }
  return result
}