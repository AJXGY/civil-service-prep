<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExamStore } from '../stores/examStore'

const store = useExamStore()
const router = useRouter()
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (store.login(password.value)) {
    router.push('/')
  } else {
    error.value = '密码错误，请重试'
    password.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">欢迎回来</h1>
        <p class="text-gray-500 text-sm mt-2">请输入密码访问您的备考数据</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">访问密码</label>
          <input 
            v-model="password"
            type="password" 
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••"
            autofocus
          >
          <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
        </div>

        <button 
          type="submit"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          进入系统
        </button>
      </form>
    </div>
  </div>
</template>
