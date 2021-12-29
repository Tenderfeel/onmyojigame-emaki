<template>
  <footer class="p-4 flex align-items-center justify-content-between">
    <p class="text-sm">絵巻欠片計算機 <a href="https://twitter.com/vesperfeel" target="_blank" rel="nofollow" class="text-purple-400 no-underline">@vesperfeel</a></p>
    <Button aria-label="ログをリセット" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined" @click="resetConfirm()" />
  </footer>
  <ConfirmDialog></ConfirmDialog>
</template>

<script lang="ts" setup>
import { useConfirm } from "primevue/useconfirm";
import { useStore } from '../store/main'
const store = useStore()
const confirm = useConfirm();

const resetConfirm = () => {
  confirm.require({
      //@ts-ignore
      header: 'リセット確認',
      message: '全データを消去しますか？',
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: () => {
        store.reset()
      },
  });
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>