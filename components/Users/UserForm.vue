<template>
  <div @click="$emit('close')" class="createEditUser">
    <div @click.stop class="middleModel">
      <div class="headTitle">Create/Edit User</div>
      <form @submit.prevent="handleSubmit">
        <div>
          <div class="mt-2 d-flex flex-column">
            <label>First Name</label>
            <input type="text" v-model="modelData.firstName"/>
          </div>
          <div class="mt-2 d-flex flex-column">
            <label>Last Name</label>
            <input type="text" v-model="modelData.lastName"/>
          </div>
          <div class="mt-2 d-flex flex-column">
            <label>Email</label>
            <input type="email" v-model="modelData.email"/>
          </div>
          <div v-if="modelType === 'create'">
            <div class="mt-2 d-flex flex-column">
              <label>Password</label>
              <input type="password" v-model="modelData.password"/>
            </div>
            <div class="mt-2 d-flex flex-column">
              <label>Phone Number</label>
              <input type="text" v-model="modelData.phoneNumber"/>
            </div>
            <div class="mt-2 d-flex flex-column">
              <label>Role</label>
              <select name="role" id="" v-model="modelData.role">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <div class="d-flex gap-4">
            <button @click="$emit('close')" class="button secondarylite">Cancel</button>
            <button type="submit" class="button primaryBtn">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelType: String,
  modelData: { type: Object, required: true }
})

const emit = defineEmits(['close', 'save'])

const handleSubmit = (event: Event) => {
  emit('save', { event, modelData: props.modelData });
}
</script>