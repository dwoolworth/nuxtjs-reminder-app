// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},

    css: ['~/assets/css/main.css',
        'bootstrap/dist/css/bootstrap.min.css',
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],

    plugins: [
        {src: '~/plugins/bootstrap.client.ts', mode: 'client'},
        {src: '~/plugins/fontawesome.ts', mode: 'client'}],
    modules: ['@vesp/nuxt-fontawesome',
              '@pinia/nuxt',
    ],

    nitro: {
        devProxy: {
          '/api': {
            target: 'http://localhost:3080',
            changeOrigin: true,
          }
        }
      },
    runtimeConfig: {
        public: {
          apiBase: process.env.API_BASE_URL || 'http://localhost:3080'
        }
      },
    
      pages: true, 
})