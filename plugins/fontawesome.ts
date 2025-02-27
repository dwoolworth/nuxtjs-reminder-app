import { defineNuxtPlugin } from '#app'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faHouse,
    faArrowRightFromBracket,
    faPen,
    faTrash,
    faArrowLeft,
    faUsers,
    faSun,
    faMoon,
    faCircleCheck,
    faListCheck,
    faCloudSun,
    faCloudMoon,
    faCloud,
    faCloudMeatball,
    faCloudShowersHeavy,
    faCloudRain,
    faSnowflake,
    faBolt,
    faSmog,
    faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(
    faHouse,
    faArrowRightFromBracket,
    faPen,
    faTrash,
    faArrowLeft,
    faUsers,
    faSun,
    faMoon,
    faCircleCheck,
    faListCheck,
    faCloudSun,
    faCloudMoon,
    faCloud,
    faCloudMeatball,
    faCloudShowersHeavy,
    faCloudRain,
    faSnowflake,
    faBolt,
    faSmog,
    faQuestionCircle
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
