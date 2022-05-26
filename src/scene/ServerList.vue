<template>
  <div class="py-2 h-full bg-light-500 flex flex-col w-40">
    <div
      class="flex-1 mx-2 mt-2 bg-white border-gray-300 border-width-1px overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-light-900"
    >
      <div
        class="cursor-pointer flex"
        v-for="(server, i) in servers"
        :key="i"
        @click="emit('select', i)"
      >
        <div
          class="flex-1 px-4 pt-1 pb-2 relative flex justify-center items-center"
          :class="[index == i ? 'bg-blue-500' : 'bg-white']"
        >
          <div
            class="leading-4 flex-1 text-left text-14px"
            :class="index === i && 'text-white'"
          >{{ server.tag }}</div>
          <div
            class="text-size-12px pt-1 text-right"
            :class="[index === i ? 'text-white' : 'text-gray-500']"
          >
            <p>{{ server.protocol }}</p>
            <p class="pt-1">{{ server.latency || 0 }} ms</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex mx-2 justify-center bg-light-300 items-center">
      <div
        class="flex-1 h-5 text-center flex justify-center cursor-pointer items-center border-gray-300 border-b-width-1px border-l-width-1px"
        @click="add"
      >
        <AddFilled class="w-4 h-4" :class="running ? 'text-gray-300' : 'text-gray-500'"></AddFilled>
      </div>
      <div
        class="flex-1 h-5 text-center flex justify-center items-center cursor-pointer border-gray-300 border-b-width-1px border-l-width-1px"
        @click="remove"
      >
        <MinusFilled class="w-4 h-4" :class="running ? 'text-gray-300' : 'text-gray-500'"></MinusFilled>
      </div>
      <div
        class="flex-1 h-5 text-center flex justify-center items-center cursor-pointer border-gray-300 border-b-width-1px border-l-width-1px border-r-width-1px"
        @click="ping"
      >
        <SpeedFilled class="w-4 h-4" :class="running ? 'text-gray-300' : 'text-gray-500'"></SpeedFilled>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AddFilled, MinusFilled, SpeedFilled, StopRound, PlayArrowRound } from '@vicons/material'
import { toRefs, computed, ref, Ref } from 'vue'
import { invoke, event } from '@tauri-apps/api'
import { useStore } from '../store'

interface Props {
  servers: Record<string, any>[],
  index: number
}

interface Emits {
  (e: 'select', i: number): void,
  (e: 'add'): void,
  (e: 'run'): void,
  (e: 'remove'): void
}

const emit = defineEmits<Emits>()

const props = defineProps<Props>()
const { servers, index } = toRefs(props)

const store = useStore()
const running = computed(() => store.state.running)
const add = () => {
  if(running.value) return
  emit('add')
}
const remove = () => {
  if(running.value) return
  emit('remove')
}
const ping = () => {
  const addrs = props.servers.map((server: Record<string ,any>) => {
    let addr = ''
    if (server.protocol === 'vless') {
      addr = server.settings.vnext[0].address
    }
    if (server.protocol === 'trojan') {
      addr = server.settings.servers[0].address
    }
    return addr
  })
  invoke('latencies', {addrs})
}
event.listen('latency', ({payload}: {payload: number[]}) => {
  payload.forEach((latency: number, i:number) => {
    servers.value[i].latency = latency
  })
})
</script>