<template>
  <div class="py-2 flex-1">
    <div class="flex px-4 pb-4 pt-2 justify-end items-center">
      <div class="flex-1 text-left flex">
        <label class="mr-6 text-gray-500 w-80px">Tag</label>
        <input
          type="text"
          spellcheck="false"
          :disabled="running"
          v-model="tag"
          class="py-1 rounded border-1 border-gray-300 text-size-14px px-2 w-220px disabled:text-gray-500 outline-1"
        />
      </div>
      <button class="w-80px" :class="running ? 'btn-danger' : 'btn-success'" @click="run">
        <StopRound class="w-5 h-5" v-if="running"></StopRound>
        <PlayArrowRound class="w-5 h-5" v-else></PlayArrowRound>
        <span class="mx-1 py-1">{{ running ? 'stop' : 'run' }}</span>
      </button>
    </div>
    <div class="px-4">
      <div class="flex items-center py-2 text-left">
        <label class="mr-6 text-gray-500 w-80px text-size-14px">Protocol</label>
        <Select class="rounded pr-8" v-model:value="protocol" :disabled="running">
          <Option value="vless">vless</Option>
          <Option value="trojan">trojan</Option>
        </Select>
      </div>
      <div class="flex items-center py-2 text-left">
        <label class="mr-6 text-gray-500 w-80px text-size-14px">Host</label>
        <input
          type="text"
          spellcheck="false"
          :disabled="running"
          v-model="host"
          class="py-1 rounded border-1 outline-1 border-gray-300 text-size-14px px-2 w-250px disabled:text-gray-500"
        />
      </div>
      <div class="flex items-center py-2 text-left">
        <label class="mr-6 text-gray-500 w-80px text-size-14px">Port</label>
        <input
          type="text"
          spellcheck="false"
          :disabled="running"
          v-model="port"
          class="py-1 rounded border-1 outline-1 border-gray-300 text-size-14px px-2 w-250px disabled:text-gray-500"
        />
      </div>
    </div>
    <component :is="protocolForm" v-bind="{ server }" v-on:update="onServerUpdate" />
    <StreamSetting :server="server" @update="onServerUpdate" />
    <Toast ref="toastRef" />
  </div>
</template>
<script lang="ts">
import { ref, computed, toRefs, defineComponent, PropType, nextTick } from 'vue'
import { PlayArrowRound, StopRound, SaveOutlined } from '@vicons/material'
import { debounce } from 'ts-debounce'
import { useStore, SAVE_SERVER } from '../store'
import Select from '../components/Select.vue'
import Option from '../components/Option.vue'
import Confirm from '../components/Confirm.vue'
import Toast from '../components/Toast.vue'
import Vless from './Vless.vue'
import Trojan from './Trojan.vue'
import StreamSetting from './StreamSetting.vue'
import { outboundByProtocol } from '../util'

export default defineComponent({
  components: { PlayArrowRound, StopRound, SaveOutlined, Select, Option, Toast, Confirm, Trojan, Vless, StreamSetting },
  props: {
    server: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    index: Number
  },
  setup(props, context) {
    const { server } = toRefs(props)
    const toastRef = ref<InstanceType<typeof Toast>>()

    const store = useStore()
    const running = computed(() => store.state.running)
    const run = () => {
      context.emit('run')
    }
    const tag = computed({
      get() {
        return server.value.tag
      },
      set(val) {
        server.value.tag = val
        onServerUpdate()
      }
    })
    const protocol = computed({
      get() {
        return server.value.protocol
      },
      set(val: string) {
        server.value.protocol = val
        server.value.settings = outboundByProtocol(val)
        onServerUpdate()
      }
    })
    const host = computed({
      get() {
        if (server.value.protocol === 'vless') {
          return server.value.settings.vnext[0].address
        }
        if (server.value.protocol === 'trojan') {
          return server.value.settings.servers[0].address
        }
      },
      set(val: string) {
        if (server.value.protocol === 'vless') {
          server.value.settings.vnext[0].address = val
        }
        if (server.value.protocol === 'trojan') {
          server.value.settings.servers[0].address = val
        }
        onServerUpdate()
      }
    })
    const port = computed({
      get() {
        if (server.value.protocol === 'vless') {
          return server.value.settings.vnext[0].port
        }
        if (server.value.protocol === 'trojan') {
          return server.value.settings.servers[0].port
        }
      },
      set(val: string) {
        if (server.value.protocol === 'vless') {
          server.value.settings.vnext[0].port = parseInt(val)
        }
        if (server.value.protocol === 'trojan') {
          server.value.settings.servers[0].port = parseInt(val)
        }
        onServerUpdate()
      }
    })
    const d = debounce(() => {
      store.commit(SAVE_SERVER, { server: server.value, index: props.index })
    }, 300, {isImmediate: false})
    const onServerUpdate = () => {
      d()
    }
    const protocolForm = computed(() => {
      return server.value.protocol.replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase())
    })
    return {
      run, tag, protocol, host, port, running, toastRef, protocolForm, onServerUpdate
    }
  }
})

</script>