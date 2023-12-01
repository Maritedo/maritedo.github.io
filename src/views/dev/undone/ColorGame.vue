<template>
    <n-layout>
        <n-layout-header>
            <n-button-group>
                <n-button>开始游戏</n-button>
                <n-button>
                    <n-icon>
                        <Pause />
                    </n-icon>
                    暂停
                </n-button>
                <n-button>重新开始</n-button>
            </n-button-group>
        </n-layout-header>
        <n-layout-content>
            <div class="testDisp"></div>
        </n-layout-content>
    </n-layout>
</template>

<script setup>
import { Pause } from '@vicons/ionicons5'
</script>
<style lang="scss" scoped>
</style>