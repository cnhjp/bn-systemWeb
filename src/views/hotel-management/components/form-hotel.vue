<template>
    <el-container>
        <el-main>
            <el-form ref="form" v-model="formModel" label-width="80px">
                <el-form-item label="酒店名称" props="name">
                    <el-input v-model="formModel.name" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="formModel.contact" />
                </el-form-item>
                <el-form-item label="酒店地址">
                    <el-input v-model="formModel.address" />
                </el-form-item>
                <el-form-item label="酒店介绍">
                    <el-input v-model="formModel.name" />
                </el-form-item>
                <el-form-item label="酒店照片">
                    <el-input v-model="formModel.name" />
                </el-form-item>
            </el-form>
            <div class="h-flex is-center">
                <el-button>取消</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { HotelForm } from '@/api/hotel-management/types.ts'

const formModel = ref<HotelForm>({
    id: 0,
    name: '',
    contact: null,
    address: '',
    introduction: '',
    docName: '',
    docId: 0,
    docPath: '',
})
</script>

<style scoped lang="scss"></style>
