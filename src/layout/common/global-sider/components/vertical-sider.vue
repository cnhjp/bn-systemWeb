<template>
    <el-scrollbar height="100%">
        <NavMenu
            class="layout-menu"
            :collapse="appStore.siderCollapse"
            :default-active="theActive"
            :options="routeStore.filtMenus"
            @select="onSelect"
        ></NavMenu>
    </el-scrollbar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useRouteStore, useAppStore } from '@/store'
import NavMenu from '@/components/nav-menu.vue'

defineOptions({ name: 'VerticalSider' })

const router = useRouter()
const appStore = useAppStore()
const routeStore = useRouteStore()

const theActive = computed(() => {
    const route = unref(router.currentRoute)
    const menus = unref(flatMenus)
    if (menus.includes(route.name as string)) return route.name as string
    if (menus.includes(route.meta.rootName as string)) return route.meta.rootName as string
    return ''
})
const flatMenus = computed(() => {
    const menus = routeStore.filtMenus
    const transform = (items: App.GlobalMenuOption[]): string[] => {
        return items
            .map((item: App.GlobalMenuOption) => {
                let childItems: string[] = []
                if (item.children && item.children.length > 0) {
                    childItems = transform(item.children)
                }
                return [item.index, ...childItems]
            })
            .flat(1)
    }
    const a = transform(menus)
    return a
})

const onSelect = (index: string) => {
    if (routeStore.existsRoute(index)) {
        router.push({ name: index })
    } else {
        ElMessage.warning('视图未注册或不存在！')
    }
}
</script>

<style lang="scss" scoped></style>
