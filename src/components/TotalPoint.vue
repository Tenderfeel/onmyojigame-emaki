<template>
  <Panel header="合計ポイント">
    <div class="text-xl p-2">
      {{ store.total }}
    </div>

    <div class="flex">
      <div v-for="serv in Object.keys(store.server)" :key="serv" class="col flex align-items-center">
        <Tag :value="serv" severity="danger" class="mr-2" />
        <span :style="{color: 'var(--pink-200)'}">{{store.server[serv]}}</span>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { useStore } from '../store/main'
const store = useStore()
</script>


<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>