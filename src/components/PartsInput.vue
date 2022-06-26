<template>
  <div class="">
    <div class="field">
      <label for="parts-small">欠片・小</label>
      <InputNumber id="parts-small" v-model="store.small" showButtons :step="1" :min="0" class="inputfield w-full" @input="store.save" />
    </div>
    <div class="field">
      <label for="parts-medium ">欠片・中</label>
      <InputNumber id="parts-medium" v-model="store.medium" showButtons :step="1" :min="0" class="inputfield w-full" @change="store.save" />
    </div>
    <div class="field">
      <label for="parts-large">欠片・大</label>
      <InputNumber id="parts-large" v-model="store.large" showButtons :step="1" :min="0" class="inputfield w-full" @change="store.save" />
    </div>
    
    <div class="flex justify-content-between align-items-center">
      <Button label="ログ保存" @click="saveLog" :disabled="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store/main'
import { useToast } from "primevue/usetoast";

const store = useStore()

const toast = useToast();

const loading = ref(false)

async function saveLog() {
  loading.value = true

  const result = await store.addInputLog()
  toast.add({...result,  life: 3000});
  loading.value = false
}
</script>

<script lang="ts">
export default {
}
</script>