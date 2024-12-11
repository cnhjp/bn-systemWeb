<template>
    <section ref="layout" class="layout-container transition-all-300 wh-full flex-col">
        <header class="layout-header bg-white transition-all-300">
            <slot name="header"></slot>
        </header>
        <aside class="layout-aside bg-white transition-all-300">
            <slot name="aside"></slot>
        </aside>
        <main class="layout-main bg-#f6f9f8 transition-all-300">
            <!-- <el-scrollbar wrap-class="p-16px"> -->
            <slot name="main"></slot>
            <!-- </el-scrollbar> -->
        </main>
        <footer class="layout-footer bg-white transition-all-300 overflow-hidden">
            <slot name="footer"></slot>
        </footer>
    </section>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()

const layout = ref<HTMLElement>()

watch(
    () => appStore.siderCollapse,
    (newValue) => {
        if (newValue) {
            layout.value?.setAttribute('style', '--aside-width: 64px;')
        } else {
            layout.value?.setAttribute('style', '--aside-width: 220px;')
        }
    },
)
</script>

<style lang="scss" scoped></style>
