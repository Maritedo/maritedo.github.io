<template>
    <div ref="wrapper" class="wrapper">
        <svg class="fan" :width="size" :height="size" viewBox="-20 -20 40 40" :style="{
            width: size + 'px',
            height: size + 'px'
        }">
            <g v-if="percents.length == 0">
                <circle cx="0" cy="0" r="16" fill="#eeeef0">
                </circle>
                <text x="0" y="0.5" font-size="1" text-anchor="middle" style="user-select: none;">
                    {{ message }}
                </text>
            </g>
            <g tabindex='0' v-for="percent in percents" :title="percent.name" :key="percent.name" @mouseenter="OnStart"
                @mousemove="OnMoving" @mouseleave="OnOut" @touchstart.prevent="OnStart" @touchmove="OnMoving"
                @touchend="OnOut" @focus="OnStart" @blur="OnOut" :style="{ rotate: `-${360 * percent.data.offset}deg` }">
                <path :d="paintData[percent.name].main" :fill="percent.data.color" />
                <path :d="paintData[percent.name].inner" :fill="percent.data.color" class="highlight" />
            </g>
        </svg>
        <div ref="detailBox" :class="{ hidden: hidden }" class="detail-box">
            <p ref="detail" class="text" :style="{ '--width': displayWidth }">{{ text }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { randomColor, keepIn } from '@/scripts/normal'
const props = defineProps({
    datas: {
        default: [
            { name: 'Item1', value: 1 },
            { name: 'Item2', value: 2 }
        ]
    },
    size: {
        default: 128
    },
    padding: {
        default: 0.25
    },
    useAlt: {
        default: false
    },
    msg: {

    }
})
defineEmits([
    "update:msg"
])
const message = ref("数据为空")
const hidden = ref(true)
const wrapper = ref()
const detailBox = ref()
const detail = ref()
const text = ref('')
const displayWidth = ref('-100%')
const bound = 4

const paintData = computed(() => {
    var result = {}
    for (let index = 0; index < percents.value.length; index++)
        result[percents.value[index].name] = computePath(percents.value[index])
    return result
})
/** @param{{ offset, value, color }} percent */
const computePath = (percent) => {
    const precision = 0x10000
    // 0x1000 = 4096 =~ 4000 基本足够
    var r1 = 16, r2 = r1 * props.padding
    // 1: 优弧 0: 劣弧
    var arcType = percent.data.value > 0.5 ? 1 : 0
    if (percent.data.value == 1) return {
        main: `
        M-${r1} 0
        A ${r1} ${r1}, 0, 1, 0, ${r1} 0
        A ${r1} ${r1}, 0, 1, 0,-${r1} 0
        M-${r2} 0
        A ${r2} ${r2}, 0, 0, 1, ${r2} 0
        A ${r2} ${r2}, 0, 0, 1,-${r2} 0
        `,
        inner: `
        M-${r2} 0
        A ${r2} ${r2}, 0, 1, 0, ${r2} 0
        A ${r2} ${r2}, 0, 1, 0,-${r2} 0
        `
    }
    var angle = 2 * Math.PI * percent.data.value
    var dx = Math.round(precision * Math.cos(angle)) / precision,
        dy = -Math.round(precision * Math.sin(angle)) / precision
    return {
        main: `
        M ${r1} 0
        A ${r1} ${r1}, 0, ${arcType}, 0, ${r1 * dx} ${r1 * dy}
        L ${r2 * dx} ${r2 * dy}
        A ${r2} ${r2}, 0, ${arcType}, 1, ${r2} 0
        `,
        inner: `
        M ${r2} 0
        A ${r2} ${r2}, 0, ${arcType}, 0, ${r2 * dx} ${r2 * dy}
        L 0 0
        `
    }
}

// 作缓存
// const colorStore = new WeakMap()
var colorStore = {}
const genColor = (name) => {
    if (!colorStore[name]) {
        var color = randomColor()
        colorStore[name] = `rgb(${color.R}, ${color.G}, ${color.B})`
    }
    return colorStore[name]
}

/** @type{{ name: String, data: { offset, value, color } }[]}*/
const percents = computed(() => {
    var val = props.datas
    if (val.length == 0) return []
    var processed = []
    var sum = 0, offset = 0
    for (const item of val)
        sum += item.value
    for (const item of val) {
        processed.push({
            name: item.name,
            data: {
                offset: offset / sum,
                value: item.value / sum,
                color: genColor(item.name)
            }
        })
        offset += item.value
    }
    return processed
})

const teleTo = (x, y) => {
    detailBox.value.style.left = `${keepIn(
        x + bound,
        bound,
        wrapper.value.offsetWidth - detailBox.value.offsetWidth - bound
    )}px`
    detailBox.value.style.top = `${keepIn(
        y - bound - detailBox.value.offsetHeight,
        bound,
        wrapper.value.offsetHeight - detailBox.value.offsetHeight - bound
    )}px`
}

var usingMouse = false
const OnStart = (e) => {
    if (e.type != "focus")
        usingMouse = true
    hidden.value = false
    if (e.type == "touchstart")
        text.value = e.target.parentElement.getAttribute('title')
    else
        text.value = e.target.getAttribute('title')
    setTimeout(() => {
        var overflowWidth = detail.value.offsetWidth - detailBox.value.offsetWidth
        displayWidth.value = `-${overflowWidth}px`
        // detail.value.style.animationPlayState = overflowWidth > 0 ? 'running' : 'paused'
        if (e.type == "touchstart" || (e.type == "focus" && !usingMouse))
            teleTo(
                (wrapper.value.offsetWidth - detailBox.value.offsetWidth) / 2,
                0
            )
        else
            teleTo(
                e.offsetX,
                e.offsetY
            )
    }, 10)
}
const OnMoving = (e) => {
    if (hidden.value) hidden.value = false
    if (e.type != "touchmove" && e.type != "blur")
        teleTo(e.offsetX, e.offsetY)
}
const OnOut = (e) => {
    if (e.type != "blur") {
        usingMouse = false
        hidden.value = true
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    overflow: hidden;
    padding: 0;
    width: fit-content;
    height: fit-content;
}

.detail-box {
    position: absolute;
    pointer-events: none;
    box-sizing: content-box;
    padding: 2px;
    background-color: #fafafa90;
    color: #444;
    box-shadow: .5px .5px 1.5px 0px #000a;
    max-width: 30%;
    overflow-x: hidden;

    --size: 18px;
    height: calc(1.6 * var(--size));
    padding: 0;
    font-size: 18px;
    border-radius: 4px;

    .text {
        user-select: none;
        -webkit-user-select: none;
        position: relative;
        // START 为确保能通过 offsetWidth计算得出文本总宽度，不应设置 外部元素的 padding 和 自身 的 margin，改为用 自身 的 padding 实现边距
        padding: .3em .4em;
        margin: 0;
        // END
        width: fit-content;
        height: 1em;
        font-weight: 500;
        text-align: center;
        font-size: 1em;
        line-height: 1em;
        animation: marquee 4s linear infinite alternate;

        --width: 0;

        @keyframes marquee {

            0%,
            10% {
                transform: translateX(0);
            }

            90%,
            100% {
                transform: translateX(var(--width));
            }
        }
    }

    --blur: .4em;
    --ease: .1s;
    backdrop-filter: blur(var(--blur));
    -webkit-backdrop-filter: blur(var(--blur));
    transition: opacity .5s,
    scale .5s;
}

.hidden {
    opacity: 0;
    scale: 0.5;
}

.container {
    box-sizing: border-box;
    padding: 0;

    svg.fan {
        padding: 0;
        margin: 0;
        --ignored: .4;

        &:focus-within g:not(:focus):not(:hover) {
            opacity: var(--ignored);
        }

        g {
            outline: none;
            position: absolute;
            transition: scale .4s ease, rotate .1s ease, opacity .4s ease;

            .highlight {
                opacity: 0;
                visibility: none;
                transition: all .4s ease;
            }

            &:hover,
            &:focus:not(:has(~:hover)) {
                scale: 1.05;

                .highlight {
                    opacity: .1;
                }
            }

            &:hover~ :focus {
                scale: unset;
            }

            &:hover~:not(:hover):not(:focus),
            &:focus~:not(:hover):not(:focus),
            &:not(:hover):not(:focus):has(~:hover, ~:focus) {
                scale: .9;
                opacity: var(--ignored);
            }
        }
    }
}
</style>