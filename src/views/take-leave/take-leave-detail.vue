<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="详情" is-show-btn />
        </el-header>
        <el-main>
            <el-row class="el-bg--white p-50px">
                <el-col :span="18" :offset="3">
                    <el-form label-width="80px" label-suffix=":">
                        <el-form-item label="会议" prop="conventionID">{{ route.query.conventionTitle }}</el-form-item>
                        <el-form-item label="开始时间" prop="startTime">
                            {{ useDateFormat(route.query.startTime as string, 'YYYY-MM-DD HH:mm') }}
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endTime">
                            {{ useDateFormat(route.query.endTime as string, 'YYYY-MM-DD HH:mm') }}
                        </el-form-item>
                        <el-form-item label="请假原因" prop="reason">{{ route.query.reason }}</el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

const route = useRoute()
</script>
