<template>
  <n-layout style="display: flex;height:100%;align-items: center;justify-content: center;">
    <n-result style="display: flex;height:100%;align-items: center;justify-content: center;flex-direction:column;" fullH
      class="r-main" status="404" title="情况不妙..." description="你似乎来到了一片荒原">
      <template #footer>
        <n-button @click="$router.push({ name: 'home' })">
          带我回家
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