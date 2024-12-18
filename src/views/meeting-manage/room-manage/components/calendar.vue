<template>
    <el-calendar ref="calendar">
        <template #header="{ date }">
            <div>
                <el-button @click="selectDate('prev-year')">
                    <el-icon><DArrowLeft /></el-icon>
                </el-button>
                <el-button @click="selectDate('prev-month')">
                    <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span class="px-15px">{{ date }}</span>
                <el-button @click="selectDate('next-month')">
                    <el-icon><ArrowRight /></el-icon>
                </el-button>
                <el-button @click="selectDate('next-year')">
                    <el-icon><DArrowRight /></el-icon>
                </el-button>
                <el-button type="primary" @click="selectDate('today')">今天</el-button>
            </div>
            <el-button type="primary" @click="selectDate('today')">预约会议室</el-button>
        </template>
        <template #date-cell="{ data }">
            <div class="el-text--right">{{ data.day.split('-').slice(1)[1] }} 日</div>
            <div class="el-line1">{{ setEvent(data.day) }}</div>
        </template>
    </el-calendar>
</template>

<script setup lang="ts">
import type { CalendarDateType, CalendarInstance } from 'element-plus'
const props = defineProps({
    eventList: {
        type: Array,
        default: () => [],
    },
})
const calendar = ref<CalendarInstance>()
function selectDate(val: CalendarDateType) {
    if (!calendar.value) return
    calendar.value.selectDate(val)
}
function setEvent(date: string) {
    const event = props.eventList.find((it: any) => formatDate(it.startTime) === date)
    return event
}

function formatDate(date: any) {
    const day = new Date(date)
    const currentYear = day.getFullYear()
    const currentMonth = day.getMonth() + 1
    const currentDate = day.getDate().toString()
    const dd = currentDate.padStart(2, '0')
    return `${currentYear}-${currentMonth}-${dd}`
}
</script>

<style scoped lang="scss">
:deep(.el-calendar__header) {
    border: none;
}
</style>
