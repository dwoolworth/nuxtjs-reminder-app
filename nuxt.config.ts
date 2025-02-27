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

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
        },
      ],
    },
  },

  css: [
    '~/assets/css/main.css',
  ],

  plugins: [
    { src: '~/plugins/fontawesome.ts', mode: 'client' }
  ],

  modules: [
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
