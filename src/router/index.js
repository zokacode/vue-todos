import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/Test/TestView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: HomeView
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
                    component: () => import('@/views/TodosView.vue')
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
