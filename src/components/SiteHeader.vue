<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useStore } from '../store/main'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth'

const store = useStore();
const confirm = useConfirm();
const userStore = useUserStore();

// Signs-in
async function signIn() {
  const provider = new GoogleAuthProvider();
  const signInResult: UserCredential = await signInWithPopup(getAuth(), provider);
  console.log('signInResult', signInResult)
}

// Signs-out
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

const items = computed(() => [
  {
    label:'Login',
    icon:'pi pi-fw pi-user',
    visible: !userStore.isSignedIn,
    command: async () => {
      await signIn()
    },
  }
])

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

<template>
  <div class="SiteHeader">
    <div class="SiteHeader__start">
      <div v-if="userStore.isSignedIn" class="flex align-items-center">
        <Button class="p-button-text p-button-plain">
          <Avatar v-if="userStore.profilePicUrl" :image="userStore.profilePicUrl" class="mr-2" shape="circle" />
          <Avatar v-else icon="pi pi-user" class="mr-2" shape="circle" />
          <span>{{ userStore.userName }}</span>
        </Button>
        <Menu id="overlay_user_menu" ref="menu" :model="items" :popup="true" />
      </div>
      <Button v-else label="Login" icon="pi pi-fw pi-user" class="p-button" @click="signIn()" />
    </div>
    <div class="SiteHeader__center flex-1">
      <div v-if="store.currentSeason" class="flex flex-column ml-4">
        <span class="font-bold block">{{ store.currentSeason.name }}</span>
        <span class="text-xs text-300 block">
          {{ store.currentSeason.period }}
        </span>
      </div>
    </div>
    <div class="SiteHeader__end">
      <Button aria-label="ログをリセット" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" @click="resetConfirm()" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '../store/user';
export default defineComponent({
})
</script>

<style scoped>

.SiteHeader {
  border: none !important;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: var(--surface-a);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem 1.5rem;
}
</style>