<template>
  <Panel header="ログ">
      <template #icons>
          <Button label="消費を追加" class="p-button-outlined p-button-sm mr-2" @click="openUsedModal" />
          <Button label="課金を追加" class="p-button-outlined p-button-sm mr-2" @click="openChargeModal" />
      </template>

      <div v-if="!store.logs.length" style="color: var(--gray-200)">記録がありません</div>

      <template v-else>
        <Inplace v-for="(log, index) in store.formatLogs" :key="index" :active="log.active" class="log">
          <template #display>
            <div class="col-12 md:col-5 pb-0 md:py-0">
              <FormatDate :value="log.date" class="mr-2" />
              <Tag v-if="log.server" severity="danger">{{log.server}}</Tag>
              <i v-if="log.charge" class="pi pi-credit-card mr-1 text-yellow-300"></i>
            </div>
            <div class="col pt-0 md:py-0" :class="{'text-pink-200': log.used, 'text-yellow-300': log.charge }">小: {{log.small}}</div>
            <div class="col pt-0 md:py-0" :class="{'text-pink-200': log.used, 'text-yellow-300': log.charge }">中: {{log.medium}}</div>
            <div class="col pt-0 md:py-0" :class="{'text-pink-200': log.used, 'text-yellow-300': log.charge }">大: {{log.large}}</div>
            <div class="col-fixed  pt-0 md:pt-2 mr-2">
              <!-- 編集ボタン -->
              <Button icon="pi pi-pencil" class="p-button-secondary p-button-outlined" @click="log.active = true" />
            </div>
          </template>
          <template #content>
            <div class="flex align-items-center">
              <div class="mr-2">
                <!-- 削除ボタン -->
                <Button icon="pi pi-trash" class="p-button-danger" @click="deleteLog(log, index)" />
              </div>
              <div class="p-inputgroup mr-2">
                 <Calendar v-model="log.date" :showTime="true" :showSeconds="true" dateFormat="yy-mm-dd" :showIcon="true" />
              </div>
              <div class="p-inputgroup mr-2" v-if="log.used">
                <span class="p-inputgroup-addon">鯖</span>
                <InputNumber id="parts-server" v-model="log.server" showButtons :step="1" :min="1" :max="6" class="inputfield w-full" />
              </div>
              <div class="p-inputgroup mr-2">
                <span class="p-inputgroup-addon">小</span>
                <InputNumber id="parts-small" v-model="log.small" showButtons :step="1" :min="0" class="inputfield w-full" @input="store.save" />
              </div>
              <div class="p-inputgroup mr-2">
                <span class="p-inputgroup-addon">中</span>
                <InputNumber id="parts-medium" v-model="log.medium" showButtons :step="1" :min="0" class="inputfield w-full" @input="store.save" />
              </div>
              <div class="p-inputgroup mr-2">
                <span class="p-inputgroup-addon">大</span>
                <InputNumber id="parts-large" v-model="log.large" showButtons :step="1" :min="0" class="inputfield w-full" @input="store.save" />
              </div>
              <div class="mr-2">
              <!-- 閉じるボタン -->
              <Button icon="pi pi-times" class="p-button-secondary p-button-outlined" @click="log.active = false" />
            </div>
            </div>
          </template>
      </Inplace>
      </template>
  </Panel>
  <Dialog header="欠片の消費ログを追加" v-model:visible="displayUsedModal" :style="{width: '50vw'}">
      <div class="p-inputgroup mb-2">
          <Calendar v-model="useLog.date" :showTime="true" :showSeconds="true" dateFormat="yy-mm-dd" :showIcon="true" />
      </div>
      <div class="p-inputgroup mb-2">
        <!-- サーバー -->
        <Dropdown v-model="useLog.server" aria-required="true" :options="servers" optionLabel="name" optionValue="value" placeholder="サーバー" />
      </div>
      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">小</span>
        <InputNumber id="parts-small" v-model="useLog.small" showButtons :step="1" :min="0" class="inputfield w-full" />
      </div>
      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">中</span>
        <InputNumber id="parts-medium" v-model="useLog.medium" showButtons :step="1" :min="0" class="inputfield w-full" />
      </div>
      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">大</span>
        <InputNumber id="parts-large" v-model="useLog.large" showButtons :step="1" :min="0" class="inputfield w-full" />
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeUsedModal" class="p-button-text"/>
        <Button label="OK" icon="pi pi-check" @click="addUseLog" autofocus />
      </template>
  </Dialog>

  <Dialog header="課金獲得ログを追加" v-model:visible="displayChargeModal" :style="{width: '50vw'}">
      <div class="p-inputgroup mb-2">
          <Calendar v-model="chargeLog.date" :showTime="true" :showSeconds="true" dateFormat="yy-mm-dd" :showIcon="true" />
      </div>
      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">中</span>
        <InputNumber id="parts-medium" v-model="chargeLog.medium" showButtons :step="1" :min="0" class="inputfield w-full" />
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeChargeModal" class="p-button-text"/>
        <Button label="OK" icon="pi pi-check" @click="addChargeLog" autofocus />
      </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useStore, Log, defaultLog } from '../store/main'
import { ref } from 'vue';
import Inplace from './Inplace.vue'

const store = useStore()
const servers = new Array(6).fill(null).map((n, i) => ({ name: i + 1, value: i + 1 }))
const displayUsedModal = ref(false);
const displayChargeModal = ref(false)

const useLog = ref<Log>({
  ...defaultLog
})

const chargeLog = ref<Log>({
  ...defaultLog
})

const openUsedModal = () => {
  displayUsedModal.value = true;
};
const closeUsedModal = () => {
  displayUsedModal.value = false;
};

const openChargeModal = () => {
  displayChargeModal.value = true;
};
const closeChargeModal = () => {
  displayChargeModal.value = false;
};

// ログ削除
const deleteLog = (log: Log, index: number) => {
  console.log(deleteLog)
  store.deleteLog(index)
}

// 消費ログを追加
const addUseLog = () => {
  const {
    small, medium, large, used, ...logs
  } = useLog.value

  if (!logs.server || (!small && !medium && !large)) {
    return
  }

  store.small -= small
  store.medium -= medium
  store.large -= large

  store.addLog({
    small,
    medium,
    large,
    used: true,
    ...logs
  })
  useLog.value = {...defaultLog}
  closeUsedModal()
}

// 課金ログを追加
const addChargeLog = () => {
  const {
    small, medium, large, charge, ...logs
  } = chargeLog.value

  if (!small && !medium && !large) {
    return
  }

  store.small += small
  store.medium += medium
  store.large += large


  store.addLog({
    small,
    medium,
    large,
    charge: true,
    ...logs
  })
  chargeLog.value = {...defaultLog}
  closeChargeModal()
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import FormatDate from './FormatDate.vue'
export default defineComponent({
  components: {
    FormatDate,
    Inplace
  }
})
</script>

<style scoped lang="scss">
.log + .log {
  border-top: solid 1px var(--gray-700);
  padding: .5rem 0 0;
}
</style>
