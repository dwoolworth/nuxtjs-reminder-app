// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  ssr: false,

  css: [
    '~/assets/css/main.css',
    'bootstrap/dist/css/bootstrap.min.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  plugins: [
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' },
    { src: '~/plugins/fontawesome.ts', mode: 'client' }
  ],

  modules: [
    '@vesp/nuxt-fontawesome',
    '@pinia/nuxt',
    '@nuxtjs/web-vitals'
  ],

  webVitals: {
    provider: 'log',
    debug: true,
    disabled: false
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3080',
        changeOrigin: true
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3080',
      bearerToken: process.env.BEARER_TOKEN
    }
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks (id) {
            // Any modules coming from node_modules
            if (id.includes('node_modules')) {
              // For example, put Font Awesome in its own chunk
              if (id.includes('@fortawesome')) {
                return 'fontawesome'
              }
              // Put Bootstrap in its own chunk
              if (id.includes('bootstrap')) {
                return 'bootstrap'
              }
              // Everything else: a generic "vendor" chunk
              return 'vendor'
            }
          }
        }
      }
    }
  },

  pages: true, 
})
