<template>
    <el-form inline label-suffix=":">
        <el-form-item label="会议">
            <b-select
                :disabled="disabled"
                :data="group ? getGroupDrop : getMeetingDrop"
                defaultFirst
                v-model="model"
                class="!w-250px"
            ></b-select>
        </el-form-item>
        <slot></slot>
    </el-form>
</template>

<script setup lang="ts">
import { getMeetingDrop } from '~/src/api/meeting-manage'
import { getGroupDrop } from '~/src/api/before-meeting/info'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    disabled: {
        type: Boolean,
        default: () => false,
    },
    group: {
        type: Boolean,
        default: () => false,
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const model = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
        emit('change', value)
    },
})
</script>

<style scoped></style>
