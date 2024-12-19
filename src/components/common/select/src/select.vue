<template>
    <el-select v-bind="$attrs" :model-value="modelValue" :empty-values="[0, undefined, null]" @change="onChange">
        <el-option
            v-for="option in filteredOptions"
            :key="option.value"
            :label="option.displayLabel"
            :value="option.value"
        />
    </el-select>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits, defineExpose, onMounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number, Array],
        default: null,
    },
    data: {
        type: [Function, Array],
        required: true,
    },
    query: {
        type: [Object, Function],
        default: () => ({}),
    },
    labelKey: {
        type: String,
        default: 'label',
    },
    valueKey: {
        type: String,
        default: 'value',
    },
    defaultFirst: {
        type: Boolean,
        default: false,
    },
    // 空选项显示为全部
    displayEmptyAll: {
        type: Boolean,
        default: true,
    },
    // Filter options
    filter: {
        type: Function,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'load', 'change'])

const options = ref([])
const loading = ref(false)

// Compute query parameters
const computedQuery = computed(() => {
    if (typeof props.query === 'function') {
        return props.query()
    }
    return props.query
})

// Process options to ensure consistent structure
const processedOptions = computed(() => {
    return options.value.map((item) => {
        let label = ''
        let value
        let selected = false

        // If item is a primitive value, create an object
        if (typeof item !== 'object') {
            label = item
            value = item
        } else {
            // If item is an object, map keys
            label = item[props.labelKey]
            value = item[props.valueKey]
            selected = item.selected || false
        }

        // Replace empty label with '全部'
        const displayLabel = label === '' && props.displayEmptyAll ? '全部' : label

        return {
            label,
            value,
            selected,
            displayLabel,
        }
    })
})

// Filter options
const filteredOptions = computed(() => {
    if (typeof props.filter === 'function') {
        return processedOptions.value.filter((option) => props.filter(option))
    }
    return processedOptions.value
})

// Fetch or set options
const fetchOptions = async () => {
    const isEmptyValue = (val) => [undefined, null, ''].includes(val)
    // If data is a function
    if (typeof props.data === 'function') {
        try {
            loading.value = true
            const response = await props.data(computedQuery.value)

            // Support different response formats
            options.value = response.data || response.list || response || []

            emit('load', options.value)

            // Set initial selection if no modelValue is provided
            if (isEmptyValue(props.modelValue)) {
                const selectedOption = filteredOptions.value.find((option) => option.selected)
                if (selectedOption) {
                    updateModelValue(selectedOption.value)
                } else if (props.defaultFirst && filteredOptions.value.length > 0) {
                    updateModelValue(filteredOptions.value[0].value)
                }
            }
        } catch (error) {
            console.error('Error fetching options:', error)
            options.value = []
        } finally {
            loading.value = false
        }
    }
    // If data is an array
    else if (Array.isArray(props.data)) {
        options.value = props.data

        // Set initial selection if no modelValue is provided
        if (isEmptyValue(props.modelValue)) {
            const selectedOption = filteredOptions.value.find((option) => option.selected)
            if (selectedOption) {
                updateModelValue(selectedOption.value)
            } else if (props.defaultFirst && filteredOptions.value.length > 0) {
                updateModelValue(filteredOptions.value[0].value)
            }
        }
    }
}

// Watch for changes in data and query
watch([() => props.data, computedQuery], fetchOptions, { immediate: true })

function onChange(value) {
    updateModelValue(value)
    emit('change', value)
}

// Update model value
function updateModelValue(value) {
    emit('update:modelValue', value)
}

// Expose methods
defineExpose({
    options,
    loading,
    fetchOptions,
})
</script>
