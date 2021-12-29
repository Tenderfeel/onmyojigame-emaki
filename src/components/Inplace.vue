<template>
  <div class="w-full">
    <div v-if="!active" class="grid align-items-center">
      <slot name="display" />
    </div>
    <div v-if="active" class="grid align-items-center">
      <slot name="content" />  
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    
  },
})
</script>
