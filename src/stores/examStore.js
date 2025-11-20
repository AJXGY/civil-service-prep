import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useExamStore = defineStore('exam', () => {
    // --- State ---
    const userSettings = ref({
        examDate: '2025-12-01', // Default exam date
        targetScore: 75,
        modules: ['常识判断', '言语理解', '数量关系', '判断推理', '资料分析', '申论']
    })

    const records = ref([])

    // --- Getters ---
    const daysUntilExam = computed(() => {
        const today = new Date()
        const exam = new Date(userSettings.value.examDate)
        const diffTime = exam - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 ? diffDays : 0
    })

    const recentRecords = computed(() => {
        // Return records sorted by date descending
        return [...records.value].sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    // --- Actions ---
    function addRecord(record) {
        records.value.push({
            id: uuidv4(),
            date: record.date,
            module: record.module,
            totalCount: parseInt(record.totalCount),
            correctCount: parseInt(record.correctCount),
            note: record.note || '',
            accuracy: record.totalCount > 0 ? record.correctCount / record.totalCount : 0
        })
    }

    function deleteRecord(id) {
        records.value = records.value.filter(r => r.id !== id)
    }

    function updateSettings(newSettings) {
        userSettings.value = { ...userSettings.value, ...newSettings }
    }

    // --- Persistence ---
    // Load from localStorage on init
    const storedSettings = localStorage.getItem('exam_settings')
    if (storedSettings) {
        userSettings.value = JSON.parse(storedSettings)
    }

    const storedRecords = localStorage.getItem('exam_records')
    if (storedRecords) {
        records.value = JSON.parse(storedRecords)
    }

    // Watch and save
    watch(userSettings, (newVal) => {
        localStorage.setItem('exam_settings', JSON.stringify(newVal))
    }, { deep: true })

    watch(records, (newVal) => {
        localStorage.setItem('exam_records', JSON.stringify(newVal))
    }, { deep: true })

    return {
        userSettings,
        records,
        daysUntilExam,
        recentRecords,
        addRecord,
        deleteRecord,
        updateSettings
    }
})
