<script setup lang="ts">
import PartsInput from './components/PartsInput.vue'
import TotalPoint from './components/TotalPoint.vue'
import TotalToday from './components/TotalToday.vue'
import LogPanel from './components/LogPanel.vue'
import SiteFooter from './components/SiteFooter.vue'
import Toast from 'primevue/toast';
</script>

<template>
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
