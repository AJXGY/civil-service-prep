<script setup>
import { ref, watch } from 'vue'
import { useExamStore } from '../stores/examStore'

const store = useExamStore()
const examDate = ref(store.userSettings.examDate)

// Watch for changes and update store
watch(examDate, (newDate) => {
  store.updateSettings({ examDate: newDate })
})

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
      <h2 class="text-lg font-semibold mb-4 text-gray-800">数据管理</h2>
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
