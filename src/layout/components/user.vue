<template>
  <el-dropdown @command="onCommand">
    <template #default>
      <el-avatar :size="50" src="" />
    </template>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
const userStore = useUserStore();
const router = useRouter();

function onCommand(command) {
  switch (command) {
    case "logout":
      logout();
      break;
  }
}

function logout() {
  userStore.logout().then(() => {
    router.push({
      name: "login",
    });
  });
}
</script>
