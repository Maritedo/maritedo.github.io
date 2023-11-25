<template>
  <div>
    <div class="grid-div">
      <DropdownView title="饼图数据">
        <DragList v-model:list="data"></DragList>
      </DropdownView>
      <DropdownView title="DEV">
        <div>
          <h2>饼图</h2>
          尺寸：<input type="range" min="10" max="512" step="1" v-model="size">
          <br>
          间距：<input type="range" min="0.1" max="0.9" step="0.01" v-model="padding">
        </div>
        <p> {{ msg }} </p>
      </DropdownView>
    </div>
    <DropdownView title="饼图" autoExpand>
      <PieChart :use-alt="useAlt" v-model:msg="msg" ref="pie" :size="size" :padding="padding" :datas="data">
      </PieChart>
    </DropdownView>
  </div>
</template>

<script setup>
const useAlt = ref(false);
const padding = ref(0.5);
const size = ref(512);
const data = ref([
  { name: "VeryVeryVeryVeryLongNameForTest", value: 7 },
  { name: "Short", value: 1 }
]);
const pie = ref();
const msg = ref("");
</script>

<style lang="scss" scoped>
.grid-div {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>