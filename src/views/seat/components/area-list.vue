<template>
  <div class="legend-wrap">
    <div class="area-set-wrapper">
      <div
        v-for="area in areaList"
        :key="area.seatAreaId"
        class="area-title"
        :style="{ borderColor: area.color }"
        :class="{ 'active-area': area.seatAreaId == activeArea , 'preview': preview}"
        :wrapperClosable="false"
        @click="openDrawer(area)"
      >
        <span class="color-tip" :style="{ backgroundColor: area.color }" />
        <span>{{ area.name }}</span>
      </div>
      <div class="area-title area-legend" :class="{'preview': preview}">
        <span class="color-tip" style="width: 20px; height: 10px; background-color: #8540cf; border: 1px dashed #fff;" />
        <span>固定人员</span>
      </div>
      <div class="area-title area-legend" :class="{'preview': preview}">
        <span class="color-tip" style="width: 20px; height: 10px; background-color: #999999;" />
        <span>禁用座位</span>
      </div>
    </div>
  </div>
</template>

<script>
import { seatAreaList } from '@/api/seat'
export default {
  props: {
    activeArea: {
      type: [String, Number],
      default: ''
    },
    areaList: {
      type: Array,
      default() {
        return []
      }
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 获取区域列表
    reset() {
      seatAreaList({ seatlayoutId: this.$route.query.id }).then((res) => {
        this.areaList = res.data
      })
    },
    openDrawer(area) {
      this.$emit('openDrawer', area)
    }
  }
}
</script>

<style scoped lang="scss">
.legend-wrap {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  position: relative;
  z-index: 1;
}
.legend-right {
  padding: 10px 15px;
}
.area-set-wrapper {
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  .area-title {
    padding: 5px 5px;
    border-radius: 5px;
    color: #303133;
    font-size: 13px;
    line-height: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 120px;
    overflow: hidden;
  }
  .area-legend {
    cursor: no-drop;
  }
  .preview {
    cursor: context-menu;
  }
  .color-tip {
    width: 20px;
    height: 10px;
    margin-right: 5px;
  }
  .add-btn {
    border: 1px dashed #303133;
    color: #303133;
  }
  .active-area {
    padding: 3px 8px;
    border: 2px solid #ccc;
  }
}
</style>
