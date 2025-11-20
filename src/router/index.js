import { createRouter, createWebHistory } from 'vue-router'
import { useExamStore } from '../stores/examStore'
import DashboardView from '../views/DashboardView.vue'
import RecordView from '../views/RecordView.vue'
import SettingsView from '../views/SettingsView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView
        },
        {
            path: '/record',
            name: 'record',
            component: RecordView
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { layout: 'empty' } // Custom meta to hide layout if needed
        }
    ]
})

router.beforeEach((to, from, next) => {
    const store = useExamStore()

    // If going to login, allow
    if (to.name === 'login') {
        next()
        return
    }

    // If password set but not authenticated, redirect to login
    if (store.hasPassword && !store.isAuthenticated) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
