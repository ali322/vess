<template>
  <div class="px-4">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-80px text-size-14px">Password</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="password"
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

const emit = defineEmits<{
  (e:'update'):void
}>()

interface Prop{
  server: Record<string, any>
}

const props = defineProps<Prop>()
const { server } = toRefs(props)

const password = computed({
  get() {
    return server.value.settings.servers[0].password
  },
  set(val) {
    server.value.settings.servers[0].password = val
    emit('update')
  }
})

</script>