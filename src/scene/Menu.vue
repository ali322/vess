<template>
  <div class="min-w-50px bg-dark-300">
    <router-link to="/" custom v-slot="{ navigate, isActive }">
      <div
        class="py-4 text-center cursor-pointer flex items-center justify-center"
        @click="navigate"
      >
        <PublicOutlined class="w-6 h-6" :class="isActive ? 'text-white' : 'text-gray-400'" />
      </div>
    </router-link>
    <router-link to="/log" custom v-slot="{ navigate, isActive }">
      <div
        class="py-4 text-center cursor-pointer flex items-center justify-center"
        @click="navigate"
      >
        <DescriptionOutlined class="w-6 h-6" :class="isActive ? 'text-white' : 'text-gray-400'" />
      </div>
    </router-link>
    <router-link to="/setting" custom v-slot="{ navigate, isActive }">
      <div
        class="py-4 text-center cursor-pointer flex items-center justify-center"
        @click="navigate"
      >
        <SettingsOutlined class="w-6 h-6" :class="isActive ? 'text-white' : 'text-gray-400'"></SettingsOutlined>
      </div>
    </router-link>
  </div>
</template>
<script lang="ts" setup>
import { SettingsOutlined, DescriptionOutlined, PublicOutlined } from '@vicons/material'
</script>