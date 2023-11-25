<template>
    <div>
        <canvas tabindex="0" @keyup.enter.space="refreshCode" ref="canvas" @click.prevent.stop="refreshCode"></canvas>
    </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { HandledCanvas } from '../scripts/verication.js'
import { propIsTrue, getDPI } from '../scripts/common.js';

const props = defineProps({
    length: {
        default: 4
    },
    size: {
        default: 40
    },
    debug: {
        default: true
    },
    anim: {
        default: true
    },
    info: {
        default: false
    },
    cache: {
        default: false
    }
})

const check = (str) => {
    return handledCanvas.check(str);
}

defineExpose({
    check
})

var padding, height, width, _fontH, _fontW, handledCanvas, /** @type {CanvasRenderingContext2D}*/ctx;
const canvas = ref(null);
const useDebug = computed(() => propIsTrue(props.debug));
const useAnim = computed(() => propIsTrue(props.anim));
const useInfo = computed(() => propIsTrue(props.info));
const useCache = computed(() => propIsTrue(props.cache));
const dpi = ref(null);

const resizeCvs = () => {
    let cvs = canvas.value;
    cvs.style.width = width + 'px';
    cvs.style.height = height + 'px';
    dpiFit()
}
const dpiFit = () => {
    let cvs = canvas.value;
    cvs.width = Math.ceil(width * dpi.value);
    cvs.height = Math.ceil(height * dpi.value);
}

const updateDPI = () => {
    var old = dpi.value;
    if ((dpi.value = getDPI(ctx)) != old) {
        ctx.setTransform(dpi.value, 0, 0, dpi.value, 0, 0);
        return true;
    }
    else return false;
}
const refreshCode = () => {
    handledCanvas.refreshCode({ length: props.length, height, width, padding, _fontH, _fontW, dpi: dpi.value })
}

const redrawCode = () => {
    handledCanvas.redrawCode({ height, width, padding, _fontW, dpi: dpi.value })
}

onMounted(() => {
    ctx = canvas.value.getContext('2d');
    updateDPI();
    handledCanvas = new HandledCanvas(canvas.value, ctx);
    watch(() => props.size, () => {
        fullResize();
        resizeCvs();
    })
    watch(() => props.length, () => {
        width = 2 * padding + props.length * _fontW;
        resizeCvs();
    })
    const fullResize = () => {
        padding = props.size * 0.1;
        height = props.size;
        _fontH = props.size * 0.8;
        _fontW = props.size * 0.48;
        width = 2 * padding + props.length * _fontW;
        resizeCvs()
    }
    fullResize();
    refreshCode();

    handledCanvas.debug = useDebug.value;
    handledCanvas.info = useInfo.value;
    handledCanvas.cache = useCache.value;
    if ((handledCanvas.anim = useAnim.value)) {
        handledCanvas.setupAnim({ length: props.length, height, width, padding, _fontH, _fontW, dpi: dpi.value }).animRefresh();
    }
    watch(useDebug, (_debug) => {
        handledCanvas.debug = _debug;
        redrawCode();
    });
    watch(useAnim, (_anim) => {
        handledCanvas.anim = _anim;
        if (_anim) {
            handledCanvas.setupAnim({ length: props.length, height, width, padding, _fontH, _fontW, dpi: dpi.value }).animRefresh();
        }
    });
    watch(useInfo, (_info) => {
        handledCanvas.info = _info;
        redrawCode();
    });
    watch(useCache, (_cache) => {
        handledCanvas.cache = _cache;
    });
    window.addEventListener('resize', () => {
        if (updateDPI()) {
            fullResize();
            if (useAnim.value)
                handledCanvas.setupAnim({ length: props.length, height, width, padding, _fontH, _fontW, dpi: dpi.value });
            else
                refreshCode();
        }
    });
})
</script>

<style scoped>
div {
    display: block;
    max-width: 500px;
    overflow-x: scroll;
}

canvas {
    user-select: none;
    display: inline-block;
    border-radius: 4px;
    color: #fc6;
    transition: border-radius .4s;
}

canvas:focus,
canvas:hover {
    border-radius: 16px;
}
</style>
../../scripts/verication.js