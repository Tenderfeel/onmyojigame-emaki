<script setup lang="ts">
import {  onMounted, computed } from 'vue';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import FirebaseConfig from './config/firebase-config'

import type { NextFn, User } from 'firebase/auth'

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  connectAuthEmulator,
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

import Toast from 'primevue/toast';
import PartsInput from './components/PartsInput.vue'
import TotalPoint from './components/TotalPoint.vue'
import TotalToday from './components/TotalToday.vue'
import LogPanel from './components/LogPanel.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

import { useStore } from './store/main'
import { useUserStore } from './store/user';

const app = initializeApp(FirebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

if (location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
}

// console.log(app)
// console.log(import.meta.env.VITE_HOST_FIRESTORE)

const userStore = useUserStore();
const store = useStore();

// サインインやサインアウトなど、認証の状態が変化したときにトリガーされる
const  authStateObserver: NextFn<User | null> = (user: User | null) => {
  //console.log('authStateObserver', user)
  if (user) { 
    // User is signed in!
    userStore.setUser(user)
  } else { 
    // User is signed out!
    userStore.profilePicUrl = ''
    userStore.userName = ''
  }
}


store.setup()

onMounted(() => {
  //console.log('onMounted:isSignedIn', userStore.isSignedIn)
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
})
</script>

<template>
  <SiteHeader />
  <main class="p-4">
    <div class="grid mb-4">
      <div class="col-12 md:col-6">
        <PartsInput class="md:pr-4" />
      </div>
      <div class="col-12 md:col-6">
        <TotalPoint />
        <TotalToday class="mt-4" />
      </div>
    </div>
    <LogPanel />
  </main>
  <Toast position="bottom-right" />
  <SiteFooter />
</template>


<style>
body {
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--surface-b);
    font-family: var(--font-family);
    font-weight: 400;
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
