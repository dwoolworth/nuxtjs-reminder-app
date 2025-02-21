<template>
  <div class="outer-container">
    <div v-if="weather" class="page-container">
      <div class="page">
        <div class="row">
          <div class="col-md-12">

            <div v-if="weather" class="d-flex justify-content-start align-items-start">
              <div class="grid-container">
                <div class="grid-item">
                  <span class="temp-display">{{ weather.main.temp }}°F</span>
                  <div class="feels-like-sunrise-sunset">
                    <span class="feels-like">Feels like: <strong>{{ weather.main.feels_like }}°F </strong></span><br>
                    <div class="sunrise-sunset-times">
                      <span class="sunrise">Sunrise: <strong>{{
                          formatTime24(weather.sys.sunrise)
                        }} {{ amPm(weather.sys.sunrise) }} </strong></span>

                      <img src="@/assets/img/weather_chart.png" alt="Image" class="inspiration-image small-image">
                      <span class="sunset">Sunset: <strong>{{
                          formatTime24(weather.sys.sunset)
                        }} {{ amPm(weather.sys.sunset) }} </strong></span>
                    </div>
                  </div>
                </div>
                <div class="grid-item">
                  <span class="city">{{ weather.name }}</span><br>
                  <img :src="weatherIcon" alt="Weather Icon" class="weather-icon-large rounded-circle mb-2"><br>
                  <span class="description">{{ weather.weather[0].description }}</span>
                </div>


                <div class="grid-item">

                  <div v-for="(day, index) in forecast" :key="index">
                    <div class="grid-container-forecast">
                      <div class="grid-item-forecast">
                        <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                             alt="Forecast Icon" class="forecast-icon">
                      </div>
                      <!-- <span class="forecast-temp">{{ getForecastTemp(day) }}/{{ getForecastFeelsLike(day) }}°F</span>-->
                      <span class="forecast-temp">{{ getForecastTemp(day) }}°F</span>


                      <div class="grid-item-forecast">
                        <span class="forecast-day">{{ formatForecastDate(day.dt, index) }}</span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <hr class="inspiration-separator">

        <div class="inspiration-container">
          <div class="inspiration-message">
            <p class="inspiration-title">Inspiration of the day!</p>
            <p class="generated-at">
              Generated at: {{ formattedTime }}
            </p>
            <br/>
            <p class="inspiration-content">{{ motivationMessage }}</p>
          </div>

        </div>
      </div>
    </div>

  </div>

</template>


<script>
export default {
  name: 'WeatherCard',
  data() {
    return {
      weather: null,
      forecast: [],
      weatherIcon: '',
      motivationMessage: 'Loading motivational message...',
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date()
    };
  },
  mounted() {
    this.updateTime();
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;
      const apiKey = '56da4a21c8f2a9804194202b7cb98201';
      const city = 'New York'
      console.log("longitude------", longitude)
      console.log("longitude----------", longitude)
      // const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
      // const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

      fetch(weatherApiUrl)
          .then(response => response.json())
          .then(data => {
            this.weather = data;
            this.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            this.fetchMotivationalMessage(data);
          })
          .catch(error => console.error('Error fetching weather data:', error));

      fetch(forecastApiUrl)
          .then(response => response.json())
          .then(data => {
            const dailyForecast = [];
            const seenDates = new Set();
            data.list.forEach(item => {
              const date = new Date(item.dt * 1000).toLocaleDateString();
              if (!seenDates.has(date)) {
                seenDates.add(date);
                dailyForecast.push(data.list.find(forecastItem => new Date(forecastItem.dt * 1000).toLocaleDateString() === date));
              }
            });
            this.forecast = dailyForecast.slice(0, 5);
          })
          .catch(error => console.error('Error fetching forecast data:', error));
    });
  },
  computed: {
    formattedTime() {
      return this.currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Use 12-hour format with AM/PM
      });
    }
  },
  methods: {
    formatDate(timestamp) {
      const options = {month: 'short', day: 'numeric'}; // Simplified date format
      return new Date(timestamp * 1000).toLocaleDateString('en-US', options);
    },
    formatForecastDate(timestamp, index) {
      const date = new Date(timestamp * 1000);
      const month = date.toLocaleDateString('en-US', {month: '2-digit'}); // Two-digit month
      const dayNum = date.getDate(); // Day of the month

      if (index === 0) {
        return `Tomorrow, ${dayNum}/${month}`;
      } else {

        const day = date.toLocaleDateString('en-US', {weekday: 'long'}); // Short day name

        return `${day}, ${dayNum}/${month}`; // Day, DD/MM format
      }
    },
    formatTime(timestamp) {
      return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Use 12-hour format with AM/PM
      });
    },
    updateTime() {
      this.currentTime = new Date();
    },
    formatTime24(timestamp) {
      return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
      });
    },
    getForecastTemp(forecastItem) {
      return Math.round(forecastItem.main.temp);
    },

    getForecastFeelsLike(forecastItem) {
      return Math.round(forecastItem.main.feels_like);
    },
    amPm(timestamp) {  // Returns "AM" or "PM"
      const date = new Date(timestamp * 1000);
      const hours = date.getHours();
      return hours < 12 || hours === 24 ? "AM" : "PM";
    },
    dayOfWeek(timestamp) {
      const options = {weekday: 'long'};
      return new Date(timestamp * 1000).toLocaleDateString('en-US', options);
    },
    fetchMotivationalMessage(weatherData) {
      const weatherCondition = weatherData.weather[0].description;
      const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

      console.log('Fetching motivational message from:', groqApiUrl);
      console.log('Weather condition:', weatherCondition);

      fetch(groqApiUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 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' // Replace with your actual Groq API key
            },
            body: JSON.stringify(
                {
                  model: "llama3-8b-8192", // Use a valid model from Groq API
                  messages: [
                    {role: "system", content: "You are a helpful assistant providing motivational health messages."},
                    {
                      role: "user",
                      content: `The weather today is ${weatherCondition}, Create a short, inspirational/uplifting message that reflects this weather and encourages a positive mindset and healthy habits.`
                    }],
                  max_tokens: 250,
                  temperature: 0.7,
                  top_p: 0.95
                })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Motivational message response:', data); // Check if choices exist in the response

            if (data.choices && data.choices.length > 0) {
              this.motivationMessage = data.choices[0].message.content.trim();
            } else {
              this.motivationMessage = "Stay positive and take care of your health!";
            }
          }).catch(error => console.error('Error fetching motivational message:', error));
    }
  }

}
</script>


<style scoped>
.weather-card {
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.temp-display {
  font-size: 3rem;
  font-weight: bold;
}

.feels-like {
  font-size: 1.3rem;
  color: #777;
}

.city {
  font-size: 1.5rem;
  font-weight: bold;
}


.forecast-day {
  color: #333;
  margin-bottom: 2px;
  padding-left: 15px; /* Add gap before the word */
  letter-spacing: 1px; /* Optional: Adjust letter spacing */
  white-space: nowrap;
}

.forecast-day {
  font-size: 0.9rem;
  color: #555;
}

.weather-icon-large {
  width: 6rem;
  height: 6rem;
  object-fit: cover;
}

.forecast-icon {
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
  margin-right: 2px;
}

.sunrise-sunset {
  font-size: 1rem;
  text-align: right;
}

.time-label {
  font-weight: bold;
}


.inspiration-content {
  text-align: center;
}

.inspiration-title {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}

.inspiration-message {
  font-size: 18px;
}


.feels-like-sunrise-sunset {
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack elements vertically */
}

.feels-like {
  margin-bottom: 5px; /* Add some spacing between elements */
}

.sunrise, .sunset {
  margin-bottom: 2px; /* Add some spacing between elements */
  align: right;
}

.city {
  font-size: 1.8rem; /* Increased city name size */
  font-weight: bold;
  margin-bottom: 10px; /* Added margin below city name */
}

.weather-icon-large {
  width: 10rem; /* Increased icon size */
  height: 10rem;
}

.description {
  font-size: 1.6rem; /* Increased description size */
  margin-top: 5px; /* Added margin above description */
}

.d-flex {
  justify-content: flex-start !important; /* Align to the left */
  align-items: flex-start !important;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: 10px;
  width: auto; /* Remove fixed width */
  margin: 0; /* Remove centering margin */
}

.grid-item {
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* Align items to the left within grid items */
  text-align: left; /* Align text to the left */
  padding: 10px;
  border: none; /* Remove card border */
  box-shadow: none; /* Remove card shadow */
}

.sunrise-sunset-times { /* New style for the time/duration group */
  display: flex;
  flex-direction: column; /* Stack vertically */
  align-items: center; /* Center horizontally */
  gap: 2px; /* Small gap between time/duration elements */
}


.d-flex {
  align-items: flex-start !important;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three equal columns */
  grid-auto-rows: auto;
  gap: 10px;
  width: 100%; /* Occupy 50% of the parent container's width */
  margin: 0 auto; /* Center the grid container */
}

.grid-item {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
}

.grid-item.card { /* Target the grid items that are also cards */
  border: 1px solid #ccc; /* Add a border to the cards */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
}

.grid-container-forecast {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  align-items: center;
}

.grid-item-forecast {
  justify-content: left;
  align-items: center;
  padding: 2px;
  font-size: smaller;
}

.inspiration-message { /* Style the inspiration message */
  margin-top: 20px; /* Add some space above the message */
  text-align: center;
}

.inspiration-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.inspiration-content {
  font-style: italic;
  color: #555;
}

.inspiration-separator { /* Style the separator line */
  margin-top: 20px; /* Add space above the line */
  border-top: 1px solid #ccc; /* Style the line (color, thickness) */
}

.inspiration-message {
  margin-top: 20px; /* Add space above the message (adjust as needed) */
  text-align: center;
}


.forecast-temp { /* Style for actual temperature */
  font-weight: bold;
  margin-bottom: 2px;
}

.inspiration-container {
  display: flex;
  align-items: center; /* Vertically align */
  justify-content: space-between; /* Distribute space between */
  width: 100%; /* Ensure full width */
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  background-color: lightgray;
}

.inspiration-message {
  text-align: left;
}

.inspiration-image { /* Base styles for the image */
  height: auto; /* Maintain aspect ratio */
  margin-left: 20px; /* Add some space to the left */
  /* Add other styles as needed (e.g., border, rounded corners) */
}

.small-image { /* Styles for the smaller image size */
  width: 150px; /* Or whatever width you want */
}

.generated-at {
  font-size: 1.0rem; /* Smaller font size */
  color: #777; /* Lighter color */
  text-align: right;
  font-family: 'Arial', sans-serif; /* Example font - choose your own */
  font-style: italic; /* Italic style (optional) */
  margin-left: 10px;
}

.page-container {
  display: flex;
  flex-direction: row;
  width: 210mm;
  height: 297mm;
  margin: 20px 0 20px 20px;
  border: 1px solid #ccc;
  justify-content: flex-start;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-container {
  /* Styles for the card container */
  width: 300px; /* Or a specific width for the card */
}

.card {
  /* ... your existing card styles ... */
}

.page {
  width: 100%;
  height: 50%; /* Each page takes 50% height */
  padding: 20px;
  box-sizing: border-box;
  display: flex; /* Make each page a flex container if needed */
  flex-direction: column; /* Stack elements vertically within the page */
}

.reminders-page { /* Styles specifically for the reminders page */
  justify-content: center; /* Center content vertically */
  align-items: center; /* Center content horizontally */
}

.inspiration-separator {
  margin: 15px 0; /* Adjust margin as needed */
  border-top: 2px solid #ccc; /* Add a line */
}


.grid-item:nth-child(3n) { /* Every 3rd item (last in row) */
  border-left: 2px solid #ccc; /* Add right border */
}

.reminders-container { /* Styles for the reminders container */
  width: 50%; /* Takes 50% width */
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: flex-start; /* Align to the left by default */
}

.reminder-card-wrapper { /* Styles for the wrapper around each card */
  margin-bottom: 10px; /* Add space between cards */
  width: 100%; /* Make cards take full width of container */
}

.reminder-card {
  width: 100%; /* Make cards take full width of container */
}

.outer-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  box-sizing: border-box;
}

.right-content {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

.card-container {
  width: 300px; /* Or use flex: 1; for flexible width */
  margin: 0px 0 50px 50px;
}

.card {
  border: 1px solid #ccc; /* Example border */
  border-radius: 5px; /* Example rounded corners */
  padding: 20px; /* Example padding */
  box-sizing: border-box; /* Include padding in width */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  background-color: #fff; /* White background */
}

</style>

