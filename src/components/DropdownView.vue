<template>
    <div class="wrapper">
        <div class="toolbar" :class="{ folded: !show }">
            <div class="title" @click="show = !show">
                {{ title }}
                <!-- {{ stage }} {{ show ? " - SHOW" : " - HIDE" }} {{ moving ? " - MOVE" : " - STOP" }} -->
            </div>
            <label>
                <input ref="checkBox" class="checkbox" type="checkbox" v-model="show">
                <IconDrop tabindex='0' @keydown.space.prevent @keyup.space.exact="simulateClick(checkBox)"
                    @keyup.enter.exact="simulateClick(checkBox)" class="icon toggle" :class="{ folded: !show }">
                </IconDrop>
            </label>
        </div>
        <div ref="container" class="container">
            <div ref="content" class="content" align="center">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
// const useDev = true
// const dev = (...e) => useDev ? console.log(...e) : void (0)
</script>

<script setup>
import { simulateClick, propIsTrue } from './../scripts/normal'
import { onMounted, ref, watch } from 'vue'
import IconDrop from './icon/IconDrop.vue'
const props = defineProps({
    title: {
        default: ""
    },
    autoExpand: {
        default: false
    }
})
// 响应式常量
const checkBox = ref()
const container = ref()
const content = ref()
const show = ref(propIsTrue(props.autoExpand))

var isMoving = false, storedHeight
const classActive = "container-active"
const displays = {
    normal: "visible",
    hidden: "hidden"
}
const states = {
    show: 'toggle-show',
    hide: 'toggle-hide',
    trans: 'toggle-trans'
}
const handlerSwitch = () => {
    if (isMoving) {
        transitionHandlers.switch(show.value)
        if (show.value) animate.enter()
        else animate.leave()
    } else
        transitionHandlers.invoke()
}
const initTrans = () => {
    transitionHandlers.reset(true)
    storedHeight = `${container.value.getBoundingClientRect().height}px`
    transitionHandlers.reset(show.value)
    content.value.style.visibility = show.value ? displays.normal : displays.hidden
    classAdd(show.value ? states.show : states.hide)
    setTimeout(() => classAdd(states.trans))
}
const transitionHandlers = {
    filter: (e) => (e.target != container.value || e.propertyName != "height"),
    switch: (v) => container.value.style.height = v ? storedHeight : "0",
    reset: (v) => container.value.style.height = v ? "auto" : "0",
    invoke: () => {
        // Initiate Content
        content.value.style.visibility = displays.normal
        // Get & Store Targeted Height 
        transitionHandlers.reset(true)
        storedHeight = `${container.value.getBoundingClientRect().height}px`
        // Initiate Container Height & Transition Proper
        transitionHandlers.switch(!show.value)
        container.value.classList.add(classActive)
        // Wait till prepared & Then invoke the animations
        setTimeout(() => {
            transitionHandlers.switch(show.value)
            if (show.value) animate.enter()
            else animate.leave()
        }, 1)
    },
    start: (e) => { // 触发
        if (transitionHandlers.filter(e)) return
        isMoving = true
    },
    cancel: (e) => { // 中断 此情景即方向中转
        if (transitionHandlers.filter(e)) return
    },
    end: (e) => { // 结束
        if (transitionHandlers.filter(e)) return
        transitionHandlers.reset(show.value)
        content.value.style.visibility = show.value ? displays.normal : displays.hidden
        container.value.classList.remove(classActive)
        isMoving = false
    }
}
const classAdd = (_name) => content.value.classList.add(_name)
// const classDel = (_name) => content.value.classList.remove(_name)
const classRep = (_name, _name_new) => content.value.classList.replace(_name, _name_new)
const animate = {
    enter: () => classRep(states.hide, states.show),
    leave: () => classRep(states.show, states.hide)
}

onMounted(() => {
    watch(show, handlerSwitch)
    initTrans()
    container.value.addEventListener("transitionstart", transitionHandlers.start)
    container.value.addEventListener("transitioncancel", transitionHandlers.cancel)
    container.value.addEventListener("transitionend", transitionHandlers.end)
})
</script>

<style lang="scss" scoped>
.wrapper {
    --animDuration: .3s;
    --animFunction: ease;
    border-radius: 12px;
    background-color: #fff;
    padding: 0;
    margin: 6px;
    overflow: hidden;
    height: fit-content;
    border: .2px solid #6666;

    .toolbar {
        box-sizing: content-box;
        height: 36px;
        width: 100%;
        display: inline-flex;
        vertical-align: middle;
        transition: border-bottom var(--animDuration) var(--animFunction);
        border-bottom: 2px solid #d8d8d8;

        &,
        * {
            transition: all .5s ease;
        }

        .title {
            padding-left: 1em;
            height: 36px;
            line-height: 36px;
            font-size: larger;
            width: 100%;
        }

        .checkbox {
            display: none;
        }

        label {
            background-color: #ebebeb;
            width: 24px;
            height: 24px;
            padding: 0;
            margin-top: 6px;
            margin-right: 6px;
            border-radius: 50%;

            .toggle {
                outline: none;
                user-select: none;
                width: 24px;
                height: 24px;
                margin: 0;
            }

            .toggle.folded {
                transform: rotate(-90deg);
            }

            &:has(.icon:focus, .icon:hover) {
                background-color: #e1e1e1;
                box-shadow: 0 0 5px 0 rgba(116, 116, 116, 0.3);
                scale: 1.2;
            }
        }
    }

    .toolbar.folded {
        border-bottom: 0 solid #d8d8d8;
    }

    .container {
        perspective: -50px;

        .content {
            padding: 8px;
        }
    }
}

.toggle-trans {
    transition-property: all;
    transition-duration: var(--animDuration);
    transition-timing-function: var(--animFunction);
}

.toggle-show {
    opacity: 1;
    transform: none;
}

.toggle-hide {
    opacity: 0;
    transform: rotateX(-60deg) translateY(-100%) scale(.5);
}

.container-active {
    transition-property: height;
    transition-duration: var(--animDuration);
    transition-timing-function: var(--animFunction);
    overflow-y: hidden;
}
</style>