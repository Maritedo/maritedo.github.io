<template>
  <n-layout style="display: flex;height:100%;align-items: center;justify-content: center;">
    <n-result style="display: flex;height:100%;align-items: center;justify-content: center;flex-direction:column;" fullH
      class="r-main" status="404" title="页面不存在" description="请检查链接是否正确输入">
      <template #footer>
        <n-button>
          <router-link class="r-link" :to="{ name: 'home' }">
            返回主页面
          </router-link>
        </n-button>
      </template>
    </n-result>
  </n-layout>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.r-main {
  padding: auto;
}

.r-link {
  text-decoration: none;
  color: unset;
}
</style>