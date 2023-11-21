import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/

/**
 * handler types:
 * CacheFirst: Get dari cache terlebih dahulu, jika tidak ada cache baru mengambil dari network
 * CacheOnly: Hanya mengambil dari cache
 * NetworkFirst: Get dari network terlebih dahulu, jika network offline maka akan menggunakan cache
 * NetworkOnly: Sama kayak http biasa, tanpa menggunakan cache
 * StaleWhileRevalidate: Get dari cache dulu, sembari memperbaharui cache dari network
 * */
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/65571769bd4bcef8b6120891.mockapi.io\/api\/v1\/users$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'mockapi-users-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 10
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
        ]
      },
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Vue 3 PWA',
        short_name: 'vpwa',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
