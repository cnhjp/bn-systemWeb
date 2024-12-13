<template>
    <el-form inline label-suffix=":">
        <el-form-item label="会议">
            <el-select v-model="model" placeholder="" class="!w-250px" @change="onChange">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <slot></slot>
    </el-form>
</template>

<script setup lang="ts">
import { getMeetingDrop } from '~/src/api/meeting-manage'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const options = ref<any>([])
const model = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
        emit('change', value)
    },
})

onMounted(() => {
    getMeetingDrop().then(({ data }) => {
        options.value = data || []
        const selectedItem = options.value.find((item: any) => item.selected)
        model.value = (selectedItem || options.value[0] || {}).value
    })
})
</script>

<style scoped></style>
