<script setup>
import { computed, onMounted, ref } from 'vue'
import { useExamStore } from '../stores/examStore'
import { Chart } from 'chart.js/auto'

const store = useExamStore()
const chartCanvas = ref(null)
let chartInstance = null

// --- Computed Data ---
const daysLeft = computed(() => store.daysUntilExam)
const dailyQuote = ref("这是你为梦想奋斗的每一天。") // Placeholder, can be replaced with API

// Smart Summary Logic (Simplified for now)
const smartSummary = computed(() => {
  // Need at least some data
  if (store.records.length === 0) {
    return {
      title: "开始你的第一天！",
      content: "记录今天的练习情况，我将为你生成专属建议。",
      type: "info"
    }
  }
  
  // Calculate weak module (Simplified logic from design)
  // In a real app, we'd move this to a helper or store action
  const moduleStats = {}
  store.records.forEach(r => {
    if (!moduleStats[r.module]) moduleStats[r.module] = { total: 0, correct: 0 }
    moduleStats[r.module].total += r.totalCount
    moduleStats[r.module].correct += r.correctCount
  })

  let weakModule = null
  let minAcc = 1.1
  
  for (const mod in moduleStats) {
    const s = moduleStats[mod]
    if (s.total > 0) {
      const acc = s.correct / s.total
      if (acc < minAcc) {
        minAcc = acc
        weakModule = mod
      }
    }
  }

  if (weakModule) {
    return {
      title: `重点突破：${weakModule}`,
      content: `该模块正确率为 ${(minAcc * 100).toFixed(1)}%，建议加强专项训练。`,
      type: "warning"
    }
  }
  
  return {
    title: "保持状态",
    content: "你的复习进度很稳定，继续加油！",
    type: "success"
  }
})

// --- Chart Logic ---
const initChart = () => {
  if (chartInstance) chartInstance.destroy()
  
  // Prepare data: Last 7 days
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last7Days.push(d.toISOString().split('T')[0])
  }

  const dataPoints = last7Days.map(date => {
    // Find records for this date
    const dayRecords = store.records.filter(r => r.date === date)
    if (dayRecords.length === 0) return null
    
    const total = dayRecords.reduce((sum, r) => sum + r.totalCount, 0)
    const correct = dayRecords.reduce((sum, r) => sum + r.correctCount, 0)
    return total > 0 ? (correct / total * 100) : 0
  })

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: last7Days.map(d => d.slice(5)), // MM-DD
      datasets: [{
        label: '日正确率 (%)',
        data: dataPoints,
        borderColor: '#2563eb', // blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        spanGaps: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- Header / Countdown -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
      <div class="flex justify-between items-end">
        <div>
          <p class="text-blue-100 text-sm mb-1">距离考试还有</p>
          <h1 class="text-4xl font-bold">{{ daysLeft }} <span class="text-lg font-normal">天</span></h1>
        </div>
        <div class="text-right">
          <p class="text-blue-100 text-xs">{{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
    </div>

    <!-- Daily Quote -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p class="text-gray-600 text-sm italic text-center">"{{ dailyQuote }}"</p>
    </div>

    <!-- Smart Summary Card -->
    <div 
      class="p-5 rounded-xl border-l-4 shadow-sm"
      :class="{
        'bg-yellow-50 border-yellow-400': smartSummary.type === 'warning',
        'bg-green-50 border-green-400': smartSummary.type === 'success',
        'bg-blue-50 border-blue-400': smartSummary.type === 'info'
      }"
    >
      <h3 class="font-bold text-gray-800 mb-1">{{ smartSummary.title }}</h3>
      <p class="text-sm text-gray-600">{{ smartSummary.content }}</p>
    </div>

    <!-- Chart Section -->
    <div class="bg-white p-4 rounded-xl shadow-sm">
      <h3 class="font-bold text-gray-800 mb-4">近7日正确率趋势</h3>
      <div class="h-64">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>
