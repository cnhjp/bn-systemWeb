<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridOptions" @pageChange="onPageChange">
                <template #toolbar-left>
                    <el-button type="primary" @click="openDialog">打开弹窗</el-button>
                </template>
                <template #toolbar-right>
                    <el-button type="primary">测试</el-button>
                </template>

                <template #age="{ row }">
                    <span @click="onSelected">{{ row.age }}</span>
                </template>
            </b-grid>
        </el-main>
        <b-common-dialog ref="refDialog" @test="onTest"></b-common-dialog>
    </el-container>
</template>

<script setup>
import { BGrid } from '@package/b-grid'
import '@package/b-grid/lib/style.css'
import { getStaticData, getDynamicData } from './api'
import test from './test.vue'

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

function onSelected() {
    console.log(refGrid.value.getSelected())
}

function onRefresh() {
    refGrid.value.refresh()
}

const refDialog = ref(null)

function openDialog() {
    refDialog.value.openModal({
        component: test,
        title: '弹窗标题',
        width: '500px',
        params: {
            name: '张三',
        },
    })
}

function onTest(msg) {
    console.log(msg)
}
</script>
