<script setup lang="ts">
import { ref, reactive } from 'vue'
import Headers from "../../components/Headers/index.vue"
import UserList from "../../components/Users/UserList.vue"
import UserForm from "../../components/Users/UserForm.vue"
import { useRuntimeConfig } from '#app'
import { useCookie } from '#app'
import type { UserApiResponse } from '~/types/user'
import { onMounted } from 'vue'

import { definePageMeta } from '#imports'
definePageMeta({
  middleware: 'auth'
})

const components = {
  Headers
}

interface UserData {
  data: Array<{ _id: string; name: string; email: string; role: string }>;
  createEditModel: boolean;
  deleteModel: boolean;
  modelType: string;
  modelData: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    role?: string
  };
}

const userData: UserData = reactive({
  data: [],
  createEditModel: false,
  deleteModel: false,
  modelType: "",
  modelData: {
    _id: undefined,
    firstName: '',
    lastName: '',
    email: "",
    password: "",
    phoneNumber: "",
    role: ""
  }
})

const pending = ref(false)
const error = ref<Record<string, any> | undefined | null>(undefined)

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:3080'
    // Get the token from the cookie
    const tokenCookie = useCookie('token')
    const bearerToken = tokenCookie.value
//const bearerToken = config.public.bearerToken || ''

if (!bearerToken) {
  console.error('Bearer token is not defined')
}

const fetchUsers = async () => {
  pending.value = true
  error.value = null

  console.log("bearerToken-----", bearerToken);

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const result: UserApiResponse = await response.json();
    userData.data = result.users.map(user => ({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.roles.join(', ')
    }));
  } catch (err) {
    error.value = err as Error;
    console.error('Error fetching users:', error);
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchUsers();
});

const changeModel = (data: string, user?: {
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role?: string
}) => {
  userData.modelType = data;
  userData.createEditModel = !userData.createEditModel;

  if (user) {
    const [firstName, lastName] = (user.name || '').split(' ');
    userData.modelData = {
      _id: user._id,
      firstName: firstName || user.firstName || '',
      lastName: lastName || user.lastName || '',
      email: user.email,
      password: user.password || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || ''
    };
  } else {
    userData.modelData = {
      _id: undefined,
      firstName: '',
      lastName: '',
      email: "",
      password: "",
      phoneNumber: "",
      role: ""
    };
  }
};

const stopPropagation = (event: Event) => {
  event.stopPropagation();
}

const saveModel = async ({ event, modelData }: { event: Event, modelData: any }) => {
  event.preventDefault();
  if (userData.modelType === 'create') {
    await addUser(modelData);
  } else if (userData.modelType === 'edit') {
    if (modelData._id) {
      await editUser(modelData);
    } else {
      console.error("User ID is missing for the edit operation.");
    }
  }
  changeModel('close');
  await fetchUsers();
}


const addUser = async (user: {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role?: string
}) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to add user');
    }
    const result = await response.json();
    console.log('User added successfully:', result);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const editUser = async (user: {
  _id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role?: string
}) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/user/${user._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to edit user');
    }
    const result = await response.json();
    console.log('User edited successfully:', result);
  } catch (error) {
    console.error('Error editing user:', error);
  }
};

const deleteUser = async (_id: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/user/${_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    console.log('User deleted successfully');
    // Call fetchUsers after successful deletion
    await fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
</script>



<template>
  <Headers/>
  <div class="pad36">
    <div class="d-flex justify-content-between">
      <div>
        <h4 class="headTitle">Users</h4>
      </div>
      <div>
        <button @click="changeModel('create')" class="button primaryBtn">Create New</button>
      </div>
    </div>
    <UserList
      :users="userData.data"
      :pending="pending"
      :error="error ?? undefined"
      @edit="changeModel('edit', $event)"
      @delete="deleteUser"
    />
    <UserForm
      v-if="['create', 'edit'].includes(userData.modelType)"
      :model-type="userData.modelType"
      :model-data="userData.modelData"
      @close="changeModel('close')"
      @save="saveModel"
    />
  </div>
</template>