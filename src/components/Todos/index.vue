<template>
    <nav>
        <h1><a href="#">ONLINE TODO LIST</a></h1>
        <ul>
            <li class="todo_sm"><a href="#"><span>{{ userName }}的代辦事項</span></a></li>
            <li><a href="#" @click.prevent="signOut">登出</a></li>
        </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
        <div class="todoList_Content">
            <div class="inputBox">
                <input v-model="newTodo" type="text" placeholder="請輸入待辦事項" required>
                <a href="#" @click.prevent="addTodo">
                    <i class="fa fa-plus"></i>
                </a>
            </div>
            <div class="todoList_nolist" v-if="todos.length == 0">
                <div class="d-flex justify-content-center align-items-center">
                    <p class="text-center">目前尚無待辦事項</p>
                    <div class="todoList_nolist_image"></div>
                    <!-- <img src="@/assets/images/empty.png"/> -->
                </div>
            </div>
            <div class="todoList_list" v-else>
                <ul class="todoList_tab">
                    <li>
                        <a href="#" :class="{ active: filterStatus == 'all' }" @click.prevent="setFilter('all')">
                            全部
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="{ active: filterStatus == 'false' }" @click.prevent="setFilter('false')">
                            待完成
                        </a>
                    </li>
                    <li>
                        <a href="#" :class="{ active: filterStatus == 'true' }" @click.prevent="setFilter('true')">
                            已完成
                        </a>
                    </li>
                </ul>
                <div class="todoList_items">
                    <div class="todoList_itemdiv">
                        <ul class="todoList_item" v-for="(todo, index) in filterTodos" :key="index">
                            <li>
                                <label class="todoList_label">
                                    <input class="todoList_input" type="checkbox" v-model="todo.status" @click.prevent="toggleStatus(todo.id)">
                                    <span>{{ todo.content }}</span>
                                </label>
                                <a href="#" @click.prevent="deleteTodo(todo.id)">
                                    <i class="fa fa-times"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="todoList_statistics">
                        <p v-if="filterStatus == 'true'"> {{ trueTodos.length }} 個已完成項目</p>
                        <p v-else> {{ falseTodos.length }} 個待完成項目</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { hexCheckout, hexGetTodo, hexInsTodo, hexToggleTodo, hexDelTodo } from '@/router/api.js';
    import axios from 'axios';
    import Swal from 'sweetalert2';

    const router = useRouter();
    const token = ref('');
    const userName = ref('未提供');
    const todos = ref([]);
    // 完成事項
    const trueTodos = ref('');
    // 待完成事項
    const falseTodos = ref('');
    // 切換狀態
    const filterStatus = ref('all');
    const newTodo = ref('');

    onMounted(async() => {
        await checkUser();
    });

    // 切換篩選狀態後更新表單內容
    const filterTodos = computed(() => {
        if (filterStatus.value == 'true') {
            return todos.value.filter(todo => todo.status);
        } else if (filterStatus.value == 'false') {
            return todos.value.filter(todo => !todo.status);
        } else {
            return todos.value;
        }
    });

    // 切換篩選的狀態
    const setFilter = (filter) => {
        filterStatus.value = filter;
    };

    const updateNum = async() => {
        trueTodos.value = todos.value.filter(todo => todo.status);
        falseTodos.value = todos.value.filter(todo => !todo.status);
    };

    // 登出
    const signOut = async() => {
        document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        Swal.fire({
            title: '登出成功',
            icon: 'success',
            confirmButtonText: '關閉',
            confirmButtonColor: '#3085d6',
            timer: 1500
        });
        setTimeout(() => {
            router.push({ name: 'login' });
        }, 3000);
    };

    /**
     * 檢查是否登入有效
     * @returns {Promise<void>}
     */
    const checkUser = async() => {
        // 取得 Cookie 中的 Token
        token.value = document.cookie.replace(/(?:(?:^|.*;\s*)userTodo\s*\=\s*([^;]*).*$)|^.*$/, "$1", );
        if (token.value) {
            try {
                //向 Server 發送 GET 請求
                const res = await axios.get(`${hexCheckout}`, {
                    headers: {
                        Authorization: token.value,
                    },
                });
                if (res.data.status == true) {
                    // 設定使用者名稱
                    userName.value = res.data.nickname;
                    // 取得待辦事項
                    await getTodos();
                }
            } catch (err) {
                // 登入失效
                Swal.fire({
                    title: '登入失效',
                    icon: 'error',
                    text: '請重新登入',
                    confirmButtonText: '關閉',
                    confirmButtonColor: '#808080',
                    timer: 1500
                });
                // 3 秒後登出
                setTimeout(() => {
                    document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    router.push({ name: 'login' });
                }, 3000);
            }
        } else {
            // Cookie 中沒有 Token
            Swal.fire({
                title: '登入失效',
                icon: 'error',
                text: '請重新登入',
                confirmButtonText: '關閉',
                confirmButtonColor: '#808080',
                timer: 1500
            });
            // 3 秒後登出
            setTimeout(() => {
                document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                router.push({ name: 'login' });
            }, 3000);
        }
    };

    // 取得待辦事項
    const getTodos = async() => {
        try {
            const res = await axios.get(`${hexGetTodo}`, {
                headers: {
                    Authorization: token.value,
                },
            });
            todos.value = res.data.data;
            updateNum();
        } catch (err) {
            document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            Swal.fire({
                title: '登入失效',
                icon: 'error',
                text: '請重新登入',
                confirmButtonText: '關閉',
                confirmButtonColor: '#808080',
                timer: 1500
            });
            setTimeout(() => {
                document.cookie = "userTodo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                router.push({ name: 'login' });
            }, 3000);
        }
    };

    // 新增事項
    const addTodo = async() => {
        if (!newTodo.value || !token.value) {
            return;
        }
        try {
            const api = hexInsTodo;
            const res = await axios.post(`${api}`, {
                content: newTodo.value,
            }, {
                headers: {
                    Authorization: token.value,
                },
            });
            if (res.data.status == true) {
                Swal.fire({
                    title: '新增成功',
                    icon: 'success',
                    confirmButtonText: '關閉',
                    confirmButtonColor: '#808080',
                    timer: 1500
                });
            }
            newTodo.value = '';
            await getTodos();
        } catch (err) {
            Swal.fire({
                title: '新增失敗',
                icon: 'error',
                text: '請重新新增',
                confirmButtonText: '關閉',
                confirmButtonColor: '#808080',
                timer: 1500
            });
            newTodo.value = '';
            await getTodos();
        }
    };

    // 刪除事項
    const deleteTodo = async(id) => {
        if (!token.value) {
            return;
        }
        try {
            const api = hexDelTodo(id);
            const res = await axios.delete(`${api}`, {
                headers: {
                    Authorization: token.value,
                },
            });
            if (res.data.status == true) {
                Swal.fire({
                    title: res.data.message,
                    icon: 'success',
                    confirmButtonText: '關閉',
                    confirmButtonColor: '#808080',
                    timer: 1500
                });
            }
            await getTodos();
        } catch (err) {
            Swal.fire({
                title: '刪除失敗',
                icon: 'error',
                text: '請重新切換',
                confirmButtonText: '關閉',
                confirmButtonColor: '#808080',
                timer: 1500
            });
            await getTodos();
        }
    };

    // 切換事項 完成or未完成
    const toggleStatus = async(id) => {
        if (!token.value) {
            return;
        }
        try {
            const api = hexToggleTodo(id);
            const res = await axios.patch(`${api}`, {}, {
                headers: {
                    Authorization: token.value,
                },
            });
            if (res.data.status == true) {
                Swal.fire({
                    title: res.data.message,
                    icon: 'success',
                    confirmButtonText: '關閉',
                    confirmButtonColor: '#808080',
                    timer: 1500
                });
            }
            await getTodos();
        } catch (err) {
            Swal.fire({
                title: '狀態更新失敗!',
                icon: 'error',
                text: '請重新切換',
                confirmButtonText: '關閉',
                confirmButtonColor: '#808080',
                timer: 1500
            });
            await getTodos();
        }
    };

</script>