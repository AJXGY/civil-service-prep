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
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto pb-20">
      <RouterView />
    </main>

    <!-- Bottom Navigation -->
    <nav v-if="route.name !== 'login'" class="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe">
      <div class="flex justify-around items-center h-16">
        <RouterLink 
          v-for="item in navigation" 
          :key="item.name" 
          :to="item.to"
          class="flex flex-col items-center justify-center w-full h-full space-y-1"
          :class="route.path === item.to ? 'text-blue-600' : 'text-gray-500'"
        >
          <component 
            :is="route.path === item.to ? item.activeIcon : item.icon" 
            class="w-6 h-6" 
          />
          <span class="text-xs">{{ item.name }}</span>
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
</style>
