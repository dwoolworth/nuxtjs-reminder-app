<template>
  <div class="flexCenter vh-100 relative">
    <div class="leftAbsLogin flexCenter">
      <img src="~/assets/img/PH-Image.png" alt="PH-Image" class="phImage"/>
      <img src="~/assets/img/leftCurve.png" alt="leftCurve">
    </div>
    
    <LoginForm />
    
    <div class="rightAbsLogin">
      <img src="~/assets/img/rightCurve.png" alt="rightCurve">
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
