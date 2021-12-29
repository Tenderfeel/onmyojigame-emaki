<template>
  <Panel header="本日獲得数">
    <div class="flex justify-content-between">
      <div class=" p-2">小：{{store.dayTotal.small}}</div>
      <div class=" p-2">中：{{store.dayTotal.medium}}</div>
      <div class=" p-2">大：{{store.dayTotal.large}}</div>
    </div>
    <div class="bg-gray-900 text-yellow-300 p-2">
      <div class="flex align-items-center text-sm">
      <i class="pi pi-credit-card mr-1"></i>
      <span>課金獲得分</span>
      </div>
      <div class="flex justify-content-between text-sm pt-2">
        <div>小：{{store.chargeTotal.small}}</div>
        <div>中：{{store.chargeTotal.medium}}</div>
        <div>大：{{store.chargeTotal.large}}</div>
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