<template>
  <footer class="p-4 flex align-items-center justify-content-between">
    <p class="text-sm">絵巻欠片計算機 <a href="https://twitter.com/vesperfeel" target="_blank" rel="external nofollow noopener" class="text-purple-400 no-underline">@vesperfeel</a></p>

    <div class="flex align-items-center" style="grid-gap: 2rem">
      <Button aria-label="ログをアップロード" v-tooltip="'ログをアップロード'" 
      :disabled="loading" icon="pi pi-upload" 
      class="p-button-rounded p-button-info p-button-outlined"
       @click="toggle"
      aria:haspopup="true" aria-controls="upload_panel" />

      <Button aria-label="ログをダウンロード" v-tooltip="'ログをダウンロード'" :disabled="loading" icon="pi pi-download" class="p-button-rounded p-button-info p-button-outlined" @click="onDownload()" />

      <Button aria-label="ログをリセット" v-tooltip="'ログをリセット'" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined" @click="resetConfirm()" />
    </div>
  </footer>
  <ConfirmDialog></ConfirmDialog>

  <OverlayPanel ref="op" appendTo="body" id="upload_panel" :showCloseIcon="true" v-model:visible="uploadModal" :breakpoints="{'960px': '40vw', '640px': '80vw'}" :style="{width: '300px'}">
    <FileUpload
       mode="basic"
       accept="application/json" 
       :maxFileSize="1000000"
       :custom-upload="true"
       @uploader="onImport" 
       chooceLabel="ファイルを選択してください"
       uploadLabel="Import"
       :disabled="loading"
    />
</OverlayPanel>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useConfirm } from "primevue/useconfirm";
import { useStore } from '../store/main'
import { useToast } from "primevue/usetoast";
import type { FileUploadRemoveEvent } from 'primevue/fileupload'
import type { Log } from '../store/main'

const store = useStore()
const confirm = useConfirm();
const toast = useToast();
const op = ref();

const uploadModal = ref(false)
const loading = ref(false)

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

// download json
const onDownload = () => {
  loading.value = true

  const blob = new Blob([JSON.stringify({
    small: store.small,
    medium: store.medium,
    large: store.large,
    logs: store.logs
  })], {
    type: 'application/json;charset=utf-8;'
  })

  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'emaki.json')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

   loading.value = false
}

const toggle = (event: Event) => {
  op.value.toggle(event);
};

// import json
const onImport = (event: FileUploadRemoveEvent) => {
  loading.value = true

  const file = event.files[0];

  const reader = new FileReader()
  reader.readAsText(file)

  reader.onload = async (e) => {
    try {
      let saveData = JSON.parse(e.target?.result as string)
      if (!saveData) {
        return toast.add({severity:'error', summary: 'Error', detail:'インポートできるデータがありませんでした', life: 3000});
      }

      const validateLogs = saveData.logs.every((log: Log) => {
        const keys = Object.keys(log)
        if (keys.length !== 8) return false
        if (!keys.includes('small') || typeof log.small !== 'number') return false
        if (!keys.includes('medium') || typeof log.medium !== 'number') return false
        if (!keys.includes('large') || typeof log.large !== 'number') return false
        if (!keys.includes('date') || typeof log.date !== 'string') return false
        if (!keys.includes('server') || typeof log.server !== 'number') return false
        if (!keys.includes('active') || typeof log.active !== 'boolean') return false
        if (!keys.includes('charge') || typeof log.charge !== 'boolean') return false
        if (!keys.includes('used') || typeof log.used !== 'boolean') return false
        return true
      })

      const validatePartsData = typeof saveData.small === 'number' && typeof saveData.medium === 'number' && typeof saveData.large === 'number'

      if (!validatePartsData || !validateLogs) {
        return toast.add({severity:'error', summary: 'Error', detail:'データに問題があるため、インポートができませんでした', life: 3000});
      }

      store.$patch((state) => {
        state.small = saveData.small
        state.medium = saveData.medium
        state.large = saveData.large
        state.logs = saveData.logs
      })
      store.save()
      event.files.length = 0
      toast.add({severity:'success', summary: 'Success', detail:'インポートしました', life: 3000});

      loading.value = false
      op.value = false
    } catch (e) {
      toast.add({severity:'error', summary: 'Error', detail:'不明なエラーが発生しました', life: 3000});
    }
  }
  
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>