<template>
  <n-layout class="wrapper" :native-scrollbar="false">
    <n-space class="i-space" vertical>
      <n-list class="i-list" :content-style="{ backGroundColor: appTheme.primaryColor }" hoverable clickable bordered>
        <template #header><n-h2 reset>基本</n-h2></template>
        <n-list-item class="config-item">
          深色模式跟随系统
          <template #suffix>
            <n-switch v-model:value="useSystemTheme"></n-switch>
          </template>
        </n-list-item>
        <n-list-item class="config-item">
          深色模式
          <template #suffix>
            <n-switch v-model:value="userDarkTheme" :disabled="useSystemTheme"></n-switch>
          </template>
        </n-list-item>
      </n-list>
      <n-list class="i-list" :content-style="{ backGroundColor: appTheme.primaryColor }" hoverable clickable bordered>
        <template #header><n-h2 reset>高级</n-h2></template>
        <n-list-item class="config-item">
          页面缓存
          <template #suffix>
            <n-switch v-model:value="keepAlive"></n-switch>
          </template>
        </n-list-item>
      </n-list>
    </n-space>
  </n-layout>
</template>

<script setup>
import { useConfigStore } from '@/stores/configs'
import { storeToRefs } from 'pinia'
import { useThemeVars } from 'naive-ui';
const {
  userDarkTheme,
  useSystemTheme,
  keepAlive
} = storeToRefs(useConfigStore())
const appTheme = useThemeVars()
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: hidden;

  .i-space {
    .i-list {
      border-radius: 6px;

      .config-item {
        text-align: left;
      }
    }
  }
}
</style>