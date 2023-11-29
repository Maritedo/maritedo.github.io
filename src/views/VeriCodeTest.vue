<template>
    <div class="grid-div">
        <DropdownView title="完·全·没·有·混·淆·能·力·的·验·证·码" autoExpand>
            <VericationCode :size='160' :length='4' :info="useInfo" :anim="useAnim" :debug="useDebug">
            </VericationCode>
        </DropdownView>
        <DropdownView title="DEV" autoExpand>
            <div>
                <h2>完·全·没·有·混·淆·能·力·的·验·证·码</h2>
                <AnimCheckBox v-model:checked="useDebug">边界</AnimCheckBox>
                <AnimCheckBox v-model:checked="useInfo">帧率</AnimCheckBox>
                <AnimCheckBox v-model:checked="useAnim">连续刷新</AnimCheckBox>
            </div>
        </DropdownView>
    </div>
</template>

<script setup>
const useDebug = ref(false)
const useInfo = ref(false)
const useAnim = ref(false)
</script>

<style lang="scss" scoped>
.grid-div {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
}
</style>