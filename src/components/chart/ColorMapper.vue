<template>
    <div class="wrapper" align="left">
        <button @click="cClr">清除</button>
        <button @click="cGen">生成</button>
        <button @click="cStp">暂停</button>
        <button @click="cFil">填充</button>
        <br>
        <div>
            X:&nbsp;<input type="range" :step="step" min="0" max="256" v-model="sx">{{ sx }}
        </div>
        <div>
            Y:&nbsp;<input type="range" :step="step" min="0" max="256" v-model="sy">{{ sy }}
        </div>
        <div>
            Z:&nbsp;<input type="range" :step="step" min="0" max="256" v-model="sz">{{ sz }}
        </div>
        <div>
            Step:&nbsp;<input type="range" step="1" min="1" max="16" v-model="step">{{ step }}
        </div>
        <p>({{ calculated.x }}, {{ calculated.y }})</p>
        <div class="container">
            <canvas ref="test" :width="dpi * sizex" :height="dpi * sizex"
                :style="{ width: sizex + 'px', height: sizex + 'px', background: 'black' }"></canvas>
        </div>
    </div>
</template>

<script>
// const pi = Math.PI;
// // 待定
// const offsets = [
//     //{ x: 0, y: 0, z: 0 },
//     { x: 0, y: 1, z: 1 },
//     { x: 1, y: 1, z: 1 },
//     { x: 1, y: 0, z: 0 },
// ];
// export const mapCord = (length, { x, y, z }) => {
//   var _x, _y, r, theta, distance, cut;
//   theta = pi * x / 255;
//   if (y > z)
//     theta = 2 * pi - theta;
//   var _theta = theta % (pi / 2)
//   if (_theta > pi / 4) _theta = pi / 2 - _theta;
//   cut = length / 2 / Math.cos(Math.min(_theta, pi / 2 - _theta));
//   distance = Math.sqrt((y ** 2 + z ** 2) / 2);
//   r = distance * cut / 256;
//   _x = length / 2 + r * Math.cos(theta);
//   _y = length / 2 - r * Math.sin(theta);
//   return { x: _x, y: _y };
// }
// const offsets = [
//   //{ x: 0, y: 0, z: 0 },
//   { x: 0, y: 1, z: 0 },
//   { x: 0, y: 1, z: 1 },
//   { x: 0, y: 0, z: 1 },
// ];
export const mapCord = (length, { x, y, z }) => {
    var block = length / (16 * 256);
    var a = 16, dx = x % a, dy = ~~(x / a);
    var _x = length * dx / a + y * block;
    var _y = length * dy / a + z * block;
    return { x: _x, y: _y };
}
</script>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getDPI } from "../../scripts/normal"
const sizex = ref(1024);
/**@type{CanvasRenderingContext2D} ctx*/
var ctx;
var iter = 0x10000;
const test = ref()
const dpi = ref(1)
const step = ref(1);
var animing = false;
var cur = {
    x: 0,
    y: 0,
    z: 0
}
const sx = ref(1), sy = ref(1), sz = ref(1);
var calculated = computed(() => mapCord(sizex.value, {
    x: sx.value,
    y: sy.value,
    z: sz.value
}));

const cClr = () => {
    var l = sizex.value;
    ctx.clearRect(0, 0, l, l);
}
const cGen = () => {
    if (!animing) {
        animing = true
        gen();
    }
}
const cStp = () => {
    animing = false;
}
const cFil = () => {
    const range = 64;
    var x0, y0, z0;
    for (x0 = 0; x0 <= range; x0 += step.value)
        for (y0 = 0; y0 <= range; y0 += step.value)
            for (z0 = 0; z0 <= range; z0 += step.value)
                process(x0, y0, z0);
}
const process = (x0, y0, z0) => {
    var len = sizex.value;
    ctx.setTransform(dpi.value, 0, 0, dpi.value, 0, 0);
    ctx.fillStyle = `rgb(${x0}, ${y0}, ${z0})`;
    var { x, y } = mapCord(len, { x: x0, y: y0, z: z0 });
    ctx.fillRect(x - 1, y - 1, 1, 1)
    // // if ((!x && x != 0) || (!y && y != 0))
    // //     console.log('x:', x0, ", y:", y0, ", z:", z0);
    // ctx.moveTo(x, y);
    // ctx.beginPath();
    // var index = 0;
    // do {
    //     var off = offsets[index];
    //     var { x, y } = mapCord(len, {
    //         x: x0 + off.x * step.value,
    //         y: y0 + off.y * step.value,
    //         z: z0 + off.z * step.value
    //     });
    //     // if ((!x && x != 0) || (!y && y != 0))
    //     //     console.log('BODY x:', x, ", y:", y);
    //     ctx.lineTo(x, y);
    // } while (++index < offsets.length);
}
const gen = () => {
    var _iter = iter;
    do {
        cur.z += step.value;
        if (cur.z >= 256) {
            cur.z %= 256;
            cur.y += step.value;
            if (cur.y >= 256) {
                cur.y %= 256;
                cur.x += step.value;
                if (cur.x >= 256) {
                    animing = false;
                    cur = {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                    break;
                }
            }
        }
        process(cur.x, cur.y, cur.z);
    } while (_iter-- > 1);
    if (animing) requestAnimationFrame(gen)
}
onMounted(() => {
    ctx = test.value.getContext('2d');
    dpi.value = getDPI(ctx);
    watch(calculated, () => {
        process(sx.value, sy.value, sz.value);
    }, { immediate: true })
})
</script>

<style lang="scss" scoped>
.wrapper {
    .container {
        max-width: 500px;
        max-height: 500px;
        overflow: auto;
    }
}
</style>