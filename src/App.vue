<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { HomeIcon, PlusCircleIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { HomeIcon as HomeIconSolid, PlusCircleIcon as PlusCircleIconSolid, Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/vue/24/solid'

const route = useRoute()

const navigation = [
  { name: '看板', to: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: '打卡', to: '/record', icon: PlusCircleIcon, activeIcon: PlusCircleIconSolid },
  { name: '设置', to: '/settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto pb-20 scroll-smooth">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Bottom Navigation -->
    <nav 
      v-if="route.name !== 'login'" 
      class="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50"
    >
      <div class="flex justify-around items-center h-16 max-w-md mx-auto">
        <RouterLink 
          v-for="item in navigation" 
          :key="item.name" 
          :to="item.to"
          class="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 group"
          :class="route.path === item.to ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'"
        >
          <div class="relative">
            <component 
              :is="route.path === item.to ? item.activeIcon : item.icon" 
              class="w-6 h-6 transition-transform duration-200"
              :class="route.path === item.to ? 'scale-110' : 'group-hover:scale-105'" 
            />
            <span v-if="route.path === item.to" class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
          </div>
          <span class="text-[10px] font-medium">{{ item.name }}</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style>
/* Safe area padding for iPhone X+ */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
