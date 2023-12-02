<template>
    <n-layout :native-scrollbar="false">
        <n-layout-header>
            <n-h1 style="margin: 0px">调色板</n-h1>
        </n-layout-header>
        <n-layout-content style="padding: 8px;">
            <n-space vertical>
                <n-card hoverable embedded>
                    <div class="testDisp" :style="bgColor"></div>
                </n-card>
                <n-card :hoverable="true" embedded :title="variant.name" :key="variant.name" v-for="variant in [{
                    name: 'RGB',
                    data: RGB,
                    handler: rgbInput
                }, {
                    name: 'HSL',
                    data: HSL,
                    handler: hslInput
                }]">
                    <n-space vertical>
                        <template v-for="(item, index) in variant.data" :key="index">
                            <n-space class="i-space" inline :wrap="true" align="center" :wrap-item="false"
                                justify="center">
                                <n-input-number class="i-input" @update:value="variant.handler" v-model:value="item.value">
                                    <template #prefix>{{ item.key }}</template>
                                    <template v-if="item.suffix" #suffix>{{ item.suffix }}</template>
                                </n-input-number>
                                <n-slider class="i-slider" @update:value="variant.handler" v-model:value="item.value"
                                    :step="1" :min="item.min" :max="item.max" />
                            </n-space>
                        </template>
                    </n-space>
                </n-card>
            </n-space>
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
function rgb2hsl(obj: { R: number, G: number, B: number }) {
    // <reference: https://juejin.cn/post/7225474899480969253>
    let { R, G, B } = obj
    let max = Math.max(R, G, B), min = Math.min(R, G, B);
    let H = 0, S = 0, L = 50 * (max + min);
    if (max == min) {
        H = S = 0;
    } else {
        let d = max - min;
        S = L > 50 ? 100 * d / (2 * 255 - max - min) : 100 * d / (max + min);
        switch (max) {
            case R: H = (G - B) / d + (G < B ? 6 : 0); break;
            case G: H = (B - R) / d + 2; break;
            case B: H = (R - G) / d + 4; break;
        }
        H = Math.round(H / 6 * 360);
        S = Math.round(S)
        L = Math.round(L / 255)
    }
    return { H, S, L };
}
function hsl2rgb(obj: { H: number, S: number, L: number }) {
    // <reference: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex>
    let { H, S, L } = obj
    // L *= 3000;
    const a = S * Math.min(L, 100 - L);
    const f = (n: number) => {
        const k = (n * 30 + H) % 360;
        const color = 3000 * L - a * Math.max(Math.min(k - 90, 270 - k, 30), -30);
        return Math.round(255 * color / 300000)
    };
    return {
        R: f(0),
        G: f(8),
        B: f(4)
    };
}
type color = Ref<Array<{
    key: string,
    value: number,
    min: number,
    max: number,
    suffix?: string
}>>
const RGB: color = ref([
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
const HSL: color = ref([
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
const hslInput = () => {
    ({
        R: RGB.value[0].value,
        G: RGB.value[1].value,
        B: RGB.value[2].value
    } = hsl2rgb({
        H: HSL.value[0].value,
        S: HSL.value[1].value,
        L: HSL.value[2].value,
    }))
}
const rgbInput = () => {
    ({
        H: HSL.value[0].value,
        S: HSL.value[1].value,
        L: HSL.value[2].value,
    } = rgb2hsl({
        R: RGB.value[0].value,
        G: RGB.value[1].value,
        B: RGB.value[2].value
    }))
}
const bgColor = computed(() => ({
    backgroundColor: `rgb(${RGB.value[0].value},${RGB.value[1].value},${RGB.value[2].value})`
}))
</script>

<style lang="scss" scoped>
.i-space {
    width: 100%;

    .i-input {
        min-width: 128px;
        flex: 3;
    }

    .i-slider {
        min-width: 128px;
        flex: 7;
    }
}

.testDisp {
    box-sizing: border-box;
    width: 100%;
    height: 128px;
    padding: 40px;
}
</style>