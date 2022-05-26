<template>
  <div class="h-full flex">
    <Menu />
    <div class="flex-1">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </div>
    <Toast ref="toastRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onUnmounted, ref, provide } from 'vue'
import Menu from './Menu.vue'
import Toast from '../components/Toast.vue'

export default defineComponent({
  components: { Menu, Toast },
})
</script>
<style>
#app {
  font-family: "Monospaced Number", Chinese Quote, -apple-system,
    BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>