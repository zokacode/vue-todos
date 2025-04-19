<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <RouterView />
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import HelloWorld from '@/components/Test/index.vue'
  import '@/assets/base.css';
</script>

<style scoped>

</style>
