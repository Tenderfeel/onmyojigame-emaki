<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import PartsInput from './components/PartsInput.vue'
import TotalPoint from './components/TotalPoint.vue'
import TotalToday from './components/TotalToday.vue'
import LogPanel from './components/LogPanel.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <main class="p-4">
    <div class="flex flex-row flex-wrap mb-4">
      <div class="col-6 p-0">
        <PartsInput />
      </div>
      <div class="col-6 p-0">
        <TotalPoint />
        <TotalToday class="mt-4" />
      </div>
    </div>
    <LogPanel />
  </main>
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
