<template>
  <n-config-provider fullH :theme="theme">
    <n-layout class="n-container" content-style="display: flex; flex-direction: column;" fullH>
      <n-layout-header class="n-header" bordered @click.prevent style="box-shadow: var(--box-shadow-1);">
        <n-page-header subtitle="测试页面" @back="appRouter.go(-1)">
          <template #title> 主页 </template>
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
          <n-menu :options="menuOptions" :default-expanded-keys="defaultExpandedKeys" :value="page" class="i-menu" />
        </n-layout-sider>
        <n-layout-content class="n-content" :native-scrollbar="false">
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
import { ref, computed, watch } from 'vue'
import { useOsTheme, darkTheme, NIcon, useThemeVars } from 'naive-ui'
import type { MenuOption, GlobalTheme } from 'naive-ui'
import {
  Moon as MoonIcon,
  Sunny as SunIcon,
} from '@vicons/ionicons5'
import { RouterView, useRouter } from 'vue-router'
import { routes } from './router/index'
import { configureThemeColor, genMenuOptions as genMenu } from './scripts/normal'

const page = ref()
const themeVars = useThemeVars().value
const menuOptions: MenuOption[] = genMenu(routes)
const defaultExpandedKeys: string[] = []
const useDark = ref<Boolean>(useOsTheme().value === 'dark')
watch(useDark, () => {
  configureThemeColor(useDark.value ? darkTheme.common.baseColor : themeVars.baseColor)
}, { immediate: true })
const theme = computed<GlobalTheme | null>(() => {
  if (useDark.value) {
    return darkTheme
  } else {
    return null
  }
})
const dayNightRail = (info: any) => {
  return {
    backgroundColor: info.checked ? '#bdc6ce' : '#ffd700'
  }
}
const appRouter = useRouter();
appRouter.beforeEach((to) => {
  page.value = to.name;
  return to.name ? appRouter.hasRoute(to.name) : false
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

.i-content {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 8px 8px 2px;
}

.i-menu {
  text-align: left;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.fade-enter-to {
  transform: translateY(0%);
  opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
  transition: all .2s ease;
  position: absolute;
}

.fade-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>