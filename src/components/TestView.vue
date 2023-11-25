<template>
    <div class="container">
        <div class="content">
            <div class="canvas-holder" ref="wrapper">
                <canvas class="cvs bottom" ref="cvs_bottom">
                </canvas>
                <canvas class="cvs top" ref="cvs_top">
                    Your Browser does not support canvas.
                </canvas>
            </div>
        </div>
        <ul>
            <li>width:
                <input @input="fabric.refresh()" type="range" min="0" max="512" v-model="iwidth">
                {{ iwidth }}
            </li>
            <li>height:
                <input @input="fabric.refresh()" type="range" min="0" max="512" v-model="iheight">
                {{ iheight }}
            </li>
            <li>translateX:
                <input @input="fabric.refresh()" type="range" min="-128" max="128" v-model="translateX">
                {{ translateX }}
            </li>
            <li>translateY:
                <input @input="fabric.refresh()" type="range" min="-128" max="128" v-model="translateY">
                {{ translateY }}
            </li>
            <li>scaleX:
                <input @input="fabric.refresh()" type="range" step="0.01" min="-2" max="2" v-model="scaleX">
                {{ scaleX }}
            </li>
            <li>scaleY:
                <input @input="fabric.refresh()" type="range" step="0.01" min="-2" max="2" v-model="scaleY">
                {{ scaleY }}
            </li>
            <li>x:
                <input @input="fabric.refresh()" type="range" min="0" max="512" v-model="x">
                {{ x }}
            </li>
            <li>y:
                <input @input="fabric.refresh()" type="range" min="0" max="512" v-model="y">
                {{ y }}
            </li>
            <li>rotate:
                <input @input="fabric.refresh()" type="range" step="0.1" min="0" max="360" v-model="rotate">
                {{ rotate }}
            </li>
            <li>color:
                <input @input="fabric.refresh()" type="text" v-model="color">
            </li>
            <li>fill:
                <input @change="e => { fill = e.target.checked; fabric.refresh() }" type="checkbox" :checked="fill">
            </li>
            <li>stroke:
                <input @change="e => { stroke = e.target.checked; fabric.refresh() }" type="checkbox" :checked="stroke">
            </li>
        </ul>
        <div>
            <button @click="fabric.render(rect1)">Render</button>
            <button @click="fabric.refresh()">Refresh</button>
            <button @click="fabric.clear()">Clear</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { Fabric, Rect } from './test.ts';

// START Elements References
/** @type {{value: HTMLCanvasElement}} */
const cvs_top = ref();
/** @type {{value: HTMLCanvasElement}} */
const cvs_bottom = ref();
/** @type {{value: HTMLDivElement}} */
const wrapper = ref();
// END 

const width = ref(512),
    height = ref(512),
    iwidth = ref(256),
    iheight = ref(256),
    translateX = ref(0),
    translateY = ref(0),
    rotate = ref(0),
    fill = ref(true),
    stroke = ref(true),
    color = ref('#f00a'),
    x = ref(256),
    y = ref(256),
    axis = ref('left-top'),
    scaleX = ref(1),
    scaleY = ref(1);
var ctx_top, ctx_bottom, fabric;
const setSize = (w, h) => {
    wrapper.value.style.setProperty('width', width.value + 'px');
    wrapper.value.style.setProperty('height', height.value + 'px');
    fabric.setSize(width.value, height.value);
}

{
    watch(iwidth, () => {
        rect1.width = iwidth.value
    });
    watch(iheight, () => {
        rect1.height = iheight.value
    });
    watch(translateX, () => {
        rect1.translateX = translateX.value
    });
    watch(translateY, () => {
        rect1.translateY = translateY.value
    });
    watch(scaleX, () => {
        rect1.scaleX = scaleX.value
    });
    watch(scaleY, () => {
        rect1.scaleY = scaleY.value
    });
    watch(fill, () => {
        rect1.fill = fill.value
    });
    watch(stroke, () => {
        rect1.stroke = stroke.value
    });
    watch(rotate, () => {
        rect1.rotate = rotate.value / 180 * Math.PI
    });
    watch(x, () => {
        rect1.x = x.value
    });
    watch(y, () => {
        rect1.y = y.value
    });
    watch(color, () => {
        rect1.ctxStyle.fillStyle = color.value
    });
}

var rect1 = new Rect({
    width: iwidth.value,
    height: iheight.value,
    radius: 2,
    fill: fill.value,
    stroke: stroke.value,
    x: x.value,
    y: y.value,
    axis: axis.value,
    scaleX: scaleX.value,
    translateX: translateX.value,
    translateY: translateY.value,
    rotate: rotate.value / 180 * Math.PI,
    ctxStyle: {
        fillStyle: color.value
    }
});
onMounted(() => {
    ctx_top = cvs_top.value.getContext('2d');
    ctx_bottom = cvs_bottom.value.getContext('2d');
    fabric = new Fabric(cvs_top.value, cvs_bottom.value, ctx_top, ctx_bottom);
    watch(() => { return { w: width, h: height } }, () => {
        setSize(width.value, height.value)
    }, { immediate: true });
    fabric.add(rect1).refresh();
})
</script>

<style lang="scss" scoped>
.container {
    .content {
        .canvas-holder {
            position: relative;
            width: 100px;
            height: 100px;
            padding: 0;

            .cvs {
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;
                padding: 0;
                user-select: none;

                &.top {
                    background-color: transparent;
                }

                &.bottom {
                    background-color: #bbb;
                }
            }
        }
    }

    ul {
        list-style: none;

        li {
            display: flex;
            justify-items: left;
        }
    }
}
</style>./test.js