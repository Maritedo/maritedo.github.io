<template>
    <n-notification-provider>
        <app-main />
    </n-notification-provider>
</template>

<script type="ts" setup>
import AppMain from '@/AppMain.vue'
import { useOsTheme } from 'naive-ui'
import { useConfigStore } from './stores/configs';

const appConfig = useConfigStore()

const initDefaultConfig = () => {
    console.log(useOsTheme().value)
}

onMounted(() => {
    if (appConfig.firstRun) {
        appConfig.firstRun = false
        initDefaultConfig()
    }
})
</script>

<style lang="scss" scoped></style>