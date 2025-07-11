import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.PAGES ? "/fukui-kanko-people-flow-visualization/" : "./",
  server: {
    port: 3004,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})
