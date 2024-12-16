<template>
    <el-select v-bind="$attrs" :model-value="modelValue" @change="updateModelValue">
        <el-option v-for="option in processedOptions" :key="option.value" :label="option.label" :value="option.value" />
    </el-select>
</template>

<script setup>
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
        // If item is a primitive value, create an object
        if (typeof item !== 'object') {
            return {
                label: item,
                value: item,
                selected: false,
            }
        }

        // If item is an object, map keys
        return {
            label: item[props.labelKey],
            value: item[props.valueKey],
            selected: item.selected || false,
        }
    })
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
                const selectedOption = processedOptions.value.find((option) => option.selected)
                if (selectedOption) {
                    updateModelValue(selectedOption.value)
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
            const selectedOption = processedOptions.value.find((option) => option.selected)
            if (selectedOption) {
                updateModelValue(selectedOption.value)
            }
        }
    }
}

// Watch for changes in data and query
watch([() => props.data, computedQuery], fetchOptions, { immediate: true })

// Update model value
function updateModelValue(value) {
    emit('update:modelValue', value)
    emit('change', value)
}

// Expose methods
defineExpose({
    options,
    loading,
    fetchOptions,
})
</script>
