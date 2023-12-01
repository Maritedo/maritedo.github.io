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
            <div class="testDisp" :style="bgColor"></div>
        </n-layout-content>
        <n-layout-footer>
            <n-card title="调色板">
                <n-space vertical>
                    <span>
                        RGB
                        <n-switch v-model:value="hslMode"
                            :rail-style="(v) => { return { backgroundColor: hslMode ? '#fc6' : '#6cf' } }">
                            <template #checked>
                            </template>
                            <template #unchecked>
                            </template>
                        </n-switch>
                        HSL
                    </span>
                    <n-space vertical>
                        <template v-for="(item, index) in (hslMode ? HSL : RGB)" :key="index">
                            <n-space inline :wrap="false" align="center" :wrap-item="false" justify="center">
                                <n-input-number v-model:value="item.value">
                                    <template #prefix>{{ item.key }}</template>
                                    <template v-if="item.suffix" #suffix>{{ item.suffix }}</template>
                                </n-input-number>
                                <n-slider v-model:value="item.value" :step="1" :min="item.min" :max="item.max" />
                            </n-space>
                        </template>
                    </n-space>
                </n-space>
            </n-card>
        </n-layout-footer>
    </n-layout>
</template>

<script setup>
import { Pause } from '@vicons/ionicons5'
import { computed } from 'vue'
const hslMode = ref(false)
const RGB = ref([
    {
        key: 'R',
        value: 64,
        min: 0,
        max: 255
    },
    {
        key: 'G',
        value: 191,
        min: 0,
        max: 255,
    },
    {
        key: 'B',
        value: 191,
        min: 0,
        max: 255,
    }
])
const HSL = ref([
    {
        key: 'H',
        value: 180,
        min: 0,
        max: 360
    },
    {
        key: 'S',
        value: 50,
        min: 0,
        max: 100,
        suffix: '%'
    },
    {
        key: 'L',
        value: 50,
        min: 0,
        max: 100,
        suffix: '%'
    }
])
const bgColor = computed(() => ({
    backgroundColor: hslMode.value ? colorHSL.value : colorRGB.value
}))
const colorHSL = computed(() => `hsl(${HSL.value[0].value}, ${HSL.value[1].value}%, ${HSL.value[1].value}%)`)
const colorRGB = computed(() => `rgb(${RGB.value[0].value},${RGB.value[1].value},${RGB.value[1].value})`)
</script>
<style lang="scss" scoped>
.testDisp {
    box-sizing: border-boxox;
    width: 100%;
    height: 100%;
    padding: 40px;
    color: hsl(0, 100%, 53%)
}
</style>