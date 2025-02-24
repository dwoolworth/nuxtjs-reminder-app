<script setup>
import {ref, reactive} from "vue";
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {fas} from '@fortawesome/free-solid-svg-icons';
import {onMounted} from 'vue';
import {useRouter} from 'vue-router'



const router = useRouter()
import {useAuthStore} from "~/store/auth.js";

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:3080'
const token = useCookie("token")
const bearerToken = config.public.bearerToken || token.value

const reminders = ref([]);
const totalReminders = ref(0);

const inspirationMessage = ref('')
const weather = ref({weather:[], sys:{}});

library.add(fas);

const weatherIcons = {
  "01d" : "fas fa-sun",
  "01n" : "fas fa-moon",
  "02d" : "fas fa-cloud-sun",
  "02n" : "fas fa-cloud-moon",
  "03d" : "fas fa-cloud",
  "03n" : "fas fa-cloud",
  "04d" : "fas fa-cloud-meatball",
  "04n" : "fas fa-cloud-meatball",
  "09d" : "fas fa-cloud-showers-heavy",
  "09n" : "fas fa-cloud-showers-heavy",
  "10d" : "fas fa-cloud-rain",
  "10n" : "fas fa-cloud-rain",
  "11d" : "fas fa-bolt",
  "11n" : "fas fa-bolt",
  "13d" : "fas fa-snowflake",
  "13n" : "fas fa-snowflake",
  "50d" : "fas fa-smog",
  "50n" : "fas fa-smog"
};

const dateAndTime = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const forecast = ref([]);

const position = ref({latitude:null, longitude:null});

/*
const position = reactive({
  latitude: 0,
  longitude: 0
}) */

// Function to get current position
const getCurrentPosition = () =>
{
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}


const fetchForecast = async () => {

  isLoading.value = true;

  const geoPosition = await getCurrentPosition()
  position.value.latitude = geoPosition.coords.latitude
  position.value.longitude = geoPosition.coords.longitude

  const apiKey = '56da4a21c8f2a9804194202b7cb98201';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${ position.value.latitude}&lon=${position.value.longitude }&units=imperial&appid=${apiKey}`);
    const data = await response.json();

    const dailyForecast = {};
    const today = new Date().getDate();

    data.list.forEach((entry) =>
    {
      const dateObj = new Date(entry.dt * 1000);
      const day = dateObj.getDate();

      if(day === today) return;

      const isTomorrow = day === today + 1;


    //  const formattedDate = `${dateObj.toLocaleDateString("en-US", { weekday: "long" })}, $(dateObj.getDate()}/$(dateObj.getMonth() + 1}`;

      const formattedDate = isTomorrow? `Tomorrow, ${dateObj.getDate()}/${dateObj.getMonth() + 1}` : `${dateObj.toLocaleDateString("en-US", {weekday : "long" })}, ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

      if(!dailyForecast[formattedDate])
      {
        dailyForecast[formattedDate] =
            {
              temp: entry.main.temp,
              feels_like : entry.main.feels_like,
              icon: entry.weather[0].icon,
              description: entry.weather[0].description,
            };
      }
    });

    const forecastEntries = Object.entries(dailyForecast).slice(0, 5);

    forecast.value = forecastEntries;
  }
  catch(error)
  {
    errorMessage.value = 'Failed to fetch forecast';
  }
  finally
  {
    isLoading.value = false;
  }
};

// Function to fetch inspiration
const fetchInspiration = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Get current position
    const geoPosition = await getCurrentPosition()
    position.value.latitude = geoPosition.coords.latitude
    position.value.longitude = geoPosition.coords.longitude

    const config = useRuntimeConfig();

    console.log("Fetch inspiration")
    const response = await useFetch(`${apiBaseUrl}/api/v1/ai/inspiration`, {
      method: 'POST',
      body: {
        longitude: position.value.longitude,
        latitude: position.value.latitude
      },      
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

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

const fetchReminders = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try
  {
    // Get current position
    const geoPosition = await getCurrentPosition()
    position.value.latitude = geoPosition.coords.latitude
    position.value.longitude = geoPosition.coords.longitude

    const config = useRuntimeConfig()
    console.log("Fetch Reminders")
    console.log(`${apiBaseUrl}/api/v1/reminder/`)

    const {data, error} = await useFetch(`${apiBaseUrl}/api/v1/reminder/`,
        {
          method: 'GET',
          headers:
              {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
        });

    if(error.value) throw new Error(response.error.value.message);

    if(data.value)
    {
      totalReminders.value = data.value.total;
      if(Array.isArray(data.value.reminders))
      {
        reminders.value = data.value.reminders;
        console.log('Loaded Reminders - ', reminders.value)
      }
    }

    console.log('API Response ',  reminders.value)


  }catch(error)
  {
    errorMessage.value = 'Failed to load reminders';
    console.log(error);
  }
  finally {
    isLoading.value = false;
  }
};


// Function to fetch inspiration
const fetchWeatherCard = async () =>
{
  isLoading.value = true
  errorMessage.value = ''

  try
  {

    // Get current position
    const geoPosition = await getCurrentPosition()
    position.value.latitude = geoPosition.coords.latitude
    position.value.longitude = geoPosition.coords.longitude

    const config = useRuntimeConfig()
    console.log("Fetch WeatherCard")
    const response = await useFetch(`${apiBaseUrl}/api/v1/weather`,
        {
          method: 'GET',
          query:
              {
                longitude: position.value.longitude,
                latitude: position.value.latitude
              },
          headers:
              {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        });

    if(response.error.value) throw new Error(response.error.value.message);

    weather.value = response.data.value || {weather: [], sys: {}};

  }
  catch(error)
  {
    console.error('Error fetching inspiration:', error)
    errorMessage.value = error.message || 'Failed to fetch weather. Please try again.'
  }
  finally
  {
    isLoading.value = false
  }
};


// Call fetchInspiration when the component is mounted
onMounted(fetchReminders)
onMounted(fetchInspiration)
onMounted(fetchWeatherCard)
onMounted(fetchForecast)

const formatDate = (dateString) => {
  /*const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2,'0');
  return `${year}-${month}-${day}`;*/

  /*const date = new Date(dateString);
  const options = { year: `numeric`, month: `2-digit`, day:`2-digit`};

  return date.toLocaleDateString('en-CA',options).replace(/\//g,'-');*/

  const date = new Date(dateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2,'0');

  return `${year}-${month}-${day}`;
}

const isOverdue = (dueDate) => {
  const currentDate = new Date();
  return new Date(dueDate) < currentDate;
}

const formatTime = (timestamp) =>
{
  if(!timestamp) return 'N/A';

  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

};



const getWeatherIconClass = () => {
  if(!weather.value.weather || !weather.value.weather[0]) return 'fas fa-question-circle';
  return weatherIcons[weather.value.weather[0].icon] || 'fas-fa-question-circle';
 };

const weatherIconUrl= () => {
  if(!weather.value.weather.length) return '';
  const iconCode = weather.value.weather[0]?.icon;

  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}

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
    //await authStore.allReminder();
    //await authStore.currentWeather();

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

<style scoped>
.weather-icon{
  font-size: 1.5rem;
  color:orange;
  filter: drop-shadow(1px 1px 3px white);
}
</style>

<template>
  <Headers/>
  <div class="p-4">
    <div class="d-flex gap-5">
      <div class="w-50">
        <div class="mt-2 p-0  boxReminder d-flex ">
          <div style="width: 60%" class="py-2 w-60 d-flex justify-content-around borderRightLine">
            <div class=" ps-4">
              <div>
                <p v-if = "isLoading"> Loading Weather ...</p>
                <p v-if="errorMessage" class="error"> {{errorMessage}}</p>

                <div v-if="weather && weather.weather && weather.sys">
                  <div class="curretTemperature">{{ weather.main?.temp }}°F </div>
                  <div class="normaltext">Feels like: <strong>{{ weather.main?.feels_like }}°F </strong></div>
                </div>

              </div>
              <div class="d-flex flex-column">
                <br/>
                <div class="normaltext">Sunrise: <strong>{{ formatTime(weather.sys?.sunrise) }} </strong></div>
                <div>
                  <img src="~/assets/img/timecurve.png" alt="timecurve">
                </div>
                <div class="normaltext">Sunset: <strong> {{ formatTime(weather.sys?.sunset) }} </strong> </div>

              </div>
              <div></div>
            </div>
            <div class=" d-flex align-items-center justify-content-around flex-column">
              <div class="cityHead">{{ weather?.name }}</div>
              <div>

                <font-awesome-icon :icon="weatherIcons[weather.weather[0]?.icon]" size="4x" color="orange"></font-awesome-icon>

              </div>
              <div class="cityHead">{{ weather.weather[0]?.description }}</div>
            </div>
          </div>
          <div style="width: 40%" class="p-2">

            <div v-if="forecast.length > 0">
              <div v-for="(data,index) in forecast" :key="index" class="forecast-day">

            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <font-awesome-icon :icon="weatherIcons[data[1].icon]" class="weather-icon"></font-awesome-icon>

              </div>
              <div class="temp">{{ Math.round(data[1].temp)}}°/{{ Math.round(data[1].feels_like) }}°</div>
              <div class="label">{{ data[0] }}</div>
            </div>
                </div>
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
     </div>
    <button @click="fetchInspiration" :disabled="isLoading">Refresh Inspiration</button>
  </div>
        </div>
      </div>

      <p v-if="isLoading">Loading Reminders....</p>
      <p v-if="errorMessage" class="error"> {{ errorMessage}} </p>
      <div class="w-50 mt-2">
        <div class="d-flex justify-content-between align-items-center ">
          <div class="lite-title">Reminders: {{ totalReminders }}</div>
          <div class="d-flex gap-4">
            <button class="primarylite button ">Hide Completed</button>
            <button class="primaryBtn button">Create New</button>
          </div>
        </div>
        <div v-if="reminders.length > 0">
          <div v-for="reminder in reminders" :key="reminder.id" >
        <div class="mt-4">
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">{{formatDate(reminder.dueDate)}}</div>
                <div v-if="isOverdue(reminder.dueDate)" class="overdue">Overdue</div>
                <div v-else class="todo">Todo</div>
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
                {{reminder.notes[0]?.title}}
              </div>
              <div class="normaltext">{{reminder.description}}</div>
            </div>
          </div>


        </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>