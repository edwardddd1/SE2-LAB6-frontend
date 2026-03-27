import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // Updated to match your new repository name
  base: process.env.NODE_ENV === 'production' ? '/SE2-LAB6-frontend/' : '/',
  plugins: [vue()],
})