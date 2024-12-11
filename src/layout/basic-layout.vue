<template>
    <LayoutContainer>
        <template #header>
            <GlobalHeader></GlobalHeader>
        </template>
        <template #aside>
            <GlobalSider></GlobalSider>
        </template>
        <template #main>
            <GlobalContent></GlobalContent>
        </template>
        <template #footer>
            <GlobalFooter></GlobalFooter>
        </template>
    </LayoutContainer>
</template>

<script lang="ts" setup>
import LayoutContainer from './layout-container.vue'
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalSider, GlobalLogo } from './common'

defineOptions({ name: 'BasicLayout' })
</script>

<style lang="scss" scoped></style>
