<script setup>
import { computed, onMounted, ref } from 'vue'
import { useExamStore } from '../stores/examStore'
import { Chart } from 'chart.js/auto'

const store = useExamStore()
const chartCanvas = ref(null)
let chartInstance = null

// --- Computed Data ---
const daysLeft = computed(() => store.daysUntilExam)

// Personalized Quotes
const quotes = [
  "妞妞相信你，今天也要加油哦！",
  "陈海璐一直在背后支持你，冲鸭！",
  "为了我们的未来，每一天的努力都算数。",
  "亲爱的，累了就休息一下，妞妞陪着你。",
  "坚持就是胜利，我家大宝贝最棒了！",
  "行测虽然难，但难不倒我的大英雄。",
  "今天的你比昨天更优秀，妞妞为你骄傲！",
  "只要功夫深，铁杵磨成针，爱你哟！"
]
const dailyQuote = ref(quotes[Math.floor(Math.random() * quotes.length)])

// Smart Summary Logic
const smartSummary = computed(() => {
  if (store.records.length === 0) {
    return {
      title: "开始你的第一天！",
      content: "记录今天的练习情况，我将为你生成专属建议。",
      type: "info"
    }
  }
  
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
  
  // Prepare data: 7 days before + Today + 7 days after (Total 15 days)
  const labels = []
  const dataPoints = []
  const today = new Date()
  
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const label = i === 0 ? '今天' : `${d.getMonth() + 1}/${d.getDate()}`
    
    labels.push(label)
    
    // Only get data for past and today
    if (i <= 0) {
      const dayRecords = store.records.filter(r => r.date === dateStr)
      if (dayRecords.length > 0) {
        const total = dayRecords.reduce((sum, r) => sum + r.totalCount, 0)
        const correct = dayRecords.reduce((sum, r) => sum + r.correctCount, 0)
        dataPoints.push(total > 0 ? (correct / total * 100) : 0)
      } else {
        dataPoints.push(null) // No data for this past day
      }
    } else {
      dataPoints.push(null) // Future days are empty
    }
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '正确率 (%)',
        data: dataPoints,
        borderColor: '#8b5cf6', // violet-500
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#8b5cf6',
        pointRadius: 4,
        pointHoverRadius: 6,
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
          max: 100,
          grid: {
            color: '#f3f4f6'
          },
          ticks: {
            font: { size: 10 }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 10 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1f2937',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (context) => `正确率: ${context.parsed.y.toFixed(1)}%`
          }
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
  <div class="p-4 space-y-6 pb-24">
    <!-- Header / Countdown -->
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
      
      <div class="relative z-10 flex justify-between items-end">
        <div>
          <p class="text-blue-100 text-sm mb-1 font-medium tracking-wide">距离考试还有</p>
          <h1 class="text-5xl font-bold tracking-tight">{{ daysLeft }} <span class="text-lg font-normal opacity-80">天</span></h1>
        </div>
        <div class="text-right">
          <p class="text-blue-100 text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            {{ new Date().toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Daily Quote -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-400 to-rose-400"></div>
      <p class="text-gray-700 text-sm leading-relaxed italic text-center font-medium">
        "{{ dailyQuote }}"
      </p>
      <div class="mt-2 text-center">
        <span class="text-xs text-pink-400 font-bold">—— 爱你的妞妞</span>
      </div>
    </div>

    <!-- Smart Summary Card -->
    <div 
      class="p-5 rounded-2xl shadow-sm border transition-all duration-300"
      :class="{
        'bg-amber-50 border-amber-100': smartSummary.type === 'warning',
        'bg-emerald-50 border-emerald-100': smartSummary.type === 'success',
        'bg-blue-50 border-blue-100': smartSummary.type === 'info'
      }"
    >
      <div class="flex items-start gap-3">
        <div 
          class="p-2 rounded-lg"
          :class="{
            'bg-amber-100 text-amber-600': smartSummary.type === 'warning',
            'bg-emerald-100 text-emerald-600': smartSummary.type === 'success',
            'bg-blue-100 text-blue-600': smartSummary.type === 'info'
          }"
        >
          <!-- Simple Icon based on type -->
          <svg v-if="smartSummary.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          <svg v-else-if="smartSummary.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
        </div>
        <div>
          <h3 class="font-bold text-gray-800 mb-1">{{ smartSummary.title }}</h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ smartSummary.content }}</p>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-gray-800">正确率趋势</h3>
        <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">近15天</span>
      </div>
      <div class="h-64 w-full">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>
