<template>
    <RouterView v-slot="{ Component, route }">
        <transition name="fade-slide" mode="out-in" appear>
            <keep-alive :include="routeStore.cacheRoutes">
                <component
                    :is="Component"
                    :key="route.fullPath"
                    class="flex-grow transition duration-300 ease-in-out"
                ></component>
            </keep-alive>
        </transition>
    </RouterView>
</template>

<script lang="ts" setup>
import { useRouteStore } from '@/store'

defineOptions({ name: 'GlobalContent' })

const routeStore = useRouteStore()
</script>

<style lang="scss" scoped></style>
