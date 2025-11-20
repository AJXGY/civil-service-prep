<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExamStore } from '../stores/examStore'

const store = useExamStore()
const router = useRouter()

const form = ref({
  date: new Date().toISOString().split('T')[0],
  module: store.userSettings.modules[0],
  totalCount: '',
  correctCount: '',
  note: ''
})

const isValid = computed(() => {
  const t = parseInt(form.value.totalCount)
  const c = parseInt(form.value.correctCount)
  return t > 0 && c >= 0 && c <= t
})

const submit = () => {
  if (!isValid.value) return
  
  store.addRecord({
    ...form.value,
    totalCount: parseInt(form.value.totalCount),
    correctCount: parseInt(form.value.correctCount)
  })
  
  // Reset form or redirect? Let's redirect to dashboard to see progress
  router.push('/')
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">每日打卡</h1>
    
    <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <!-- Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
        <input 
          v-model="form.date"
          type="date" 
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
      </div>

      <!-- Module -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">模块</label>
        <select 
          v-model="form.module"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option v-for="m in store.userSettings.modules" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
      </div>

      <!-- Counts -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">总题数</label>
          <input 
            v-model="form.totalCount"
            type="number" 
            min="1"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">正确数</label>
          <input 
            v-model="form.correctCount"
            type="number" 
            min="0"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          >
        </div>
      </div>

      <!-- Accuracy Preview -->
      <div v-if="form.totalCount > 0" class="text-sm text-right">
        <span class="text-gray-500">正确率：</span>
        <span :class="{
          'text-green-600 font-bold': (form.correctCount/form.totalCount) >= 0.8,
          'text-yellow-600 font-bold': (form.correctCount/form.totalCount) >= 0.6 && (form.correctCount/form.totalCount) < 0.8,
          'text-red-600 font-bold': (form.correctCount/form.totalCount) < 0.6
        }">
          {{ ((form.correctCount / form.totalCount) * 100).toFixed(1) }}%
        </span>
      </div>

      <!-- Note -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">备注 (可选)</label>
        <textarea 
          v-model="form.note"
          rows="3"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="记录一下心得..."
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button 
        @click="submit"
        :disabled="!isValid"
        class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        提交打卡
      </button>
    </div>
  </div>
</template>
