<template>
  <div class="px-4">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-80px text-size-14px">ID</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="server.settings.vnext[0].users[0].id"
        class="py-1 rounded border-1 outline-1 border-gray-300 text-size-14px px-2 w-250px disabled:text-gray-500"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import { useStore } from '../store'

const store = useStore()
const running = computed(() => store.state.running)

interface Prop{
  server: Record<string, any>
}

const props = defineProps<Prop>()
const { server } = toRefs(props)

const emit = defineEmits<{
  (e:'update'):void
}>()

const id = computed({
  get() {
    return server.value.settings.vnext[0].users[0].id
  },
  set(val) {
    server.value.settings.vnext[0].users[0].id = val
    emit('update')
  }
})
</script>