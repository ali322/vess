import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  plugins:[
    require('windicss/plugin/forms'),
    require('@windicss/plugin-scrollbar')
  ]
})