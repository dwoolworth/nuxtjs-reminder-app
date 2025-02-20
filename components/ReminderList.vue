<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4"></h2>

    <ul>

      <div class="wallet">
        <h3 class="wallet-title">Today's Reminders</h3>
        <div class="wallet-inner">
          <div class="card" v-for="(reminder, index) in reminders" :key="index" :class="{ 'completed': isCompleted(reminder) }">
            <div class="card-header">
              <span class="time">{{ reminder.time }}</span>
              <button v-if="!isCompleted(reminder)" @click="markAsCompleted(index)" class="complete-button">✓</button>
            </div>
            <div class="card-body">
              <p class="description">{{ reminder.description }}</p>
            </div>
          </div>

          <div class="add-reminder">
            <input type="text" v-model="newReminder.time" placeholder="Time (e.g., 10:00 AM)">
            <input type="text" v-model="newReminder.description" placeholder="Description">
            <button @click="addReminder">+</button>
          </div>
        </div>
      </div>

      <!-- Add your reminder list items here -->
      <!-- You can use a database or local storage to store the reminders -->
      <!-- and display them in this component -->
    </ul>

  </div>
</template>

<script>
export default {
  name: 'ReminderList',
  data() {
    return {
      reminders: [
        { time: '10:00 AM', description: "Mike's Birthday, make a call" },
        { time: '12:00 PM', description: "Project Meeting with Team" },
        { time: '3:00 PM', description: "Doctor's Appointment" },
        { time: '6:00 PM', description: "Gym Workout" },
        { time: '8:00 PM', description: "Dinner with Family" }
       // { time: '9:00 AM', description: "Completed Task", completed: true },
      ],
      newReminder: {
        time: '',
        description: '',
      },
      completedReminders: [],
    };
  },
  methods: {
    addReminder() {
      if (this.newReminder.time && this.newReminder.description) {
        this.reminders.push({ ...this.newReminder });
        this.newReminder.time = '';
        this.newReminder.description = '';
      }
    },
    markAsCompleted(index) {
      this.reminders[index].completed = true;
    },
    isCompleted(reminder) {
      return reminder.completed === true;
    }
  }
}
</script>

<style scoped>
/* Add the CSS styles here */
.reminder-list {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.wallet {
  background-color: #ececec; /* Mango background */
  border-radius: 10px;
  padding: 15px;
  width: 400px; /* Increased width for double credit card size */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #ececec;
}

.wallet-inner {
  background-color: #fafafa; /* Lighter mango shade */
  border-radius: 5px;
  padding: 10px;
  border: 1px solid #ececec;
}

.card {
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #ececec;
}

.card-header {
  color: #664d1a;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.complete-button {
  background-color: #664d1a;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 2px 5px;
  cursor: pointer;
}

.card-body {
  color: #664d1a;
}

.wallet-title {
  text-align: center;
  margin-bottom: 10px;
  color: #664d1a;
  font-weight: bold;
}

.add-reminder {
  display: flex;
  margin-top: 10px;
}

.add-reminder input {
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 125px; /* Set width for input fields */
}

.add-reminder button {
  padding: 5px 10px;
  background-color: #664d1a;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.completed {
  opacity: 0.5;
  text-decoration: line-through; /* Add strikethrough for completed tasks */
  color: #999; /* Dark gray color for completed reminders */
}

</style>
