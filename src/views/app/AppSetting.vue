<template>
  <n-layout class="wrapper" :native-scrollbar="false">
    <n-space class="i-space" vertical>
      <n-list class="i-list" hoverable clickable bordered>
        <template #header><n-h2 reset>基本</n-h2></template>
        <n-list-item class="config-item">
          深色模式跟随系统
          <p class="detail">将页面的颜色主题与浏览器同步，若需要与系统保持同步，请将浏览器的颜色主题设置为与系统同步。</p>
          <template #suffix>
            <n-switch v-model:value="useSystemTheme"></n-switch>
          </template>
        </n-list-item>
        <n-list-item class="config-item">
          深色模式
          <template #suffix>
            <n-switch @update:value="v => userDarkTheme = v" :value="useSystemTheme ? osTheme == 'dark' : userDarkTheme"
              :disabled="useSystemTheme"></n-switch>
          </template>
        </n-list-item>
      </n-list>
      <n-list class="i-list" hoverable clickable bordered>
        <template #header><n-h2 reset>高级</n-h2></template>
        <n-list-item class="config-item">
          页面缓存
          <p class="detail">开启后，页面将被缓存，离开页面将不会使页面重置。再次进入时页面的加载速度将更快，但也会增大内存使用量。</p>
          <p class="detail">需要刷新</p>
          <template #suffix>
            <n-space vertical class="button-n-switch">
              <n-switch v-model:value="_keepAlive"></n-switch>
              <n-button :disabled="keepAlive == _keepAlive" type="info" @click="keepAlive = _keepAlive" size="small"
                button>保存</n-button>
            </n-space>
          </template>
        </n-list-item>
      </n-list>
    </n-space>
  </n-layout>
</template>

<script setup>
import { useConfigStore } from '@/stores/configs'
import { storeToRefs } from 'pinia'
const {
  userDarkTheme,
  useSystemTheme,
  keepAlive,
  osTheme
} = storeToRefs(useConfigStore())
const _keepAlive = ref(keepAlive.value)
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
      margin-top: 6px;

      .config-item {
        text-align: left;

        .detail {
          font-size: .9em;
          margin: .2em 0;
          opacity: .6;

          &::before {
            content: '*';
          }
        }
      }

      .button-n-switch {
        padding: 0;
        position: relative;

        [button] {
          position: absolute;
          padding: 0 5.5px;
          align-items: center;
          transition: all .2s ease;

          &:disabled {
            transform: translateY(-100%);
            height: 0;
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>