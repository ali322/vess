import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), windicss()],
  resolve: {
    alias: {
      '@': join(__dirname, '..', 'src')
    }
  }
})
