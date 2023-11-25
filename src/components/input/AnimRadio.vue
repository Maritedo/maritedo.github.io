<script setup>
defineProps({

})
defineOptions({
    inheritAttrs: false
})
</script>

<template>
    <label class="checkbox_custom">
        <input type="radio" v-bind="$attrs" />
        <span class="checkbox" tabindex="0" @keyup.enter.space="$event => $event.target.parentElement.click()">
            <slot />
        </span>
    </label>
</template>

<style scoped>
@import url("./general.css");

/*未选中单框获得焦点或被悬停*/
input[type="radio"]:not(:checked):hover + .checkbox::before,
input[type="radio"]:not(:checked) ~ .checkbox:focus::before {
    transform: rotateZ(135deg);
}

input[type="radio"]:not(:checked):hover + .checkbox::after,
input[type="radio"]:not(:checked) ~ .checkbox:focus::after {
    transform: rotateZ(45deg);
}
</style>
