<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="详情" is-show-btn />
        </el-header>
        <el-main>
            <div class="el-bg--white p-50px">
                <div class="text-center font-bold text-20px">{{ route.query.title }}</div>
                <div class="text-right text-14px color-#666">
                    {{ (route.query.publishTime as string).replace('T', ' ') }}
                </div>
                <div class="mt-30px whitespace-pre" v-html="route.query.description"></div>
            </div>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
const route = useRoute()
</script>
