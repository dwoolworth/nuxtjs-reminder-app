<script setup>
import {ref, reactive} from 'vue'
import {useRouter} from "vue-router"

const router = useRouter()

const loginForm = reactive({
  email: "",
  password: ""
})

const formSubmit = () => {
  console.log("formSubmit-------", loginForm);
  router.push("/home");
}
</script>

<template>
  <div class="flexCenter vh-100 relative ">
    <div class="leftAbsLogin flexCenter ">
      <img src="../assets/img/PH-Image.png" alt="PH-Image" class="phImage"/>
      <img src="../assets/img/leftCurve.png" alt="rightCurve" srcset="">
    </div>
    <div class="loginBox boxShadow">
      <img src="../assets/img/PH-logo.png" alt="PH-logo">
      <h4 class="title  mt-3">Sign in to PH Intellect</h4>

      <form @submit.prevent="formSubmit" style="width: 90%;">
        <!-- <form> -->
        <div class="d-flex flex-column mt-2">
          <label for="email" class="label">Email</label>
          <input type="text" v-model="loginForm.email"/>
        </div>
        <div class="d-flex flex-column mt-2">
          <label for="email" class="label">Password</label>
          <input type="password" v-model="loginForm.password"/>
        </div>
        <div>
          <RouterLink class="link" to="forgotPassword">Forgot Password?</RouterLink>
        </div>
        <div class="text-center mt-4 ">
          <button type="submit" class="button primaryBtn">Send</button>
        </div>
      </form>

    </div>
    <div class="rightAbsLogin">
      <img src="../assets/img/rightCurve.png" alt="rightCurve" srcset="">
    </div>
  </div>
</template>