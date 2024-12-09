<template>
  <el-container class="w-full h-full">
    <el-header class="bg-gray-400">
      <LayoutHeader />
    </el-header>
    <el-container>
      <el-aside width="200px" class="bg-gray-200">
        <LayoutAside />
      </el-aside>
      <el-main>
        <el-container>
          <el-main>
            <LayoutMain />
          </el-main>
          <el-footer>
            <LayoutFooter />
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import LayoutHeader from "./header/index.vue";
import LayoutAside from "./aside/index.vue";
import LayoutFooter from "./footer/index.vue";
import LayoutMain from "./main/index.vue";
</script>
