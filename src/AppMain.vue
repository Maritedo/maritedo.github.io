<template>
  <n-config-provider fullH :theme="appConfig.curTheme">
    <n-layout class="n-container" content-style="display: flex; flex-direction: column;" fullH>
      <n-layout-header class="n-header" bordered @click.prevent style="box-shadow: var(--box-shadow-1)">
        <n-page-header @back="appRouter.go(-1)">
          <template #title>
            <n-breadcrumb class="breadcrumb">
              <n-breadcrumb-item :clickable="false"> 测试应用 </n-breadcrumb-item>
              <transition name="breadcrumb" v-for="(name, index) in getDisplayNames(section)" :key="index">
                <n-breadcrumb-item :key="name.original" @click.prevent="onBreadcurmbClick">
                  <router-link :to="{ name: name.original }">
                    {{ name.display }}
                  </router-link>
                </n-breadcrumb-item>
              </transition>
            </n-breadcrumb>
          </template>
          <template #extra>
            <n-switch :rail-style="dayNightRail" :value="appConfig.useDark" @update:value="appConfig.changeTheme()">
              <template #checked>
                <n-icon size="large">
                  <MoonIcon />
                </n-icon>
              </template>
              <template #unchecked>
                <n-icon size="large">
                  <SunIcon />
                </n-icon>
              </template>
            </n-switch>
          </template>
        </n-page-header>
      </n-layout-header>
      <n-layout class="n-main" has-sider>
        <n-layout-sider class="n-sider" collapse-mode="width" bordered show-trigger>
          <div class="i-wrapper">
            <n-menu ref="menuRef" class="i-menu" :options="menuOptions" :default-expanded-keys="defaultExpandedKeys"
              :value="curPage" />
            <div class="i-actions">
              <n-menu ref="actionRef" class="i-action-menu" :options="actionsOptions" :value="curAction">
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
              <keep-alive v-if="$route.meta.keepAlive">
                <component class="i-content" :is="Component" :key="route.path" />
              </keep-alive>
              <component class="i-content" v-else :is="Component" :key="route.path"></component>
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
import type { MenuOption, NBreadcrumb } from 'naive-ui'
import {
  Moon as MoonIcon,
  Sunny as SunIcon,
  PersonCircle
} from '@vicons/ionicons5'
import { RouterView, useRouter } from 'vue-router'
import { menu, action, getDisplayNames } from '@/router/index'
import { useConfigStore as useConfigs } from '@/stores/configs'
import { configureThemeColor, simulateClick, genMenuOptions as genMenu, type ExtendedRecord } from '@/scripts/normal'

const menuRef: Ref<null | typeof NMenu> = ref(null)
const actionRef: Ref<null | typeof NMenu> = ref(null)
const curPage: Ref<any> = ref()
const curAction: Ref<any> = ref()
const section: Ref<string[]> = ref([])

const themeVars = useThemeVars()
const appConfig = useConfigs()
const appRouter = useRouter()
const appNotify = useNotification()

appRouter.beforeEach((to) => {
  const nav = (v: Ref, t: Ref<any>) => {
    if (v.value && to.name && !(to.name in v.value.activePath))
      v.value.showOption(to.name)
    t.value = to.name
    setTimeout(() => {
      section.value = v.value?.activePath || []
    })
  }
  curPage.value = curAction.value = null;
  switch (([action, menu]).find((v) => {
    return (function _(vals: ExtendedRecord[]) {
      for (const val of vals) {
        if (val.name == to.name) return true
        else if (val.children && _(val.children)) return true
      }
      return false
    })(v)
  })) {
    case action: nav(actionRef, curAction); break;
    case menu: nav(menuRef, curPage); break;
  }
  return to.name ? appRouter.hasRoute(to.name) : false
})


const menuOptions: MenuOption[] = genMenu(menu)
const actionsOptions: MenuOption[] = genMenu(action)
const defaultExpandedKeys: string[] = []

const onBreadcurmbClick = (e: PointerEvent) => {
  const element = e.target as HTMLElement
  if (element instanceof HTMLSpanElement) {
    const a = element.querySelector('a')
    a && simulateClick(a)
  }
}

const dayNightRail = (info: any) => ({
  backgroundColor: info.checked ? '#bdc6ce' : '#ffd700'
})

onMounted(() => {
  if (appConfig.firstRun) {
    appConfig.firstRun = false
    appNotify.info({
      content: '你好！',
      duration: 2560
    })
  }
  watch(
    computed(() => appConfig.useDark),
    (v) => {
      const themeColor = v ? darkTheme.common.baseColor : themeVars.value.baseColor
      configureThemeColor(themeColor)
    },
    { immediate: true }
  )
})
</script>

<style scoped lang="scss">
.n-container {
  .n-header {
    padding: 12px;
  }

  .n-header,
  .n-sider {
    user-select: none;
  }

  .n-main {
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
  width: 100%;
  height: 100%;
  flex-direction: column;

  .i-menu {
    text-align: left;
    flex: 1 0 auto;
  }

  .i-actions {

    .i-action-menu {
      width: 100%;
    }

    .i-action-shortcuts {
      height: 42px;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      flex: 1;
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
</style>
