<script>

import { defineComponent } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const formSubmit = () => {

}

export default defineComponent({
  components: { FontAwesomeIcon }
})
</script>

<template>
  <div class="flexCenter vh-100 relative ">
    <div class="leftAbsLogin flexCenter ">
      <img src="~/assets/img/PH-Image.png" alt="PH-Image" class="phImage"/>
      <img src="~/assets/img/leftCurve.png" alt="rightCurve" srcset="">
    </div>
    <div class="loginBox boxShadow">
      <div class="w-100">
        <RouterLink class="link" to="/">
          <font-awesome-icon icon="fa-solid fa-arrow-left"/>
          Back to Login</RouterLink>
      </div>
      <div class="width75">
        <div class="text-center">
          <img src="~/assets/img/PH-logo.png" alt="PH-logo">
        </div>
        <h4 class="title  mt-3">Forgot your password?</h4>

        <p class="normaltext">Enter your email and we will send you instructions on how to reset your password.
        </p>
        <form @submit.prevent="formSubmit">
          <div class="d-flex flex-column mt-2">
            <label for="email" class="label">Email</label>
            <input type="text"/>
          </div>
          <div class="text-center mt-4 ">
            <button class="button primaryBtn">Send</button>
          </div>
        </form>
      </div>

    </div>
    <div class="rightAbsLogin">
      <img src="~/assets/img/rightCurve.png" alt="rightCurve" srcset="">
    </div>
  </div>
</template>