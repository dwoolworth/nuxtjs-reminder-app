<script setup>
import {defineAsyncComponent, ref, watchEffect} from "vue";
import {useRouter} from 'vue-router'
import {useAuthStore} from "~/store/auth.js";

// Dynamic imports
const WeatherCard = defineAsyncComponent(() => import('@/components/WeatherCard.vue'))
const ReminderList = defineAsyncComponent(() => import('@/components/ReminderList.vue'))
const Headers = defineAsyncComponent(() => import('@/components/Headers/index.vue'))

const router = useRouter()

const confirmDialog = ref(null);
const selectedReminderId = ref(null);

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:3080'
const token = useCookie("token")
const bearerToken = config.public.bearerToken || token.value

const reminders = ref([]);
const totalReminders = ref(0);

const isPopupOpen = ref(false);
const newReminder = ref({
  title: ``,
  notes: ``,
  dueDate: ``
})

const inspirationMessage = ref('')
const weather = ref({ weather: [], sys: {} });

const weatherIcons = {
  "01d": "fas fa-sun",
  "01n": "fas fa-moon",
  "02d": "fas fa-cloud-sun",
  "02n": "fas fa-cloud-moon",
  "03d": "fas fa-cloud",
  "03n": "fas fa-cloud",
  "04d": "fas fa-cloud-meatball",
  "04n": "fas fa-cloud-meatball",
  "09d": "fas fa-cloud-showers-heavy",
  "09n": "fas fa-cloud-showers-heavy",
  "10d": "fas fa-cloud-rain",
  "10n": "fas fa-cloud-rain",
  "11d": "fas fa-bolt",
  "11n": "fas fa-bolt",
  "13d": "fas fa-snowflake",
  "13n": "fas fa-snowflake",
  "50d": "fas fa-smog",
  "50n": "fas fa-smog"
}

const position = ref({ latitude: null, longitude: null });
const errorMessage = ref('');

// Function to get current position
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const showConfirmation = (id) => {
  selectedReminderId.value = id;
  confirmDialog.value.showModal();
};

const closeDialog = () => {
  confirmDialog.value.close();
};

const openPopup = () => {
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  newReminder.value = { title: '', notes: '', dueDate: '' };
};

const createReminder = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      },
      body: JSON.stringify(newReminder.value)
    });

    if (!response.ok) {
      throw new Error('Failed to create reminder');
    }

    const data = await response.json();
    reminders.value.push(data);
    closePopup();
    await fetchReminders();
  } catch (error) {
    console.error('Error creating reminder:', error);
  }
};

const fetchForecast = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/weather/forecast?lat=${position.value.latitude}&lon=${position.value.longitude}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch forecast');
    }

    const data = await response.json();
    // Process and use the forecast data as needed
    console.log('Forecast data:', data);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
};

const fetchInspiration = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/inspiration`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inspiration');
    }

    const data = await response.json();
    inspirationMessage.value = data.quote;
  } catch (error) {
    console.error('Error fetching inspiration:', error);
  }
};

const fetchReminders = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/reminders`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reminders');
    }

    const data = await response.json();
    reminders.value = data.reminders;
    totalReminders.value = data.total;
  } catch (error) {
    console.error('Error fetching reminders:', error);
  }
};

const deleteReminder = async () => {
  if (!selectedReminderId.value) return;

  try {
    const response = await fetch(`${apiBaseUrl}/api/reminders/${selectedReminderId.value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete reminder');
    }

    reminders.value = reminders.value.filter(reminder => reminder.id !== selectedReminderId.value);
    closeDialog();
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
};

const fetchWeatherCard = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/weather?lat=${position.value.latitude}&lon=${position.value.longitude}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather');
    }

    weather.value = await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

// Utility functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const isOverdue = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getReminderClass = (dueDate) => {
  return isOverdue(dueDate) ? 'overdue-card' : '';
};

const getWeatherIconClass = () => {
  return weather.value.weather[0] ? weatherIcons[weather.value.weather[0].icon] : '';
};

const weatherIconUrl = () => {
  if (weather.value.weather[0]) {
    const iconCode = weather.value.weather[0].icon;
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  }
  return '';
};

// Initial data fetching
const fetchInitialData = async () => {
  const results = await Promise.allSettled([
    fetchWeatherCard(),
    fetchReminders(),
    fetchInspiration(),
    fetchForecast()
  ]);

  // You can set a general error
  // Handle any errors from the Promise.allSettled results
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Error in fetching data for index ${index}:`, result.reason);
      errorMessage.value = 'An error occurred while fetching data. Please try again later.';
    }
  });
};

// Lifecycle hooks
onMounted(async () => {
  try {
    const pos = await getCurrentPosition();
    position.value = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };
    await fetchInitialData();
  } catch (error) {
    console.error('Error getting current position:', error);
    errorMessage.value = 'Unable to get your current location. Please check your browser settings.';
  }
});

// Auth store
const authStore = useAuthStore();

// Watch for changes in auth state
watchEffect(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
  }
});
</script>

<template>
  <div>
    <Headers />
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="dashboard-content">
        <WeatherCard
            :weather="weather"
            :getWeatherIconClass="getWeatherIconClass"
            :weatherIconUrl="weatherIconUrl"
            :formatTime="formatTime"
        />

        <div class="inspiration-message">
          <p>{{ inspirationMessage }}</p>
        </div>

        <ReminderList
            :reminders="reminders"
            :totalReminders="totalReminders"
            :formatDate="formatDate"
            :getReminderClass="getReminderClass"
            @open-popup="openPopup"
            @show-confirmation="showConfirmation"
        />
      </div>

      <!-- Popup for creating a new reminder -->
      <div v-if="isPopupOpen" class="popup">
        <h2>Create New Reminder</h2>
        <form @submit.prevent="createReminder">
          <input v-model="newReminder.title" placeholder="Title" required>
          <textarea v-model="newReminder.notes" placeholder="Notes"></textarea>
          <input v-model="newReminder.dueDate" type="date" required>
          <button type="submit">Create</button>
          <button @click="closePopup">Cancel</button>
        </form>
      </div>

      <!-- Confirmation dialog for deleting a reminder -->
      <dialog ref="confirmDialog">
        <p>Are you sure you want to delete this reminder?</p>
        <button @click="deleteReminder">Yes</button>
        <button @click="closeDialog">No</button>
      </dialog>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.error-message {
  color: red;
  margin-bottom: 20px;
}

.inspiration-message {
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 20px;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.popup form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overdue-card {
  background-color: #ffe6e6;
}
</style>
