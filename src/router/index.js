import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import RecordView from '../views/RecordView.vue'
import SettingsView from '../views/SettingsView.vue'

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
        }
    ]
})

export default router
