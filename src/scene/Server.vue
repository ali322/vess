<template>
  <div class="h-full flex">
    <ServerList
      :servers="servers"
      :index="index"
      @select="selectOne"
      @add="addOne"
      @remove="removeOne"
    />
    <ServerForm
      :server="servers[index]"
      :index="index"
      @run='runOne'
      @update="changeOne"
      v-if="servers.length > 0"
    />
  </div>
  <Confirm ref="confirmRef" />
</template>
<script lang="ts">
import { ref, computed, watch, defineComponent, defineAsyncComponent, reactive } from 'vue'
import { ArrowUpwardOutlined, ArrowDownwardOutlined, AddFilled, PlayArrowRound, StopRound, EditOutlined } from '@vicons/material'
import { tauri, event } from '@tauri-apps/api'
import { useStore, SAVE_SERVER, CREATE_SERVER, DELETE_SERVER, WRITE_OUTPUT, TOGGLE_RUNNING, PURGE_OUTPUT } from '../store'
import Modal from '../components/Modal.vue'
import Confirm from '../components/Confirm.vue'
import outbound from '../util/outbound'
import { mergeSettings } from '../util'

export default defineComponent({
  components: {
    ArrowUpwardOutlined, ArrowDownwardOutlined, AddFilled, PlayArrowRound, StopRound, EditOutlined,
    Modal, Confirm,
    ServerForm: defineAsyncComponent(() => import('./ServerForm.vue')),
    ServerList: defineAsyncComponent(() => import('./ServerList.vue')),
  },
  setup(props, context) {
    const confirmRef = ref<InstanceType<typeof Confirm>>()

    const store = useStore()
    const servers = computed(() => store.state.servers)
    const running = computed(() => store.state.running)
    let index = ref(0)
    watch(() => servers.value.length, (curr, prev) => {
      if (prev === 0 && curr > 0) {
        selectOne(curr - 1)
      }
    })
    const selectOne = (i: number) => {
      if (running.value === true) return
      index.value = i
    }
    const addOne = () => {
      store.commit(CREATE_SERVER, outbound)
      index.value = servers.value.length - 1
    }
    const changeOne = (server: Record<string, any>) => {
      store.commit(SAVE_SERVER, { server, index: index.value })
    }
    const removeOne = () => {
      const c = confirmRef.value as any
      c.show('Are u sure?', (isOk: boolean) => {
        if (isOk) {
          store.commit(DELETE_SERVER, index.value)
          index.value = servers.value.length - 1
        }
      })
    }
    event.listen('run-xray', (evt: { payload: string }) => {
      store.commit(WRITE_OUTPUT, evt.payload)
    })
    const startOne = async () => {
      const { servers, settings } = store.state
      let config = mergeSettings(servers[index.value], settings)
      tauri.invoke('run_xray', {config: JSON.stringify(config, null, 2)})
      store.commit(TOGGLE_RUNNING, true)
    }
    const stopOne = () => {
      event.emit('stop-xray')
      store.commit(PURGE_OUTPUT)
      store.commit(TOGGLE_RUNNING, false)
    }
    const runOne = () => {
      const { running } = store.state
      if (running) {
        stopOne()
      } else {
        startOne()
      }
    }

    return {
      selectOne,
      addOne,
      changeOne,
      runOne,
      removeOne,
      index,
      servers,
      running,
      confirmRef
    }
  }
})
</script>