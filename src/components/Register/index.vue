<template>
  <div>
    <form class="formControls" @submit.prevent="signUp">
      <h2 class="formControls_txt">註冊帳號</h2>
      <label class="formControls_label" for="email">Email</label>
      <input class="formControls_input" v-model="emailRegister" type="text" id="email" name="email" placeholder="請輸入 email" required>
      <label class="formControls_label" for="name">您的暱稱</label>
      <input class="formControls_input" v-model="nicknameRegister" type="text" name="name" id="name" placeholder="請輸入您的暱稱" required>
      <label class="formControls_label" for="pwd">密碼</label>
      <input class="formControls_input" v-model="pwdRegister" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required>
      <label class="formControls_label" for="pwdCheck">再次輸入密碼</label>
      <input class="formControls_input" v-model="pwdCheck" type="password" id="pwdCheck" placeholder="請再次輸入密碼" required>
      <span v-if="pwdRegister !== pwdCheck && pwdCheck" class="text-danger">您輸入的與密碼不符。</span>
      <input class="formControls_btnSubmit" type="submit" value="註冊帳號">
      <!-- <a class="formControls_btnLink" href="#loginPage">登入</a> -->
      <RouterLink to="/login" class="formControls_btnLink">登入</RouterLink>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import { hexSignUp } from '@/router/api.js';
  import axios from 'axios';
  import Swal from 'sweetalert2';

  const router = useRouter();
  // 註冊
  const emailRegister = ref('');
  const nicknameRegister = ref('');
  const pwdRegister = ref('');
  const pwdCheck = ref('');

  /**
   * 註冊
   *
   * 1. 使用 email、nickname、password 3 個欄位
   * 2. 使用 POST 請求將資料傳到 Server
   * 3. Server 會回傳一個 status 的物件
   * 4. 如果 status == true, 代表註冊成功
   * 5. 如果 status == false, 代表註冊失敗
   *
   * @param {string} emailRegister - 註冊 email
   * @param {string} nicknameRegister - 註冊暱稱
   * @param {string} pwdRegister - 註冊密碼
   * @param {string} pwdCheck - 再次輸入密碼
   * @returns {Promise<void>}
   */
  const signUp = async() => {
    try {
      const res = await axios.post(`${hexSignUp}`, {
        email: emailRegister.value,
        nickname: nicknameRegister.value,
        password: pwdRegister.value,
      });

      /** 
       * Server 會回傳一個 status 的物件
       * 如果 status == true, 代表註冊成功
       * 如果 status == false, 代表註冊失敗
       */
      if (res.data.status == true) {
        // 註冊成功
        Swal.fire({
          title: '註冊成功',
          icon: 'success',
          confirmButtonText: '關閉',
          confirmButtonColor: '#3085d6',
          timer: 1500
        });

        // 3 秒後跳回登入頁面
        setTimeout(() => {
          router.push({ name: 'login' });
        }, 3000);
      } else {
        // 註冊失敗
        Swal.fire({
          title: '註冊失敗',
          icon: 'error',
          text: res.data.message,
          confirmButtonText: '關閉',
          confirmButtonColor: '#808080',
          timer: 1500
        });
      }
    } catch (err) {
      // 如果 Server 連線失敗, 顯示錯誤訊息
      Swal.fire({
        title: '註冊失敗',
        icon: 'error',
        text: err.response.data.message,
        confirmButtonText: '關閉',
        confirmButtonColor: '#808080',
        timer: 1500
      });
    }
  };
</script>