<template>
  <n-config-provider fullH :theme="theme">
    <n-layout class="n-container" content-style="display: flex; flex-direction: column;" fullH>
      <n-layout-header class="n-header" bordered @click.prevent style="box-shadow: var(--box-shadow-1);">
        <n-page-header @back="appRouter.go(-1)">
          <template #title>
            <n-breadcrumb class="breadcrumb">
              <n-breadcrumb-item :clickable="false">
                测试应用
              </n-breadcrumb-item>
              <transition name="breadcrumb" v-for="(name, index) in getDisplayNames(menuRef?.activePath || [])"
                :key="index">
                <n-breadcrumb-item :key="name.original" @click.prevent="onBreadcurmbClick">
                  <router-link :to="{ name: name.original }">
                    {{ name.display }}
                  </router-link>
                </n-breadcrumb-item>
              </transition>
            </n-breadcrumb>
          </template>
          <template #extra>
            <n-switch :rail-style="dayNightRail" v-model:value="useDark">
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
          <n-menu ref="menuRef" :options="menuOptions" :default-expanded-keys="defaultExpandedKeys" :value="curPage"
            class="i-menu" />
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
import { useOsTheme, darkTheme, NIcon, useThemeVars, NMenu } from 'naive-ui'
import type { MenuOption, GlobalTheme, NBreadcrumb } from 'naive-ui'
import {
  Moon as MoonIcon,
  Sunny as SunIcon,
} from '@vicons/ionicons5'
import { RouterView, useRouter } from 'vue-router'
import { routes, getDisplayNames } from './router/index'
import { configureThemeColor, simulateClick, genMenuOptions as genMenu } from './scripts/normal'

const menuRef: Ref<typeof NMenu> | Ref<any> = ref()
const curPage: Ref<any> = ref()
const themeVars = useThemeVars().value
const appRouter = useRouter()
const menuOptions: MenuOption[] = genMenu(routes)
const defaultExpandedKeys: string[] = []
const useDark = ref<Boolean>(useOsTheme().value === 'dark')
const theme = computed<GlobalTheme | null>(() => {
  return useDark.value ? darkTheme : null
})
const onBreadcurmbClick = (e: PointerEvent) => {
  console.log(e)
  const element = e.target as HTMLElement
  if (e instanceof HTMLSpanElement) return
  const a = element.querySelector('a')
  a && simulateClick(a)
  // router.push(element.querySelector('a')?.getAttribute('href') || '')
}
const dayNightRail = (info: any) => {
  return {
    backgroundColor: info.checked ? '#bdc6ce' : '#ffd700'
  }
}
appRouter.beforeEach((to) => {
  curPage.value = to.name
  if (to.name && !(to.name in menuRef.value.activePath))
    menuRef.value.showOption(to.name)
  return to.name ? appRouter.hasRoute(to.name) : false
})
onMounted(() => {
  watch(useDark, () => {
    configureThemeColor(useDark.value ? darkTheme.common.baseColor : themeVars.baseColor)
  }, { immediate: true })
})
</script>

<style scoped lang="scss">
.n-container {
  .n-header {
    padding: 12px;
  }

  .n-main {
    position: relative;

    .n-content {
      overflow-y: auto;
    }
  }
}

.n-header,
.n-sider {
  * {
    user-select: none;
  }
}

.i-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.i-menu {
  text-align: left;
}

.fade-enter-to,
.fade-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
  transition: all .2s ease;
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
  transition: all .2s ease;
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