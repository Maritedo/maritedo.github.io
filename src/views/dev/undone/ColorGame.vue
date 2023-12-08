<template>
    <n-layout>
        <n-layout-header style="margin-bottom: 24px;">
            <n-button-group class="action_buttons">
                <n-button @click="gameStart()" :disabled="!paused">开始游戏</n-button>
                <n-button @click="gamePause()" :disabled="paused">
                    <n-icon>
                        <Pause />
                    </n-icon>
                    暂停
                </n-button>
                <n-button @click="gameRestart()" :disabled="initial">重新开始</n-button>
            </n-button-group>
            <n-space justify="center">
                <n-statistic label="分数">
                    {{ scores }}
                </n-statistic>
                <n-divider vertical></n-divider>
                <div class="timer">{{ remainTime }}</div>
                <n-divider vertical></n-divider>
                <n-statistic label="最高分">
                    {{ topScore }}
                </n-statistic>
            </n-space>
        </n-layout-header>
        <n-layout-content>
            <div class="container">
                <table class="grid" :style="autoStyle">
                    <tr v-for="x in arr" :key="x">
                        <td v-for="y in arr" :key="y" :class="[paused ? 'paused' : (isTarget(x, y) ? 'target' : null)]">
                        </td>
                    </tr>
                </table>
            </div>
        </n-layout-content>
    </n-layout>
</template>

<script lang="js" setup>
import { ref, computed, onMounted } from 'vue';
import { Pause } from '@vicons/ionicons5';
import { Timer } from '@/scripts/normal';
const autoStyle = ref({
    "--normal": 'red',
    "--target": 'green'
});
const size = ref(3);
const n = ref(0);

const scores = ref(0);
const topScore = ref(0);

const remainTime = ref('0:00');

const isTarget = (x, y) => {
    return ((x * size.value + y + 1) == n.value)
}
const arr = computed(() => {
    const result = []
    for (let i = 0; i < size.value; i++) {
        result.push(i)
    }
    return result
})
const regenerate = () => {
    const i = n.value;
    while (n.value == i)
        n.value = Math.ceil(Math.random() * size.value ** 2);
}

const paused = ref(true);
const initial = ref(true);

const gameStart = () => {
    initial.value = false;
    gameTimer.start();
    paused.value = false;
}

const gamePause = () => {
    gameTimer.pause();
    paused.value = true;
}

const gameRestart = () => {
    paused.value = true;
    updateDisp(duration * 1000)
    gameTimer.reset();
}

function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

const gameEnd = () => {
    n.value = -1;
    alert('结束');
}

const updateDisp = (t) => {
    const seconds = t / 1000;
    remainTime.value = `${PrefixInteger(~~(seconds / 60), 2)}:${PrefixInteger(~~(seconds % 60), 2)}:${PrefixInteger(t % 1000, 3)}`
}

const duration = 60;
const gameTimer = new Timer(
    1000 * duration,
    updateDisp,
    gameEnd);
console.log(gameTimer)

onMounted(() => {
    document.querySelector('table.grid').addEventListener('click', (e) => {
        const t = e.target;
        if (t.tagName == 'TD' && t.classList.contains('target')) {
            scores.value++;
            if (scores.value > topScore.value) topScore.value = scores.value
            regenerate();
        }
    });
    updateDisp(duration * 1000);
    regenerate();
})

</script>
<style lang="scss" scoped>
.action_buttons {
    margin-top: 20px;
    margin-bottom: 20px;
}

.timer {
    display: block;
    width: 5em;
    padding: 0;
    margin: auto 40px;
    height: 100%;
    line-height: 100%;
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
                margin: 5%;
                transition: background-color .05s linear;

                &.target {
                    background-color: var(--target);
                }

                &.paused {
                    background-color: #333;
                }
            }
        }
    }
}
</style>