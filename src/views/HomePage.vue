<template>
    <div class="container">
        <iframe ref='iFrame' style="width: 100%; height: 100%" src="" frameborder="0"></iframe>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

/** @type {{ value: HTMLIFrameElement }}*/
const iFrame = ref()
onMounted(() => {
    iFrame.value.onload = () => {
        
    }
})
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
}
</style>