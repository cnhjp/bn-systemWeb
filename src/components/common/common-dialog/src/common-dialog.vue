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
    <component
      ref="component"
      :is="markRaw(modal.component)"
      v-bind="componentProps"
      @close="onClose"
    ></component>
  </el-dialog>
</template>

<script setup>
import { markRaw } from "vue";

// Expose methods to child components
const provide = {
  setDialogTitle: setTitle,
  closeDialog: onClose,
};

// Reactive state
const modal = ref({
  visible: false,
  component: null,
  title: "",
  width: "",
  params: {},
  classname: "",
  bodyElement: null,
  resizeObserver: null,
  closeOnClickModal: false,
});

// Refs for template references
const refDialog = ref(null);
const component = ref(null);

// Computed properties
const bindingProps = computed(() => ({ ...useAttrs() }));
const bindingListeners = computed(() => ({ ...useAttrs() }));
const componentProps = computed(() => ({
  ...useAttrs(),
  ...modal.value.params,
}));

// Resize observer for dynamic dialog sizing
let resizeObserver = null;

// Open modal method
function openModal({
  component: modalComponent,
  title,
  width,
  params,
  classname,
}) {
  Object.assign(modal.value, {
    visible: true,
    component: markRaw(modalComponent),
    title,
    width,
    params,
    classname: classname,
  });
  // handleDialogSize();
}

// Set dialog title
function setTitle(title) {
  modal.value.title = title;
}

// Close modal method
function onClose() {
  resizeObserver?.unobserve(modal.value.bodyElement);
  modal.value.visible = false;
}

// Handle dialog size dynamically
function handleDialogSize() {
  nextTick(() => {
    if (refDialog.value?.$el) {
      const dialogEl = refDialog.value.$el;
      const targetElement = dialogEl.querySelector(".el-dialog");
      const headerElement = dialogEl.querySelector(".el-dialog__header");
      const bodyElement = dialogEl.querySelector(".el-dialog__body");

      let oldHeight = 0;
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          let height = Math.ceil(
            entry.contentRect.height +
              40 +
              headerElement.getBoundingClientRect().height
          );

          if (height !== oldHeight) {
            if (height % 2 !== 0) {
              height = Math.max(height - 3, 0);
            }
            oldHeight = height;
            targetElement.style.height = `${height}px`;
          }
        }
      });

      resizeObserver.observe(bodyElement);
      modal.value.bodyElement = bodyElement;
    }
  });
}

// Cleanup on component unmount
onBeforeUnmount(() => {
  resizeObserver?.unobserve(modal.value.bodyElement);
});

// Expose methods for external use
defineExpose({
  openModal,
  setTitle,
  onClose,
});
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
