<template>
  <div class="h-full w-full p-6">
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Socket Port</label>
      <div class="flex-1 flex justify-end items-center">
        <input
          type="text"
          v-model="socketPort"
          class="py-1 rounded border-1 outline-1 border-gray-300 text-size-12px px-2 w-60px"
        />
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Http Port</label>
      <div class="flex-1 flex justify-end items-center">
        <input
          type="text"
          v-model="httpPort"
          class="py-1 rounded border-1 outline-1 border-gray-300 text-size-12px px-2 w-60px"
        />
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Extra Config</label>
      <div class="flex-1 flex justify-end items-center">
        <span class="text-size-12px px-2 py-1">{{ extra }}</span>
        <div class="ml-2 flex justify-center items-center" @click="changeExtra">
          <FolderOpenOutlined class="w-5 h-5 cursor-pointer"></FolderOpenOutlined>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Export Config</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="exportConfig">
          <SaveOutlined class="w-5 h-5 cursor-pointer"></SaveOutlined>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Import Servers</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="importServers">
          <UploadFilled class="w-5 h-5 cursor-pointer"></UploadFilled>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Export Servers</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="exportServers">
          <DownloadFilled class="w-5 h-5 cursor-pointer"></DownloadFilled>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-size-14px">Reset Settings</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="restore">
          <RestoreFilled class="w-5 h-5 cursor-pointer"></RestoreFilled>
        </div>
      </div>
    </div>
    <Toast ref="toastRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { path, dialog, tauri } from '@tauri-apps/api'
import { FolderOpenOutlined, RestoreFilled, UploadFilled, DownloadFilled, SaveOutlined } from '@vicons/material'
import { useStore, SAVE_SETTING, LOAD_SETTING, LOAD_SERVERS, initState } from '../store'
import Toast from '../components/Toast.vue'

export default defineComponent({
  components: { FolderOpenOutlined, RestoreFilled, UploadFilled, DownloadFilled, SaveOutlined, Toast },
  setup(props, context) {
    const toastRef = ref<InstanceType<typeof Toast>>()
    const store = useStore()
    const socketPort = computed({
      get() {
        return store.state.settings.socketPort
      },
      set(val) {
        store.commit(SAVE_SETTING, { field: 'socketPort', value: val })
      }
    })
    const httpPort = computed({
      get() {
        return store.state.settings.httpPort
      },
      set(val) {
        store.commit(SAVE_SETTING, { field: 'httpPort', value: val })
      }
    })
    const extra = computed({
      get() {
        return store.state.settings.extra
      },
      set(val) {
        store.commit(SAVE_SETTING, { field: 'extra', value: val })
      }
    })
    const changeExtra = async () => {
      const t = toastRef.value as any
      try {
        const homeDir = await path.homeDir()
        const extraFile = await dialog.open({
          defaultPath: await path.join(homeDir)
        })
        if (extraFile) {
          let extra = {}
          try {
            const content = await tauri.invoke("import_file", {path: extraFile})
            extra = JSON.parse(content as string)
          } catch (e) { }
          store.commit(SAVE_SETTING, { field: 'extra', value: extra })
          t.show('change extra config success')
        }
      } catch(e) {
        t.error(e)
      }
    }
    const exportConfig = async () => {
      const t = toastRef.value as any
      try {
        const resourceDir = await path.resourceDir()
        const homeDir = await path.homeDir()
        const file = await dialog.save({
          defaultPath: await path.join(homeDir)
        })
        await tauri.invoke('copy_file', {from: `${resourceDir}/config.json`, to: file})
        t.show("export config success")
      } catch(e) {
        t.error(e)
      }
    }
    const restore = () => {
      store.commit(LOAD_SETTING, initState.settings)
    }
    const importServers = async () => {
      const t = toastRef.value as any
      try {
        const homeDir = await path.homeDir()
        const importFile = await dialog.open({
          defaultPath: await path.join(homeDir)
        })
        if (importFile) {
          const content = await tauri.invoke("import_file", {path: importFile})
          const servers = JSON.parse(content as string)
          store.commit(LOAD_SERVERS, servers)
          t.show("import servers success")
        }
      } catch(e) {
        t.error(e)
      }
    }

    const exportServers = async () => {
      const t = toastRef.value as any
      try {
        const homeDir = await path.homeDir()
        const exportDir = await dialog.open({
          title: 'export to directory',
          defaultPath: await path.join(homeDir), 
          directory: true
        })
        if (exportDir) {
          await tauri.invoke("export_file", {path: `${exportDir as string}/server.json`, content: JSON.stringify(store.state.servers, null, 2)})
          t.show("export success")
        }
      } catch(e) {
        t.error(e)
      }
    }
    return {
      changeExtra, restore, socketPort, httpPort, extra, importServers, exportServers, exportConfig, toastRef
    }
  }
})
</script>