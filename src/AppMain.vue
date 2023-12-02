<template>
  <n-config-provider fullH :theme="appConfig.currentTheme">
    <n-layout class="n-container" content-style="display: flex; flex-direction: column;" fullH>
      <n-layout-header class="n-header" bordered @click.prevent>
        <n-page-header class="n-header-bar" @back="appRouter.go(-1)">
          <template #title>
            <n-breadcrumb class="breadcrumb">
              <n-breadcrumb-item :clickable="false"> 测试应用 </n-breadcrumb-item>
              <transition name="breadcrumb" v-for="(name, index) in getDisplayNames(section)" :key="index">
                <n-breadcrumb-item none-drag-area :key="name.original" @click.prevent="onBreadcurmbClick">
                  <router-link :to="{ name: name.original }">
                    {{ name.display }}
                  </router-link>
                </n-breadcrumb-item>
              </transition>
            </n-breadcrumb>
          </template>
          <template #extra>
            <div class="n-header-dragarea"></div>
          </template>
        </n-page-header>
      </n-layout-header>
      <n-layout class="n-main" has-sider>
        <n-layout-sider :native-scrollbar="false" content-style="height: 100%" class="n-sider" collapse-mode="width"
          bordered show-trigger>
          <div class="i-wrapper">
            <n-layout :native-scrollbar="false">
              <n-menu ref="portalRef" class="i-menu" :options="portalOptions || []" :value="currentPortal" />
            </n-layout>
            <div class="i-actions">
              <n-menu ref="actionRef" class="i-action-menu" :options="actionOptions || []" :value="currentAction">
              </n-menu>
              <!-- <n-space :wrap="false" :wrap-item="true" justify="space-between" class="i-action-shortcuts">
                <n-button text strong secondary>
                  <template #icon>
                    <n-icon size="30px">
                      <person-circle />
                    </n-icon>
                  </template>
                </n-button>
              </n-space> -->
            </div>
          </div>
        </n-layout-sider>
        <n-layout-content class="n-content router-root" :native-scrollbar="false">
          <router-view v-slot="{ Component, route }">
            <transition name="fade">
              <keep-alive v-if="appConfig.keepAlive">
                <component class="i-content" :is="Component" :key="route.path" />
              </keep-alive>
              <component v-else class="i-content" :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { type Ref, ref, computed, watch, onMounted } from 'vue'
import { useNotification, useThemeVars, darkTheme, NMenu } from 'naive-ui'
import type { MenuDividerOption, NBreadcrumb } from 'naive-ui'
import { RouterView, useRouter, type RouteLocationNormalized } from 'vue-router'
import { portal, action, getDisplayNames } from '@/router/index'
import { useConfigStore as useConfigs } from '@/stores/configs'
import { configureThemeColor, simulateClick, genMenuOptions as genMenu, type ExtendedRecord, type DiversedOption, getOverrided } from '@/scripts/normal'

const portalRef: Ref<null | typeof NMenu> = ref(null)
const actionRef: Ref<null | typeof NMenu> = ref(null)
const currentPortal: Ref<any> = ref()
const currentAction: Ref<any> = ref()
const section: Ref<string[]> = ref([])

const appThemes = useThemeVars()
const appConfig = useConfigs()
const appRouter = useRouter()
const appNotify = useNotification()

var portalOptions: DiversedOption[], actionOptions: DiversedOption[]

appRouter.beforeEach((to: RouteLocationNormalized) => {
  let handledName: string | undefined = undefined
  const nav = (v: Ref, t: Ref<any>) => {
    if (v.value && to.name && !(to.name in v.value.activePath))
      v.value.showOption(handledName)
    t.value = handledName
    setTimeout(() => {
      section.value = v.value?.activePath || []
    })
  }
  enum loc {
    NOTFOUND,
    FOUND,
    VIRTUAL
  }
  currentPortal.value = currentAction.value = null;
  switch (([action, portal]).find((v) => {
    return (function _(vals: ExtendedRecord[]): loc {
      for (const val of vals) {
        if (val.name == to.name) {
          if (val.meta?.virtual)
            return loc.VIRTUAL
          handledName = String(val.name)
          return loc.FOUND
        }
        else if (val.children) {
          const i = _(val.children)
          if (i == loc.VIRTUAL)
            handledName = String(val.name)
          if (i != loc.NOTFOUND)
            return loc.FOUND
        }
      }
      return loc.NOTFOUND
    }).apply(null, [v]) != loc.NOTFOUND
  })) {
    case action: nav(actionRef, currentAction); break;
    case portal: nav(portalRef, currentPortal); break;
  }
  return to.name ? appRouter.hasRoute(to.name) : false
})

const divider: MenuDividerOption = {
  type: 'divider'
}
const appendDivider = (function _(items: DiversedOption[], options: { top?: boolean, bottom?: boolean, children?: boolean, indent?: number }) {
  const _options = Object.assign({
    top: false,
    bottom: true,
    children: false,
    indent: 32,
    last: true,
    offset: 0,
    root: true
  }, options)
  const _divider = _options.root ? divider : getOverrided(divider, {
    props: {
      style: {
        marginLeft: /** NaiveUI菜单分割线MarginLeft默认值*/18 + _options.offset + 'px'
      }
    }
  })
  const result: DiversedOption[] = []
  if (_options.top) result.push(_divider)
  for (var index = 0; index < items.length; index++) {
    let item = items[index]
    /** 
     * !此处 item.children 类型为 DiversedOption[], 系 VS Code 类型推断漏洞
    */
    if (_options.children && item.children)
      item.children = _(item.children as DiversedOption[], getOverrided(_options, {
        offset: _options.offset + _options.indent,
        bottom: false,
        last: false,
        root: false
      }))
    result.push(item, _divider)
  }
  result.pop()
  if (_options.bottom) result.push(_divider)
  return result;
})

const onBreadcurmbClick = (e: PointerEvent) => {
  const element = e.target as HTMLElement
  if (element instanceof HTMLSpanElement) {
    const a = element.children[0]
    a && simulateClick(a)
  }
}

// const dayNightRail = (info: any) => ({
//   backgroundColor: info.checked ? '#bdc6ce' : '#ffd700'
// })

onMounted(() => {
  portalOptions = appendDivider(genMenu(portal), {
    children: true,
    top: false,
    bottom: true,
    indent: portalRef.value?.indent
  })
  actionOptions = appendDivider(genMenu(action), {
    children: false,
    top: false,
    bottom: false
  })
  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQueryList.addEventListener('change', (evt) => {
    appConfig.osTheme = evt.matches ? 'dark' : 'light'
    console.log(appConfig.osTheme)
  })
  if (appConfig.firstRun) {
    appConfig.firstRun = false
    appNotify.info({
      content: '你好！',
      duration: 2560
    })
  }
  watch(
    computed(() => appConfig.useDarkTheme),
    (v) => {
      const themeColor = v ? darkTheme.common.cardColor : appThemes.value.baseColor
      console.log(darkTheme.common)
      configureThemeColor(themeColor)
    },
    { immediate: true }
  )
})
</script>

<style scoped lang="scss">
.n-container {
  .n-header {
    -webkit-app-region: drag;
    justify-content: center;
    padding: auto;
    padding-left: 12px;
    height: calc(env(titlebar-area-height, 28px) + .5px);

    .n-header-bar {
      height: 100%;

      *[none-drag-area]:not(:last-child) {
        -webkit-app-region: none;
      }
    }

    .n-header-dragerea {
      height: 100%;
      width: 100%;
    }
  }

  .n-header,
  .n-sider {
    user-select: none;
  }

  .n-main {
    height: calc(100% - env(titlebar-area-height, 48px) - .5px);
    position: relative;

    .n-content {
      overflow-y: auto;
    }
  }
}

.i-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}


.i-wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;

  .i-menu {
    text-align: left;
  }

  .i-actions {

    .i-action-menu {
      text-align: left;
    }
  }

}

.fade-enter-to,
.fade-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease;
  position: absolute;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.breadcrumb-enter-to,
.breadcrumb-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateY(+100%);
}

.breadcrumb-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.breadcrumb-leave-active,
.breadcrumb-enter-active {
  transition: all 0.2s ease;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>

<style lang="scss">
.breadcrumb-leave-active:nth-last-child(2)>span:last-child {
  display: none;
}

.router-root .n-scrollbar-content {
  width: 100%;
  height: 100%;
}

.n-menu--collapsed .n-menu-item-content__icon {
  // 修正菜单收起时使用鼠标操作会出现的错位问题
  margin-right: auto !important;
}

.n-header-bar .n-page-header {
  height: 100%;
}
</style>
