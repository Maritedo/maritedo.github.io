<template>
    <div class="wrapper">
        <span class="stress"></span>
        <div class="container">
            <label class="label" v-for="(option)  in options" :key="option">
                <input :name="name" type="radio" :value="option" :checked="option == selectedOption"
                    @click="$event => $emit('change', $event.target.value)">
                <span tabindex="0" class="item" @keyup.enter.space="onClick" @keyup.left.up="onLeft"
                    @keyup.right.down="onRight">
                    {{ option }}
                </span>
            </label>
        </div>
    </div>
</template>


<script>
var index = 0;
</script>

<script setup>
defineProps({
    'options': {
        default: ["Default1", "Default2", "Default3"]
    },
    'selectedOption': {
        default: null
    }
})

defineEmits([
    'change'
])

const name = `_navBar_${index++}`

const onClick = (e) => {
    e.target.parentElement.click()
}
const onRight = (e) => {
    var ele = e.target.parentElement.nextSibling
    if (ele && (ele.nodeName == 'LABEL')) {
        e.target.blur()
        ele = ele.querySelector('span.item')
        ele.click()
        ele.focus()
    }
}
const onLeft = (e) => {
    var ele = e.target.parentElement.previousSibling
    if (ele && (ele.nodeName == 'LABEL')) {
        e.target.blur()
        ele = ele.querySelector('span.item')
        ele.click()
        ele.focus()
    }
}

</script>

<style scoped>
.wrapper,
.container * {
    transition: all .2s ease-in-out;
}

.wrapper {
    padding: 2px;
}

input {
    display: none;
}

.container {
    z-index: -1;
    background-color: transparent;
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    border-radius: 8px;
    background-color: #eeeef0;
    width: fit-content;
    height: 26px;
    padding: 2px 1px;
}

.item {
    user-select: none;
    display: inline-block;
    border-radius: 6px;
    padding: auto;
    min-width: 100px;
    overflow-y: hidden;
    box-sizing: border-box;
    background-color: transparent;
    text-align: center;
    width: fit-content;
    height: 22px;
    line-height: 22px;
    margin: 0px 1px;
    font-weight: bold;
    font-size: smaller;
}

.label:first-child .item {
    transform-origin: left center;
}
.label:last-child .item {
    transform-origin: right center;
}
.item:focus,
.item:hover {
    scale: 1.05 1.03;
}


input:checked+.item {
    background-color: #fff;
    box-shadow: -1px 1px 4px 0px #0003;
}
</style>