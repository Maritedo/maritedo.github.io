<template>
    <div class="container" ref="container">
        <div v-for="val in vals" class="item">{{ val }}</div>
    </div>
    <span>
        <button @click="toLeft()">&leftarrow;</button>
        {{ index }}
        <button @click="toRight()">&rightarrow;</button>
    </span>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
const vals = ref(['a', 'bb', 'ccc', 'dddd', 'eeeee', 'ffffff']);
const index = ref(0), count = vals.value.length;
const container = ref();
const toLeft = () => {
    index.value = (count + index.value - 1) % count;
}
const toRight = () => {
    index.value = (index.value + 1) % count;
}
onMounted(() => {
    watch(index, (newId, oldId) => {
        container.value.children[newId].classList.add('on');
        if (oldId)
            container.value.children[oldId].classList.remove('on');
    }, { immediate: true });
});
</script>

<style lang="scss" scoped>
.container {
    background-color: #ddd;
    width: 100px;
    height: 100px;
    box-sizing: content-box;
    position: relative;
    overflow-x: hidden;
    border: #000 1px solid;

    .item {
        background-color: #fff;
        width: 100px;
        height: 100px;
        position: absolute;
        transition: left 2.3s ease;
        left: -100%;
    }

    .on {
        left: 0;
    }

    .pre {
        left: 100%;
    }
}
</style>