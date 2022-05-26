<template>
  <div class="h-full">
    <div
      class="h-full p-2 bg-dark-600 text-left overflow-y-scroll text-size-14px text-white font-sans"
    >
      <p v-for="(line, i) in output" :key="i" class="leading-tight">{{ line }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '../store'
import { computed } from 'vue'

const store = useStore()

const output = computed(() => store.state.output)
</script>