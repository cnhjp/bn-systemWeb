<template>
    <div class="login-wrap wh-full h-flex">
        <el-form ref="form" class="login-form" :model="formModel" :rules="formRules">
            <h1 class="is-bold el-text--center el-text--darkgrey">欢迎登录</h1>
            <h3 class="el-text--center el-text--darkgrey">帮诺会务系统</h3>
            <el-form-item prop="userName" class="mt-25px">
                <el-input placeholder="请输入您的账号" v-model="formModel.userName" size="large">
                    <template #prefix>
                        <img src="@/assets/svg/icon-phone.svg" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" class="mt-15px">
                <el-input placeholder="请输入您的密码" v-model="formModel.password" type="password" size="large">
                    <template #prefix>
                        <img src="@/assets/svg/icon-password.svg" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="mt-25px">
                <el-button type="primary" @click="onLogin" class="login-btn">登录</el-button>
            </el-form-item>
            <div class="el-flex is-center tips">
                <img src="@/assets/svg/icon-tips.svg" class="mr-5px" />
                <span>推荐浏览器分辨率： 1920*1080</span>
            </div>
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
            .login(userName, encrypt(password) as string)
            .then(() => {
                ElMessage.success('登录成功')
                routeStore.loginToRedirect()
            })
            .catch((error) => {
                ElMessage.error(error.message)
            })
    })
}
</script>

<style lang="scss" scoped>
.login-wrap {
    background: #ffffff url('@/assets/images/login-bg.jpg') no-repeat left center/60% 100%;
}

.login-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    margin-left: 60%;
    h1 {
        font-size: 32px;
        letter-spacing: 15px;
    }
    h3 {
        margin-top: 5px;
        margin-bottom: 30px;
        font-size: 20px;
        letter-spacing: 1px;
    }
}
:deep(.el-input) {
    .el-input__wrapper {
        width: 319px;
        height: 50px;
        box-shadow: none;
        background: #f4f8ff;
        border-radius: 8px;
        font-size: 16px;
    }
}
.login-btn {
    width: 319px;
    height: 50px;
    font-size: 16px;
    border-radius: 8px;
}
.tips {
    color: var(--el-text-color-secondary);
    font-size: 14px;
}
</style>
