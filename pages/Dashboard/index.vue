<script setup>


import {ref, reactive} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted} from 'vue';
import {useRouter} from 'vue-router'

const router = useRouter()
import {useAuthStore} from "~/store/auth.js";


const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:3080'
const token = useCookie("token")
const bearerToken = config.public.bearerToken || token.value

const inspirationMessage = ref('')
const weatherResponse = ref('')
const dateAndTime = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()

const position = reactive({
  latitude: 0,
  longitude: 0
})



// Function to get current position
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

// Function to fetch inspiration
const fetchInspiration = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Get current position
    const geoPosition = await getCurrentPosition()
    position.latitude = geoPosition.coords.latitude
    position.longitude = geoPosition.coords.longitude


    const config = useRuntimeConfig()
    console.log("Fetch inspiration")
    const response = await useFetch(`${apiBaseUrl}/api/v1/ai/inspiration`, {
      method: 'POST',
      body: {
        longitude: position.longitude,
        latitude: position.latitude
      },      
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

  //  const responseWeather = await useFetch(`${apiBaseUrl}/api/v1/weather`, {
   //   method: 'GET',
   //   params: {
   //     longitude: position.longitude,
   //     latitude: position.latitude
   //   },      
    //  headers: {
    //    Authorization: `Bearer ${bearerToken}`,
    //    'Content-Type': 'application/json',
    //    'Accept': 'application/json',
    //  },
   // });

    //weatherResponse = responseWeather.data;
   // if (!response.ok) {
    //  throw new Error('Failed to fetch users');
   // }

 //   if (error.value) throw error.value
console.log(response)
    inspirationMessage.value = response.data.value.inspirationalMessage // Adjust according to your API response structure
    dateAndTime.value = new Date().toLocaleString() // Current date and time
  } catch (error) {
    console.error('Error fetching inspiration:', error)
    errorMessage.value = 'Failed to get inspiration. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Call fetchInspiration when the component is mounted
onMounted(fetchInspiration)

const formSubmit = async () => {

  navigator.geolocation.getCurrentPosition(position => {
    console.log("position-----", position);
    let {
      latitude, longitude
    } = position.coords;
    console.log("latitude,   longitude----", latitude, longitude)
  })

  console.log("dashboard.............");

  errorMessage.value = ''
  isLoading.value = true
  try {
    await authStore.allReminder();
    await authStore.currentWeather();

    // router.push("/home")
  } catch (error) {
    console.error("Login failed", error)
    errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  formSubmit();
})


</script>

<template>
  <Headers/>
  <div class="p-4">
    <div class="d-flex gap-5">
      <div class="w-50">
        <div class="mt-2 p-0  boxReminder d-flex ">
          <div style="width: 60%" class="py-2 w-60 d-flex justify-content-around borderRightLine">
            <div class=" ps-4">
              <div>
                <div class="curretTemperature">75*F </div>
                <div class="normaltext">Feels like: 65*F</div>
              </div>
              <div class="d-flex flex-column">
                <div class="normaltext">Sunrise: 6:00AM</div>
                <div>
                  <img src="~/assets/img/timecurve.png" alt="timecurve">
                </div>
                <div class="normaltext">Sunset: 6:00PM</div>

              </div>
              <div></div>
            </div>
            <div class=" d-flex align-items-center justify-content-around flex-column">
              <div class="cityHead">San Francisco</div>
              <div>
                <img src="~/assets/img/noto_sun.png" alt="noto_sun">
              </div>
              <div class="cityHead">Sunny</div>
            </div>
          </div>
          <div style="width: 40%" class="p-2">
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-3 boxReminder ">
          <div class="d-flex justify-content-between align-items-center">
            <div class="title fs20"> Inspiration of the day!</div>
            <div class="label"> Generated at:
              <span>
                {{ dateAndTime }}
            </span>
            </div>
          </div>
          <hr/>
          <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <div v-else>
      <p>{{ inspirationMessage }}</p>
      <p>{{ dateAndTime }}</p>
    </div>
    <button @click="fetchInspiration" :disabled="isLoading">Refresh Inspiration</button>
  </div>
        </div>
      </div>
      <div class="w-50 mt-2">
        <div class="d-flex justify-content-between align-items-center ">
          <div class="lite-title">Reminders:10</div>
          <div class="d-flex gap-4">
            <button class="primarylite button ">Hide Completed</button>
            <button class="primaryBtn button">Create New</button>
          </div>
        </div>
        <div class="mt-4">
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>