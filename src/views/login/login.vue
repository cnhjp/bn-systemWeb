<template>
  <el-container>
    <el-main>
      <el-form ref="form" :model="formModel" :rules="formRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formModel.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password"
          ><el-input v-model="formModel.password"></el-input
        ></el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
const userStore = useUserStore();
const router = useRouter();

const formModel = reactive({
  username: "admin",
  password: "123456",
});

const formRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const form = ref(null);

function onSubmit() {
  form.value.validate((valid) => {
    if (valid) {
      userStore
        .login(formModel)
        .then(() => {
          ElMessage.success("登录成功");

          router.push({
            name: "list",
          });
        })
        .catch(() => {
          ElMessage.error("登录失败");
        });
    }
  });
}
</script>
