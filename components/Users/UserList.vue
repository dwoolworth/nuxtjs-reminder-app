<template>
  <div class="cusTable">
    <div v-if="pending">Loading...</div>
    <div v-if="error">{{ error.message }}</div>
    <div v-if="!pending && !error">
      <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td class="cursor-pointer" @click="$emit('edit', user)">
            <font-awesome-icon :icon="['fas', 'fa-pen']"/>
          </td>
          <td class="cursor-pointer" @click="$emit('delete', user._id)">
            <font-awesome-icon :icon="['fas', 'fa-trash']"/>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>
</template>
  
<script setup lang="ts">
defineProps({
  users: Array<{ name: string, email: string, role: string, _id: string }>,
  pending: Boolean,
  error: Object
})
defineEmits(['edit', 'delete'])
</script>