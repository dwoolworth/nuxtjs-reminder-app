<script setup>
import {ref, reactive} from 'vue'
import Headers from "../../components/Headers"
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const components = {
  Headers
}

const userData = reactive({
  data: [{
    name: "Pmani",
    email: "mani@gmail.com",
    role: "admin",
  },
    {
      name: "Pmanu",
      email: "Pmanu@gmail.com",
      role: "user",
    },
    {
      name: "Pmass",
      email: "mass@gmail.com",
      role: "admin",
    },
  ],
  createEditModel: false,
  deleteModel: false,
  modelType: "",
  modelData: {
    name: '',
    email: "",
    role: ""
  }
})

const changeModel = (data, user) => {
  userData.modelType = data;
  userData.createEditModel = !userData.createEditModel;
  console.log("data-----", data);

  if (user) {
    userData.modelData = user
  } else {
    userData.modelData = {
      name: '',
      email: "",
      role: ""
    }
  }
  console.log("userData-----------", userData);
}
const stopPropagation = (event) => {
  event.stopPropagation();
}

const saveModel = (e) => {
  console.log("e------", e);
  console.log("userData-----------", userData);

}

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
        <tr v-for="(user, index) of userData.data">
          <td>{{ user?.name }}</td>
          <td>{{ user?.email }}</td>
          <td>{{ user?.role }}</td>
          <td class="cursor-pointer" @click="changeModel('edit', user)">
            <font-awesome-icon icon="fa-solid fa-pen"/>
          </td>
          <td class="cursor-pointer" @click="changeModel('delete', user)">
            <font-awesome-icon icon="fa-solid fa-trash"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
  <div @click="changeModel('close', false)" v-if="['create', 'edit'].includes(userData.modelType)"
       class="createEditUser">
    <div @click="stopPropagation" class="middleModel">
      <div class="d-flex justify-content-end">
        <div class="title fs20 cursor-pointer" @click="changeModel('close')">X</div>
      </div>

      <div v-if="userData?.modelType === 'create'">
        <div class="headTitle">Create User</div>
        <label>Create user details </label>
      </div>
      <div v-else-if="userData?.modelType === 'edit'">
        <div class="headTitle">Edit User</div>
        <label>Update user details </label>
      </div>

      <form @submit.prevent="saveModel">
        <div>
          <div class="mt-2 d-flex flex-column">
            <label>Name</label>
            <input type="text" v-model="userData.modelData.name"/>
          </div>
          <div class="mt-2 d-flex flex-column">
            <label>Email</label>
            <input type="email" v-model="userData.modelData.email"/>
          </div>
          <div class="mt-2 d-flex flex-column">
            <label>Role</label>
            <select name="admin" id="" v-model="userData.modelData.role">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
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

  <div @click="changeModel('close')" v-if="userData.modelType === 'delete'" class="createEditUser">
    <div @click="stopPropagation" class="middleModel">
      <div class="headTitle">Delete User</div>
      <label>Are you sure you want to delete <span class="bold"> mani </span>? </label>
      <div class="d-flex justify-content-center gap-3 mt-3 ">
        <button @click="changeModel('close')" class="button primarylite">Cancel</button>
        <button type="submit" class="button secondaryBtn">Delete</button>
      </div>
    </div>
  </div>
</template>
