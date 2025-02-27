<script setup>
import {ref, reactive, watchEffect, computed} from "vue";
import {useRouter} from 'vue-router'
import {useAuthStore} from "~/store/auth.js";

const router = useRouter()

const confirmDialog = ref(null);
const selectedReminderId = ref(null);
const hideCompleted = ref(false);

const today = computed(() => new Date().toISOString().split('T')[0]);

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:3080'
const token = useCookie("token")
const bearerToken = config.public.bearerToken || token.value

const reminders = ref([]);
const totalReminders = computed(() => reminders.value.length);

const isPopupOpen = ref(false);
const newReminder = ref({
  title: ``,
  notes: ``,
  dueDate: ``
})

const inspirationMessage = ref('')
const weather = ref({weather: [], sys: {}});

const weatherIcons = {
  "01d": ['fas', 'fa-sun'],
  "01n": ['fas', 'fa-moon'],
  "02d": ['fas', 'fa-cloud-sun'],
  "02n": ['fas', 'fa-cloud-moon'],
  "03d": ['fas', 'fa-cloud'],
  "03n": ['fas', 'fa-cloud'],
  "04d": ['fas', 'fa-cloud-meatball'],
  "04n": ['fas', 'fa-cloud-meatball'],
  "09d": ['fas', 'fa-cloud-showers-heavy'],
  "09n": ['fas', 'fa-cloud-showers-heavy'],
  "10d": ['fas', 'fa-cloud-rain'],
  "10n": ['fas', 'fa-cloud-rain'],
  "11d": ['fas', 'fa-bolt'],
  "11n": ['fas', 'fa-bolt'],
  "13d": ['fas', 'fa-snowflake'],
  "13n": ['fas', 'fa-snowflake'],
  "50d": ['fas', 'fa-smog'],
  "50n": ['fas', 'fa-smog']
};

const dateAndTime = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const forecast = ref([]);

const position = ref({latitude: null, longitude: null});

// Function to get current position
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

const showConfirmation = (id) => {
  selectedReminderId.value = id;
  confirmDialog.value.showModal();
}

const closeDialog = () => {
  confirmDialog.value.close();
}

const openPopup = () => {
  isPopupOpen.value = true;
}

const closePopup = () => {
  isPopupOpen.value = false;
  newReminder.value = {title: ``, dueDate: ``, notes: ``};
}

const createReminder = async () => {
  if (!newReminder.value.title || !newReminder.value.dueDate || !newReminder.value.notes) {
    return;
  }

  try {
    const data = await $fetch(`${apiBaseUrl}/api/v1/reminder`, {
      method: 'POST',
      body: {
        description: newReminder.value.notes,
        dueDate: newReminder.value.dueDate,
        status: 1,
        priority: 1
      },
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (data) {
      const reminderid = data._id;
      const resp = await $fetch(`${apiBaseUrl}/api/v1/note/${reminderid}/notes`, {
        method: 'POST',
        body: {
          title: newReminder.value.title
        },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (resp) {
        closePopup();
        await fetchReminders();
      } else {
        console.log('Failed to add reminder notes');
      }
    }
  } catch (error) {
    console.error('Error creating reminder:', error)
  }
};

const fetchForecast = async () => {
  try {
    const apiKey = '56da4a21c8f2a9804194202b7cb98201';
    const data = await $fetch(`https://api.openweathermap.org/data/2.5/forecast`, {
      method: 'GET',
      query: {
        lat: position.value.latitude,
        lon: position.value.longitude,
        units: 'imperial',
        appid: apiKey
      }
    });
    if (data) {
      const dailyForecast = {};
      const today = new Date().getDate();

      data.list.forEach((entry) => {
        const dateObj = new Date(entry.dt * 1000);
        const day = dateObj.getDate();

        if (day === today) return;

        const isTomorrow = day === today + 1;
        const formattedDate = isTomorrow
            ? `Tomorrow, ${dateObj.getDate()}/${dateObj.getMonth() + 1}`
            : `${dateObj.toLocaleDateString("en-US", { weekday: "long" })}, ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

        if (!dailyForecast[formattedDate]) {
          dailyForecast[formattedDate] = {
            temp: entry.main.temp,
            feels_like: entry.main.feels_like,
            icon: entry.weather[0].icon,
            description: entry.weather[0].description,
          };
        }
      });

      forecast.value = Object.entries(dailyForecast).slice(0, 5);
    }
  } catch (error) {
    console.error('Failed to fetch forecast:', error);
    return { success: false, error: 'Failed to fetch forecast' };
  }
  return { success: true };
};

const fetchInspiration = async () => {
  try {
    const data = await $fetch(`${apiBaseUrl}/api/v1/ai/inspiration`, {
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
    if (data) {
      inspirationMessage.value = data.inspirationalMessage;
      dateAndTime.value = new Date().toLocaleString();
    }
  } catch (error) {
    console.error('Failed to fetch inspiration:', error);
    return { success: false, error: 'Failed to get inspiration' };
  }
  return { success: true };
};

const fetchReminders = async () => {
  try {
    const data = await $fetch(`${apiBaseUrl}/api/v1/reminder/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (data) {
      // You cannot "set" a computed property but since reminders.length is this computed property,
      // it will update whenever reminders.value is updated.
      // totalReminders.value = data.total;
      if (Array.isArray(data.reminders)) {
        reminders.value = data.reminders;
      }
    }
  } catch (error) {
    console.error('Failed to load reminders:', error);
    return { success: false, error: 'Failed to load reminders' };
  }
  return { success: true };
};

const markAsCompleted = async (id) => {
  try {
    const currentReminder = await $fetch(`${apiBaseUrl}/api/v1/reminder/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (currentReminder) {
      const updatedReminder = await $fetch(`${apiBaseUrl}/api/v1/reminder/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: {
          "description": currentReminder.description,
          "dueDate": currentReminder.dueDate,
          "status": "COMPLETED",
          "priority": "true"
        }
      });
      if (updatedReminder) {
        const reminder = reminders.value.find(r => r._id === id);
        if (reminder) {
          reminder.status = 'COMPLETED';
        }
      } else {
        console.log('Failed to add reminder notes');
      }
    }
  } catch (error) {
    console.error('Error marking reminder as completed', error)
  }
}

const deleteReminder = async () => {
  if (!selectedReminderId.value) return;
  try {
    const data = await $fetch(`${apiBaseUrl}/api/v1/reminder/${selectedReminderId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    if (data) {
      reminders.value = reminders.value.filter(reminder => reminder._id !== selectedReminderId.value);
    } else {
      console.log('Failed to delete reminder');
    }
  } catch (error) {
    console.error('Error deleting reminder:', error);
  } finally {
    closeDialog();
  }
}

const fetchWeatherCard = async () => {
  try {
    const data = await $fetch(`${apiBaseUrl}/api/v1/weather`, {
      method: 'GET',
      query: {
        longitude: position.value.longitude,
        latitude: position.value.latitude
      },
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (data) {
      weather.value = data || { weather: [], sys: {} };
    }
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return { success: false, error: 'Failed to fetch weather' };
  }
  return { success: true };
};

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}`;
}

const toggleHideCompleted = () => {
  hideCompleted.value = !hideCompleted.value;
}

const filteredReminders = computed(() => {
  return hideCompleted.value ? reminders.value.filter(reminder => reminder.status !== 'COMPLETED') : reminders.value;
});

const isOverdue = (dueDate) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setUTCHours(0, 0, 0, 0);

  return due < today;
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A';

  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const getReminderClass = (dueDate) => {
  return isOverdue(dueDate) ? `overdue-card` : `todo-card`;
}

const getWeatherIconClass = () => {
  if (!weather.value.weather || !weather.value.weather[0]) return 'fas fa-question-circle';
  return weatherIcons[weather.value.weather[0].icon] || 'fas-fa-question-circle';
};

const weatherIconUrl = () => {
  if (!weather.value.weather.length) return '';
  const iconCode = weather.value.weather[0]?.icon;

  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}

// Initial data fetching
const fetchInitialData = async () => {
  const results = await Promise.allSettled([
    fetchReminders(),
    fetchInspiration(),
    fetchWeatherCard(),
    fetchForecast()
  ]);

  results.forEach((result, index) => {
    if (result.status === 'rejected' || (result.value && !result.value.success)) {
      const functionNames = ['Reminders', 'Inspiration', 'Weather', 'Forecast'];
      const errorMessage = result.reason || (result.value && result.value.error) || 'Unknown error';
      console.error(`Error fetching ${functionNames[index]}: ${errorMessage}`);
      // You can set specific error messages or handle errors as needed
    }
  });

  // You can set a general error message if any of the fetches failed
  if (results.some(result => result.status === 'rejected' || (result.value && !result.value.success))) {
    errorMessage.value = 'Some data could not be loaded. Please refresh or try again later.';
  }
};

// Watch for changes in position and refetch data
watchEffect(() => {
  if (position.value.latitude && position.value.longitude) {
    fetchInitialData();
  }
});

// Get initial position and fetch data
getCurrentPosition().then((geoPosition) => {
  position.value.latitude = geoPosition.coords.latitude;
  position.value.longitude = geoPosition.coords.longitude;
}).catch((error) => {
  console.error('Error getting geolocation:', error);
  errorMessage.value = 'Failed to get your location. Some features may not work correctly.';
  // Even if geolocation fails, we still try to fetch data
  fetchInitialData();
});

</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: gray;
}
.completedIcon {
  color: green;
}
.weather-icon {
  font-size: 1.5rem;
  color: orange;
  filter: drop-shadow(1px 1px 3px white);
}
.overdue-card {
  border: 2px solid #EA9494;
}
.overdue {
  border: 1px solid #900000;
  background: #ffefea;
  color: #900000;
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
  padding: 2px 8px;

}

.popup-content h3 {
  margin-top: 0;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #cccccc;
  border-radius: 5px;
}

dialog {
  border: none;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
}

.dialog-content h3 {
  margin-bottom: 10px;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn {
  background: #ccc;
  color: black;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #bbb;
}

.delete-btn {
  background: red;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background: darkred;
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
                <p v-if="isLoading"> Loading Weather ...</p>
                <p v-if="errorMessage" class="error"> {{ errorMessage }}</p>

                <div v-if="weather && weather.weather && weather.sys">
                  <div class="curretTemperature">{{ weather.main?.temp }}°F</div>
                  <div class="normaltext">Feels like: <strong>{{ weather.main?.feels_like }}°F </strong></div>
                </div>

              </div>
              <div class="d-flex flex-column">
                <br/>
                <div class="normaltext">Sunrise: <strong>{{ formatTime(weather.sys?.sunrise) }} </strong></div>
                <div>
                  <img src="~/assets/img/timecurve.png" alt="timecurve">
                </div>
                <div class="normaltext">Sunset: <strong> {{ formatTime(weather.sys?.sunset) }} </strong></div>

              </div>
              <div></div>
            </div>
            <div class=" d-flex align-items-center justify-content-around flex-column">
              <div class="cityHead">{{ weather?.name }}</div>
              <div>
                <font-awesome-icon :icon="weatherIcons[weather.weather[0]?.icon] || ['fas', 'fa-circle-check']" size="4x" color="orange" />

              </div>
              <div class="cityHead">{{ weather.weather[0]?.description }}</div>
            </div>
          </div>
          <div style="width: 40%" class="p-2">

            <div v-if="forecast.length > 0">
              <div v-for="(data,index) in forecast" :key="index" class="forecast-day">

                <div class="d-flex align-items-center justify-content-around p-2 ">
                  <div>
                    <font-awesome-icon :icon="weatherIcons[data[1].icon] || ['fas', 'fa-circle-check']" class="weather-icon" />
                  </div>
                  <div class="temp">{{ Math.round(data[1].temp) }}°/{{ Math.round(data[1].feels_like) }}°</div>
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
            <p v-if="isLoading" class="normaltext">Loading...</p>
            <p v-else-if="errorMessage">{{ errorMessage }}</p>
            <div v-else>
              <p class="normaltext">{{ inspirationMessage }}</p>
            </div>
            <button @click="fetchInspiration" :disabled="isLoading">Refresh Inspiration</button>
          </div>
        </div>
      </div>

      <div v-if="isPopupOpen" class="createEditUser">
        <div class="middleModel">
          <div class="headTitle">Create Reminder</div>
          <form @submit.prevent="createReminder">
            <div class="mt-2 d-flex flex-column">
              <label>Title </label>
              <input v-model="newReminder.title" type="text" required/>
            </div>
            <div class="mt-2 d-flex flex-column">
              <label>Notes </label>
              <textarea v-model="newReminder.notes" required></textarea>
            </div>
            <div class="mt-2 d-flex flex-column">
              <label>Due Date </label>
              <input v-model="newReminder.dueDate" type="date" :min="today" required/>
            </div>

            <div class="mt-4 d-flex justify-content-end">
              <div class="d-flex gap-4">
                <button type="submit" class="button primaryBtn">Save</button>
                <button @click="closePopup" class="button secondarylite">Cancel</button>
              </div>
            </div>

          </form>
        </div>
      </div>

      <dialog ref="confirmDialog">
        <div class="dialog-content">
          <h3> Are you sure? </h3>
          <p> Do you really want to delete this reminder ? </p>
          <div class="dialog-buttons">
            <button class="cancel-btn" @click="closeDialog">Cancel</button>
            <button class="delete-btn" @click="deleteReminder">Delete</button>
          </div>
        </div>
      </dialog>


      <p v-if="isLoading">Loading Reminders....</p>
      <p v-if="errorMessage" class="error"> {{ errorMessage }} </p>
      <div class="w-50 mt-2">
        <div class="d-flex justify-content-between align-items-center ">
          <div class="lite-title">Reminders: {{ totalReminders }}</div>
          <div class="d-flex gap-4">
            <button class="primarylite button " @click="toggleHideCompleted">
              {{ hideCompleted ? 'Show Completed' : 'Hide Completed' }}
            </button>
            <button @click="openPopup" class="primaryBtn button">Create New</button>
          </div>
        </div>
        <div v-if="reminders.length > 0">
          <div v-for="reminder in filteredReminders" :key="reminder._id">

            <div class="mt-4">
              <div class="my-3 boxReminder p-0" :class="getReminderClass(reminder.dueDate)">
                <div class="px-3 py-2  d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center gap-3">
                    <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                    <div class="normaltext">{{ formatDate(reminder.dueDate) }}</div>
                    <div v-if="isOverdue(reminder.dueDate)" class="overdue">Overdue</div>
                    <div v-else-if="reminder.status === 'COMPLETED'"></div>
                    <div v-else class="todo">Todo</div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <font-awesome-icon :icon="['fas', 'fa-trash']" @click="showConfirmation(reminder._id)" />
                    <font-awesome-icon :icon="['fas', 'fa-list-check']" />
                    <font-awesome-icon :icon="['fas', 'fa-circle-check']"
                                       :class="{ completedIcon: reminder.status === 'COMPLETED'}"
                                       @click="markAsCompleted(reminder._id)" />
                  </div>
                </div>
                <div class="borderBottomLine"></div>
                <div class="px-3 py-2 ">
                  <div class="reminderTitle">
                <span :class="{completed : reminder.status === 'COMPLETED'}">
                {{ reminder.notes[0]?.title }}
                      </span>
                  </div>
                  <div class="normaltext">
                <span :class="{completed : reminder.status === 'COMPLETED'}">
                  {{ reminder.description }}
              </span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
