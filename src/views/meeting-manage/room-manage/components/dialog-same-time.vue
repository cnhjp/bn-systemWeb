<template>
    <b-grid ref="refGrid" v-bind="gridProps">
        <template #time="{ row }">
            {{ DateUtil.formatDate(row.startTime, 'yyyy-MM-dd HH:mm') }} ~
            {{ DateUtil.formatDate(row.endTime, 'yyyy-MM-dd HH:mm') }}
        </template>
    </b-grid>
</template>
<script setup lang="ts">
import { DateUtil } from '@/utils/date-util.ts'
const props = defineProps(['list'])
const emits = defineEmits(['close', 'refresh'])

const gridProps = reactive({
    data: props.list,
    columns: [
        { title: '会议日期', slots: { default: 'time' }, minWidth: 220 },
        { title: '会议名称', field: 'conventionTitle', minWidth: 220 },
    ],
    pagerConfig: false,
})
</script>

<style scoped lang="scss"></style>
