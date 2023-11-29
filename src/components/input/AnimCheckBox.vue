<template>
    <label class="checkbox_custom">
        <input ref="inputBox" type="checkbox" v-bind="$attrs" @click="handlerChange" :checked="checked" />
        <span class="checkbox" tabindex="0" @keyup.enter.space="onClick">
            <slot />
        </span>
    </label>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
    checked: {
        type: Boolean
    }
})
defineOptions({
    inheritAttrs: false
})
const $emits = defineEmits([
    'update:checked'
])
const inputBox = ref(null)

const handlerChange = () => {
    $emits('update:checked', inputBox.value.checked)
}

const onClick = (e) => {
    e.target.parentElement.click()
}
</script>

<style scoped>
@import url("./general.css");

/*未选中复选框获得焦点或被悬停*/
input[type="checkbox"]:not(:checked):hover + .checkbox::before,
input[type="checkbox"]:not(:checked) ~ .checkbox:focus::before {
    background-color: #0c55ff;
    transform: rotateZ(0deg);
}

input[type="checkbox"]:not(:checked):hover + .checkbox::after,
input[type="checkbox"]:not(:checked) ~ .checkbox:focus::after {
    background-color: #0c55ff;
    transform: rotateZ(-90deg);
}
</style>
