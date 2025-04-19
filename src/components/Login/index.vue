<template>
  <div>
    <form class="formControls" @submit.prevent="signIn">
      <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
      <label class="formControls_label" for="email">Email</label>
      <input class="formControls_input" v-model="emailIn" type="text" id="email" name="email" placeholder="請輸入 email" required>
      <span>此欄位不可留空</span>
      <label class="formControls_label" for="pwd">密碼</label>
      <input class="formControls_input" v-model="pwdIn" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required>
      <input class="formControls_btnSubmit" type="submit" value="登入">
      <!-- <a class="formControls_btnLink" href="#signUpPage">註冊帳號</a> -->
      <RouterLink to="/register" class="formControls_btnLink">註冊帳號</RouterLink>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import { hexSignIn, hexCheckout } from '@/router/api.js';
  import axios from 'axios';
  import Swal from 'sweetalert2';

  const router = useRouter();
  // 登入
  const emailIn = ref('');
  const pwdIn = ref('');
  const token = ref('');

  onMounted(async () => {
    await checkUser();
  });

  const checkUser = async() => {
    token.value = document.cookie.replace(/(?:(?:^|.*;\s*)userTodo\s*\=\s*([^;]*).*$)|^.*$/, "$1", );
    if (token.value) {
      try {
        const res = await axios.get(`${hexCheckout}`, {
          headers: {
            Authorization: token.value,
          },
        });
        if (res.data.status == true) {
          router.push({ path: '/user/todos' });
        } else {
          document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
      } catch (err) {
        document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
    }
  };

  const signIn = async() => {
    try {
      const res = await axios.post(`${hexSignIn}`, {
        email: emailIn.value,
        password: pwdIn.value,
      });
      if (res.data.status == true) {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        document.cookie = `userTodo=${res.data.token}; expires=${now.toUTCString()}; path=/`;
        Swal.fire({
          title: '登入成功',
          icon: 'success',
          confirmButtonText: '關閉',
          confirmButtonColor: '#3085d6',
          timer: 1500
        });
        setTimeout(() => {
          router.push({ path: '/user/todos' });
        }, 3000);
      }
    } catch (err) {;
      Swal.fire({
        title: '登入失敗',
        icon: 'error',
        text: err.response.data.message,
        confirmButtonText: '關閉',
        confirmButtonColor: '#808080',
        timer: 1500
      });
    }
  };
</script>