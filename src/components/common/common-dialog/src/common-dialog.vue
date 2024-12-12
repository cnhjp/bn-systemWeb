<template>
    <el-dialog
        ref="refDialog"
        v-if="modal.visible"
        :model-value="true"
        :title="modal.title"
        :width="modal.width"
        :close-on-click-modal="modal.closeOnClickModal"
        :class="modal.classname"
        v-bind="bindingProps"
        @close="onClose"
    >
        <component ref="component" :is="modal.component" v-bind="componentProps" @close="onClose"></component>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount, defineExpose, useAttrs, markRaw } from 'vue'
import type { Component, Ref } from 'vue'

// Define modal type
interface Modal {
    visible: boolean
    component: Component | null
    title: string
    width: string
    params: Record<string, unknown>
    classname: string
    bodyElement: HTMLElement | null
    resizeObserver: ResizeObserver | null
    closeOnClickModal: boolean
}

// Define modal props for opening
interface ModalProps {
    component: Component
    title: string
    width?: string
    params?: Record<string, unknown>
    classname?: string
}

// Reactive state
const modal: Ref<Modal> = ref({
    visible: false,
    component: null,
    title: '',
    width: '',
    params: {},
    classname: '',
    bodyElement: null,
    resizeObserver: null,
    closeOnClickModal: false,
})

// Refs for template references
const refDialog = ref<any>(null)
const component = ref<any>(null)

// Computed properties
const bindingProps = computed(() => ({ ...useAttrs() }))
const componentProps = computed(() => ({
    ...useAttrs(),
    ...modal.value.params,
}))

// Resize observer variable
let resizeObserver: ResizeObserver | null = null

// Open modal method
function openModal({ component: modalComponent, title, width = '', params = {}, classname = '' }: ModalProps) {
    Object.assign(modal.value, {
        visible: true,
        component: markRaw(modalComponent),
        title,
        width,
        params,
        classname,
    })
    handleDialogSize()
}

// Set dialog title
function setTitle(title: string) {
    modal.value.title = title
}

// Close modal method
function onClose() {
    resizeObserver?.unobserve(modal.value.bodyElement!)
    modal.value.visible = false
}

// Handle dialog size dynamically
function handleDialogSize() {
    nextTick(() => {
        if (refDialog.value?.$el) {
            const dialogEl = (refDialog.value.$el?.ownerDocument || refDialog.value.$el) as HTMLElement
            if (!dialogEl) return
            const targetElement = dialogEl.querySelector('.el-dialog') as HTMLElement
            const headerElement = dialogEl.querySelector('.el-dialog__header') as HTMLElement
            const bodyElement = dialogEl.querySelector('.el-dialog__body') as HTMLElement

            let oldHeight = 0
            resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    let height = Math.ceil(entry.contentRect.height + 40 + headerElement.getBoundingClientRect().height)

                    if (height !== oldHeight) {
                        if (height % 2 !== 0) {
                            height = Math.max(height - 3, 0)
                        }
                        oldHeight = height
                        targetElement.style.height = `${height}px`
                    }
                }
            })

            resizeObserver.observe(bodyElement)
            modal.value.bodyElement = bodyElement
        }
    })
}

// Cleanup on component unmount
onBeforeUnmount(() => {
    resizeObserver?.unobserve(modal.value.bodyElement!)
})

// Expose methods for external use
defineExpose({
    openModal,
    setTitle,
    onClose,
})
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}
</style>
