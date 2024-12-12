<template>
    <div class="login-wrap relative wh-full flex-center flex-grow transition duration-300 ease-in-out">
        <el-form ref="form" class="login-form" :model="formModel" :rules="formRules" label-width="5em">
            <el-form-item label="账号" prop="userName">
                <el-input v-model="formModel.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formModel.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="default" @click="onClean">取消</el-button>
                <el-button type="primary" @click="onLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore, useRouteStore } from '@/store'
import { encrypt } from '@/utils/jsencrypt.ts'

const formModel = ref({
    userName: 'bn_xhx',
    password: 'Abc_12345',
})
const formRules = ref({
    userName: { required: true, message: '账号不能为空！' },
    password: { required: true, message: '密码不能为空！' },
})

const form = ref()
const userStore = useUserStore()
const routeStore = useRouteStore()

const onLogin = () => {
    form.value.validate().then(() => {
        const { userName, password } = formModel.value
        userStore
            .login(userName, encrypt(password))
            .then(() => {
                ElMessage.success('登录成功')
                routeStore.loginToRedirect()
            })
            .catch((error) => {
                ElMessage.error(error.message)
            })
    })
}

const onClean = () => {
    form.value.resetFields()
}
</script>

<style lang="scss" scoped>
.login-wrap {
    // background-color: rgb(222, 232, 255);
}

.login-form {
    padding: 2em;
    border-radius: 1em;
    background-color: rgb(255, 255, 255);
    box-shadow: var(--el-box-shadow-light);
}
</style>
