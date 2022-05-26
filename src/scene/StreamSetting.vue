<template>
  <div class="px-4">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-80px text-size-14px">Network</label>
      <Select
        class="rounded pr-8"
        v-model:value="server.streamSettings.network"
        :disabled="running"
      >
        <Option value="tcp">tcp</Option>
        <Option value="grpc">grpc</Option>
      </Select>
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-80px text-size-14px">Security</label>
      <Select class="rounded pr-8" v-model:value="security" :disabled="running">
        <Option value="none">none</Option>
        <Option value="tls">tls</Option>
        <Option value="xtls">xtls</Option>
      </Select>
    </div>
    <div class="flex items-center py-2 text-left" v-if="security === 'xtls'">
      <label class="mr-6 text-gray-500 w-80px text-size-14px">Flow</label>
      <Select class="rounded pr-8 w-240px" v-model:value="flow" :disabled="running">
        <Option value="xtls-rprx-direct">xtls-rprx-direct</Option>
        <Option value="xtls-rprx-direct-udp443">xtls-rprx-direct-udp443</Option>
      </Select>
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-80px text-size-14px">ServerName</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="serverName"
        class="py-1 rounded border-1 outline-1 border-gray-300 text-size-14px px-2 w-250px disabled:text-gray-500"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import { useStore } from '../store'
import Select from '../components/Select.vue'
import Option from '../components/Option.vue'

const emit = defineEmits<{
  (e: 'update'): void
}>()

const store = useStore()
const running = computed(() => store.state.running)

interface Prop {
  server: Record<string, any>
}

const props = defineProps<Prop>()
const { server } = toRefs(props)

const network = computed({
  get() {
    return server.value.streamSettings.network
  },
  set(val) {
    server.value.streamSettings.network = val
    emit('update')
  }
})

const serverName = computed({
  get() {
    if (server.value.streamSettings.security === 'tls') {
      return server.value.streamSettings.tlsSettings.serverName
    } else if (server.value.streamSettings.security === 'xtls') {
      return server.value.streamSettings.xtlsSettings.serverName
    }
  },
  set(val: string) {
    if (server.value.streamSettings.security === 'tls') {
      server.value.streamSettings.tlsSettings.serverName = val
      if (server.value.streamSettings.network === 'grpc') {
        server.value.streamSettings.grpcSettings = { serviceName: val }
      } else {
        server.value.streamSettings.grpcSettings = {}
      }
    } else if (server.value.streamSettings.security === 'xtls') {
      server.value.streamSettings.xtlsSettings.serverName = val
    }
    emit('update')
  }
})

const security = computed({
  get() {
    return server.value.streamSettings.security
  },
  set(val: string) {
    if (val === 'xtls') {
      server.value.streamSettings.xtlsSettings = server.value.streamSettings.xtlsSettings || { serverName: '' }
      server.value.streamSettings.tlsSettings = null
    }
    if (val === 'tls') {
      server.value.streamSettings.tlsSettings = server.value.streamSettings.tlsSettings || { serverName: '' }
      server.value.streamSettings.xtlsSettings = null
      flow.value = ''
    }
    server.value.streamSettings.security = val
    emit('update')
  }
})

const flow = computed({
  get() {
    if (server.value.protocol === 'vless' && security.value === 'xtls') {
      return server.value.settings.vnext[0].users[0].flow
    }
    if (server.value.protocol === 'trojan' && security.value === 'xtls') {
      return server.value.settings.servers[0].flow
    }
  },
  set(val: string) {
    if (server.value.protocol === 'vless' && security.value === 'xtls') {
      server.value.settings.vnext[0].users[0].flow = val
    }
    if (server.value.protocol === 'trojan' && security.value === 'xtls') {
      server.value.settings.servers[0].flow = val
    }
    emit('update')
  }
})
</script>