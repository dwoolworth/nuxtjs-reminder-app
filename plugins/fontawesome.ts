import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faHome, faEnvelope } from '@fortawesome/free-solid-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

// Add only the icons you need
library.add(faUser, faHome, faEnvelope)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
