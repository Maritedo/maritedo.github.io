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
                <n-switch v-model:value="hslMode"
                    :rail-style="(v) => { return { backgroundColor: hslMode ? '#fc6' : '#6cf' } }">
                    <template #checked>
                        HSL
                    </template>
                    <template #unchecked>
                        RGB
                    </template>
                </n-switch>
                <transition-group>
                    <n-space v-if="hslMode" vertical>
                        <n-input-number v-model:value="H">
                            <template #prefix>
                                H
                            </template>
                        </n-input-number>
                        <n-slider v-model:value="H" :step="1" :min="0" :max="360" />
                        <n-divider />
                        <n-input-number v-model:value="S">
                            <template #prefix>
                                S
                            </template>
                        </n-input-number>
                        <n-slider v-model:value="S" :step="1" :min="0" :max="100" />
                        <n-divider />
                        <n-input-number v-model:value="L">
                            <template #prefix>
                                L
                            </template>
                        </n-input-number>
                        <n-slider v-model:value="L" :step="1" :min="0" :max="100" />
                    </n-space>

                    <n-space v-if="!hslMode" vertical>

                        <n-input-number v-model:value="R">
                            <template #prefix>
                                R
                            </template>
                        </n-input-number>
                        <n-slider v-model:value="R" :step="1" :min="0" :max="255" />
                        <n-divider />
                        <n-input-number v-model:value="G">
                            <template #prefix>
                                G
                            </template>
                        </n-input-number>
                        <n-slider v-model:value="G" :step="1" :min="0" :max="255" />
                        <n-divider />
                        <n-input-number v-model:value="B">
                            <template #prefix>
                                B
                            </template>
                        </n-input-number>
                        <n-slider v-model:value="B" :step="1" :min="0" :max="255" />
                    </n-space>
                </transition-group>
            </n-card>
        </n-layout-footer>
    </n-layout>
</template>

<script setup>
import { Pause } from '@vicons/ionicons5'
import { computed } from 'vue'
const hslMode = ref(false)
const R = ref(0)
const G = ref(0)
const B = ref(0)
const H = ref(0)
const S = ref(0)
const L = ref(0)
const bgColor = computed(() => ({
    backgroundColor: hslMode.value ? colorHSL.value : colorRGB.value
}))
const colorHSL = computed(() => `hsl(${H.value}, ${S.value}%, ${L.value}%)`)
const colorRGB = computed(() => `rgb(${R.value},${G.value},${B.value})`)

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