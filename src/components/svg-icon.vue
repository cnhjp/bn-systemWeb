<template>
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
        <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { wrapperEnv } from '@/utils'

defineOptions({ name: 'SvgIcon' })

interface Props {
    /** 图标名称 */
    icon?: string
}

const props = defineProps<Props>()

const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
    class: (attrs.class as string) || '',
    style: (attrs.style as string) || '',
}))

const symbolId = computed(() => {
    const viteEnv = wrapperEnv()

    const defaultLocalIcon = 'no-icon'

    const icon = props.icon || defaultLocalIcon

    return `#${viteEnv.VITE_ICON_PREFIX}-${viteEnv.VITE_ICON_COLLECTION}-${icon}`
})
</script>

<style scoped></style>
