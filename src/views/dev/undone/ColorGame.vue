<template>
    <n-layout>
        <n-layout-header>
            <n-button-group class="action_buttons">
                <n-button>开始游戏</n-button>
                <n-button>
                    <n-icon>
                        <Pause />
                    </n-icon>
                    暂停
                </n-button>
                <n-button>重新开始</n-button>
            </n-button-group>
            <div class="container">
                <table class="grid" :style="autoStyle">
                    <tr v-for="x in arr" :key="x">
                        <td v-for="y in arr" :key="y" :class="[isTarget(x, y) ? 'target' : null]">
                        </td>
                    </tr>
                </table>
            </div>
        </n-layout-header>
        <n-layout-content>
            <div class="testDisp"></div>
        </n-layout-content>
    </n-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Pause } from '@vicons/ionicons5';
const autoStyle = ref({
    "--normal": 'red',
    "--target": 'green'
});
const size = ref(10);
const n = ref(49);
const isTarget = (x, y) => {
    return (((x + 1) * size.value + y + 1) == n.value)
}
const arr = computed(() => {
    const result = []
    for (let i = 0; i < size.value; i++) {
        result.push(i)
    }
    return result
})
onMounted(() => {
    document.querySelector('table.grid').addEventListener('click', (e) => {
        const t = e.target;
        if(t.tagName == 'TD' && t.classList.contains('target'))
    })
})

</script>
<style lang="scss" scoped>
.action_buttons {
    margin-top: 20px;
    margin-bottom: 20px;
}

.container {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;


    table.grid {
        justify-self: center;
        display: flex;
        width: 300px;
        height: 300px;

        tr {
            display: flex;
            flex-direction: column;
            flex: 1;


            td {
                background-color: var(--normal);
                flex: 1;
                margin: 2px;

                &.target {
                    background-color: var(--target);
                }
            }
        }
    }
}
</style>