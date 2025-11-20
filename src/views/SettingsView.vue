<script setup>
import { ref, watch } from 'vue'
import { useExamStore } from '../stores/examStore'

const store = useExamStore()
const examDate = ref(store.userSettings.examDate)
const newPassword = ref('')

// Watch for changes and update store
watch(examDate, (newDate) => {
  store.updateSettings({ examDate: newDate })
})

const handleSetPassword = () => {
  if (newPassword.value) {
    store.setPassword(newPassword.value)
    newPassword.value = ''
    alert('密码设置成功！下次打开应用时将需要输入密码。')
  }
}

const clearData = () => {
  if (confirm('确定要清空所有打卡记录吗？此操作不可恢复。')) {
    store.records = []
    alert('数据已清空')
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">设置</h1>
    
    <!-- Exam Date -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">考试设置</h2>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">考试日期</label>
        <input 
          v-model="examDate"
          type="date" 
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
        <p class="mt-2 text-sm text-gray-500">
          距离考试还有 <span class="font-bold text-blue-600">{{ store.daysUntilExam }}</span> 天
        </p>
      </div>
    </div>

    <!-- Modules (Read-only for MVP) -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">考试模块</h2>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="mod in store.userSettings.modules" 
          :key="mod"
          class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
        >
          {{ mod }}
        </span>
      </div>
      <p class="mt-4 text-xs text-gray-400">目前支持默认行测模块，自定义功能开发中。</p>
    </div>

    <!-- Data Management -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">安全与数据</h2>
      
      <!-- Password Setting -->
      <div class="mb-6 pb-6 border-b border-gray-100">
        <div v-if="!store.hasPassword">
          <label class="block text-sm font-medium text-gray-700 mb-2">设置访问密码</label>
          <div class="flex gap-2">
            <input 
              v-model="newPassword"
              type="password" 
              placeholder="输入新密码"
              class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
            <button 
              @click="handleSetPassword"
              :disabled="!newPassword"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              设置
            </button>
          </div>
        </div>
        <div v-else>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">访问密码：<span class="text-green-600 font-medium">已开启</span></span>
            <button 
              @click="store.removePassword()"
              class="text-sm text-red-600 hover:text-red-700"
            >
              关闭密码
            </button>
          </div>
          <p class="text-xs text-gray-500">开启后，每次打开应用都需要输入密码。</p>
        </div>
      </div>

      <button 
        @click="clearData"
        class="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
      >
        清空所有数据
      </button>
    </div>
    
    <div class="text-center text-xs text-gray-400 pt-4">
      v1.0.0 • Civil Service Prep
    </div>
  </div>
</template>
