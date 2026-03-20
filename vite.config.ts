import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Packages internes — import MypkgReact/RouterBuilder/RouteBuilder
      'MypkgReact': path.resolve(__dirname, 'mypkg_packages_react'),
    },
  },
})

