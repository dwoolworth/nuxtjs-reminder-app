<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import Headers from "../../components/Headers"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { useFetch } from '#app'
import type { User, UserApiResponse } from '~/types/user'

const components = {
  Headers
}

interface UserData {
  data: Array<{ _id: string; name: string; email: string; role: string }>;
  createEditModel: boolean;
  deleteModel: boolean;
  modelType: string;
  modelData: { _id?: string; firstName: string; lastName: string; email: string; password?: string; phoneNumber?: string; role?: string };
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
const error = ref<Error | null>(null)

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:3080'
const bearerToken = config.public.bearerToken || ''

if (!bearerToken) {
  console.error('Bearer token is not defined')
}

const fetchUsers = async () => {
  pending.value = true
  error.value = null
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

const changeModel = (data: string, user?: { _id?: string; firstName: string; lastName: string; email: string; password?: string; phoneNumber?: string; role?: string }) => {
  userData.modelType = data;
  userData.createEditModel = !userData.createEditModel;
  console.log("data-----", data);

  if (user) {
    userData.modelData = user
  } else {
    userData.modelData = {
      _id: undefined,
      firstName: '',
      lastName: '',
      email: "",
      password: "",
      phoneNumber: "",
      role: ""
    }
  }
  console.log("userData-----------", userData);
}

const stopPropagation = (event: Event) => {
  event.stopPropagation();
}

const saveModel = async (e: Event) => {
  e.preventDefault();
  if (userData.modelType === 'create') {
    await addUser(userData.modelData);
  } else if (userData.modelType === 'edit') {
    if (userData.modelData._id) {
      await editUser(userData.modelData);
    } else {
      console.error("User ID is missing for the edit operation.");
    }
  }
  changeModel('close');
  fetchUsers();
}


const addUser = async (user: { _id?: string; firstName: string; lastName: string; email: string; password?: string; phoneNumber?: string; role?: string }) => {
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

const editUser = async (user: { _id?: string; firstName: string; lastName?: string; email: string; password?: string; phoneNumber?: string; role?: string }) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/user/${user._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
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
          <tr v-for="(user, index) in userData.data" :key="index">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td class="cursor-pointer" @click="changeModel('edit', user)">
              <font-awesome-icon icon="fa-solid fa-pen"/>
            </td>
            <td class="cursor-pointer" @click="deleteUser(user.email)">
              <font-awesome-icon icon="fa-solid fa-trash"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div @click="changeModel('close', false)" v-if="['create', 'edit'].includes(userData.modelType)"
       class="createEditUser">
    <div @click="stopPropagation" class="middleModel">
      <div class="headTitle">Create/Edit User</div>
      <form @submit.prevent="saveModel">
        <div>
          <div class="mt-2 d-flex flex-column">
            <label>First Name</label>
            <input type="text" v-model="userData.modelData.firstName" />
          </div>
          <div class="mt-2 d-flex flex-column">
            <label>Last Name</label>
            <input type="text" v-model="userData.modelData.lastName" />
          </div>
          <div class="mt-2 d-flex flex-column">
            <label>Email</label>
            <input type="email" v-model="userData.modelData.email" />
          </div>
          <div v-if="userData.modelType === 'create'">
            <div class="mt-2 d-flex flex-column">
              <label>Password</label>
              <input type="password" v-model="userData.modelData.password" />
            </div>
            <div class="mt-2 d-flex flex-column">
              <label>Phone Number</label>
              <input type="text" v-model="userData.modelData.phoneNumber" />
            </div>
            <div class="mt-2 d-flex flex-column">
              <label>Role</label>
              <select name="role" id="" v-model="userData.modelData.role">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <div class="d-flex gap-4">
            <button @click="changeModel('close')" class="button secondarylite">Cancel</button>
            <button type="submit" class="button primaryBtn">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
