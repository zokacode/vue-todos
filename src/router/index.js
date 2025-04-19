import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/Login/index.vue'
import RegisterView from '@/views/Register/index.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/Test/index.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/user',
            children: [
                {
                    path: 'todos',
                    name: 'todos',
                    component: () => import('@/views/Todos/index.vue')
                }
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
        next('/login');
    } else {
        next();
    }
});

export default router
