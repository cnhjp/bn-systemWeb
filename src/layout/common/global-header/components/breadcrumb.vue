<template>
    <el-breadcrumb class="layout-breadcrumb" separator="/">
        <el-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.index" @click="onClick(breadcrumb)">
            <el-button text>
                <el-icon>
                    <SvgIcon :icon="breadcrumb.icon"></SvgIcon>
                </el-icon>
                <span>{{ breadcrumb.label }}</span>
            </el-button>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script lang="ts" setup>
import { SwitchFilled } from '@element-plus/icons-vue'
import { useRouteStore } from '@/store'

const route = useRoute()
const routeStore = useRouteStore()

const breadcrumbs = computed(() => {
    const active = route.name

    const matchedMenus = (menus: App.GlobalMenuOption[]) => {
        for (const menu of menus) {
            if (menu.index === active) {
                return [menu]
            }
            if (menu.children && menu.children.length > 0) {
                const children = matchedMenus(menu.children)
                if (children.length > 0) {
                    return [menu, ...children]
                }
            }
        }
        return []
    }

    return matchedMenus(routeStore.filtMenus)
})

const onClick = (breadcrumb) => {}
</script>

<style lang="scss" scoped></style>
