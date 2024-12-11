<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridOptions" @pageChange="onPageChange">
                <template #age="{ row }">
                    <span @click="test">{{ row.age }}</span>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>

<script setup>
import { BGrid } from '@package/b-grid'
import '@package/b-grid/lib/style.css'
import { getStaticData, getDynamicData } from './api'

const gridOptions = reactive({
    columns: [
        { type: 'checkbox', width: 70 },
        { type: 'seq', width: 70 },
        { field: 'name', title: 'Name' },
        { field: 'sex', title: 'Sex' },
        { field: 'age', title: 'Age', slots: { default: 'age' } },
    ],
    data: getDynamicData,
})

function onPageChange({ pageSize, currentPage }) {
    console.log({ pageSize, currentPage })
}

const refGrid = ref(null)

function test() {
    console.log(refGrid.value.getSelected())
}

function onRefresh() {
    refGrid.value.refresh()
}
</script>
