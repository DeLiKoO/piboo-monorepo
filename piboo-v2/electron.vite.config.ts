import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@common': resolve('src/common/src'),
      }
    },
    plugins: [
      externalizeDepsPlugin(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/pdfkit/js/data',
            dest: '.'
          }
        ]
      }),
    ]
  },
  preload: {
    resolve: {
      alias: {
        '@common': resolve('src/common/src'),
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve('src/common/src'),
      }
    },
    plugins: [react()]
  }
})
