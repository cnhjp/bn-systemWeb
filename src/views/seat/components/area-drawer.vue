<template>
  <div class="drawer-wrapper" :class="{ open: visible }">
    <div class="drawer-title">
      <span>
        <span>区域设置</span>

      </span>
      <i class="el-icon-close close-btn" @click="close" />
    </div>
    <div class="drawer-status">
      <el-checkbox v-model="forceSelectBtn" @change="handleChange">
        强制选取（覆盖其他颜色）
      </el-checkbox>
      <el-checkbox v-model="setCenterBtn" @change="handleCenterChange">
        设置中心座
      </el-checkbox>
    </div>
    <div class="drawer-main">
      <el-form ref="form" size="small" :model="form" label-width="80px">
        <el-form-item label="区域名称">
          <el-input
            v-model="form.name"
            maxlength="6"
            placeholder="请输入区域名称"
            @change="areaChange"
          />
        </el-form-item>
        <el-form-item label="区域颜色">
          <el-color-picker
            v-model="form.color"
            :predefine="predefineColors"
            @change="areaChange"
          />
        </el-form-item>
        <el-form-item v-show="showGroup" label="人员分组">
          <el-select
            v-model="form.personGroupId"
            placeholder="请选择人员分组"
            @change="personGroupChange"
          >
            <el-option
              v-for="group in personList.filter(
                (group) => group.id != form.personGroupId && group.id != -1
              )"
              :key="group.id"
              :label="group.name"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排座规则">
          <el-select
            v-model="form.seatRule"
            placeholder="请选择排座规则"
            @change="ruleChange"
          >
            <el-option
              v-for="rule in seatRuleOptions"
              :key="rule.value"
              :label="rule.label"
              :value="rule.value"
            />
          </el-select>
          <el-button type="primary" style="margin-left: 10px;" @click="setSeat">自动排座</el-button>
        </el-form-item>
      </el-form>
      <!-- 人员列表 -->
      <div class="table-title">
        <span> 人员列表 </span>
        <el-checkbox v-model="isShowNoSeat" @change="showNoSeat">
          仅显示未排座人员
        </el-checkbox>
      </div>
      <div class="table-operate">
        <span>{{ groupName }}</span>
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="handleAdd"
          >新 增</el-button>

        </div>
      </div>
      <div class="person-table ">
        <div class="table-item table-head">
          <span class="item-order">序号</span>
          <span class="item-name">姓名</span>
          <span class="item-status">状态</span>
          <span class="item-btn">是否参与排座</span>
        </div>
        <div class="drag-wrapper">
          <div v-for="(item, index) in tableData" :key="item.personId" class="table-item" :class="{'no-drag': isShowNoSeat}">
            <span class="item-order">{{ index + 1 }}</span>
            <span class="item-name">{{ item.personName }}</span>
            <span class="item-status">{{ personIds.includes(item.personId) ? "已排座" : "未排座" }}</span>
            <span class="item-btn">
              <el-switch v-model="item.enable" @change="handleDisable" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { seatAreaPersonSort } from '@/api/seat'
export default {
  props: {
    personList: {
      type: Array,
      default: () => {
        return []
      }
    },
    personIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    forceSelect: {
      type: Boolean,
      default: false
    },
    setCenter: {
      type: Boolean,
      default: false
    },
    checkCenterSeat: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    deletePerson: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      visible: false,
      seatRuleOptions: [
        {
          label: '每一行从左到右',
          value: 0
        },
        {
          label: '每一行从右到左',
          value: 1
        },
        {
          label: '从中心位置开始，先左后右',
          value: 2
        },
        {
          label: '从中心位置开始，先右后左',
          value: 3
        },
        {
          label: '首行从左到右，第二行从右往左S型',
          value: 4
        },
        {
          label: '首行从右到左，第二行从左往右S型',
          value: 5
        }
      ],
      tableData: [],
      form: {
        name: '',
        color: '#ff4500',
        personGroupId: '',
        seatRule: '',
        seatLayoutId: ''
      },
      predefineColors: [
        '#FF8080',
        '#22B14C',
        '#FFF200',
        '#00A2E8',
        '#FF7F27',
        '#A349A4',
        '#FFC90E',
        '#EFE4B0',
        '#B5E61D',
        '#99D9EA',
        '#7092BE',
        '#C8BFE7',
        '#B97A57',
        '#880015'
      ],
      isShowNoSeat: false,
      multipleSelection: '',
      oldPersonGroup: '',
      allPerson: [],
      groupName: '',
      showGroup: true,
      forceSelectBtn: false,
      setCenterBtn: false
    }
  },
  watch: {
    personList: {
      handler() {
        let group = null
        if (this.form.personGroupId === '') {
          this.tableData = []
          return
        }
        if (this.form.personGroupId === 0) {
          group = this.personList.find((item) => item.id == -1)
        } else {
          group = this.personList.find(
            (item) => item.id == this.form.personGroupId
          )
        }
        if (group) {
          this.allPerson = group.personList.map(p => {
            return {
              conventionPersonId: p.conventionPersonId,
              personId: p.personId,
              personName: p.personName,
              sortIndex: p.sortIndex,
              enable: !p.disabled
            }
          })
          if (this.isShowNoSeat) {
            this.tableData = this.allPerson.filter(
              (item) => !this.personIds.includes(item.personId)
            )
          } else {
            this.tableData = this.allPerson
          }
          this.groupName = group.name
        } else {
          this.groupName = ''
          this.allPerson = []
          this.tableData = []
        }
      },
      deep: true
    },
    personIds: {
      handler() {
        if (this.isShowNoSeat) {
          this.tableData = this.allPerson.filter(
            (item) => !this.personIds.includes(item.personId)
          )
        } else {
          this.tableData = this.allPerson
        }
      }
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.rowDrop() // 行拖拽
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelector('.drag-wrapper')
      const _this = this
      new Sortable(tbody, {
        dragClass: 'sortable-drag',
        ghostClass: 'sortable-ghost',
        filter: '.no-drag',
        onStart() {
        },
        onEnd({ newIndex, oldIndex }) {
          if (newIndex == oldIndex) return
          _this.tableData.splice(
            newIndex,
            0,
            _this.tableData.splice(oldIndex, 1)[0]
          )
          var newArray = _this.tableData.slice(0)
          _this.tableData = []
          _this.$nextTick(function() {
            _this.tableData = newArray
            const details = newArray.map((p, index) => ({
              areaId: this.form.seatAreaId,
              personId: p.personId,
              sortIndex: index,
              personName: p.personName,
              disabled: !p.enable
            }))
            seatAreaPersonSort({
              seatLayoutId: this.form.seatLayoutId,
              details
            }).then((res) => {
              this.$emit('refreshGroup')
            })
          })
        }
      })
    },
    setSeat() {
      if (this.form.seatRule == '2' || this.form.seatRule == '3') {
        const validater = this.checkCenterSeat()
        if (validater) {
          this.$emit('setSeat')
        }
      } else {
        this.$emit('setSeat')
      }
    },
    handleDisable() {
      const details = this.tableData.map((p, index) => ({
        areaId: this.form.seatAreaId,
        personId: p.personId,
        sortIndex: p.sortIndex,
        personName: p.personName,
        disabled: !p.enable
      }))
      seatAreaPersonSort({
        seatLayoutId: this.form.seatLayoutId,
        details
      }).then((res) => {
        this.$emit('refreshGroup', true)
      })
    },
    handleAdd() {
      this.$confirm('是否要跳转到新增会议人员页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('/meetingManagement/personnel')
        })
        .catch(() => {})
    },
    // 打开区域设置
    open(area) {
      this.forceSelectBtn = false
      this.setCenterBtn = false
      let group = null
      if (area.personGroupId === 0) {
        this.showGroup = false
        group = this.personList.find((item) => item.id === -1)
      } else {
        this.showGroup = true
        group = this.personList.find((item) => item.id == area.personGroupId)
      }
      if (group) {
        this.allPerson = group.personList.map((p, index) => {
          return {
            conventionPersonId: p.conventionPersonId,
            personId: p.personId,
            personName: p.personName,
            sortIndex: p.sortIndex,
            enable: !p.disabled
          }
        })
        if (this.isShowNoSeat) {
          this.tableData = this.allPerson.filter(
            (item) => !this.personIds.includes(item.personId)
          )
        } else {
          this.tableData = this.allPerson
        }
        this.groupName = group.name
      } else {
        this.tableData = []
        this.groupName = ''
      }

      this.form.personGroupId = area.personGroupId
      this.visible = true
      this.form.seatAreaId = area.seatAreaId
      this.form.name = area.name
      this.form.color = area.color

      this.form.seatLayoutId = area.seatLayoutId
      this.oldPersonGroup = area.personGroupId
      this.oldSeatRule = area.seatRule
      this.form.seatRule = area.seatRule
    },
    // 人员多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 是否只显示未排座
    showNoSeat(val) {
      if (val) {
        this.tableData = this.allPerson.filter(
          (item) => !this.personIds.includes(item.personId)
        )
      } else {
        this.tableData = this.allPerson
      }
    },
    // 交换分组
    personGroupChange(value) {
      const group = this.personList.find(
        (item) => item.id == this.form.personGroupId
      )
      this.$confirm(
        `调换区域会清空两个区域已排座人员，并清空操作记录！确认与“${group.name}”调换区域?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.tableData = this.allPerson = group.personList.map(p => {
            return {
              conventionPersonId: p.conventionPersonId,
              personId: p.personId,
              personName: p.personName,
              sortIndex: p.sortIndex,
              enable: !p.disabled
            }
          })
          this.$emit('exchange', this.form, this.oldPersonGroup)
          this.oldPersonGroup = this.form.personGroupId
          this.$message({
            type: 'success',
            message: '调换成功'
          })
        })
        .catch(() => {
          this.form.personGroupId = this.oldPersonGroup
        })
    },
    // 关闭
    close() {
      this.visible = false
      this.$emit('clear')
    },
    // 区域修改
    areaChange() {
      this.$emit('areaChange', this.form)
    },
    ruleChange(val) {
      this.$emit('areaChange', this.form)
      this.oldSeatRule = val
      // const checkCenter = this.checkCenterSeat();
      // if (checkCenter) {
      //   this.$emit("areaChange", this.form);
      //   this.oldSeatRule = val;
      // } else {
      //   this.form.seatRule = this.oldSeatRule;
      // }
    },
    // 是否强制选取
    handleChange(val) {
      this.$emit('update:forceSelect', val)
    },
    handleCenterChange(val) {
      this.$emit('update:setCenter', val)
    }
  }
}
</script>

<style lang="scss" >
.drawer-wrapper {
  position: absolute;
  right: -420px;
  top: 0;
  width: 410px;
  height: 100%;
  overflow: auto;
  background-color: #ffffff;
  box-shadow: -3px 0 4px 0 rgba(0, 0, 0, 0.2);
  transition: right 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  .drawer-title {
    font-size: 18px;
    border-bottom: 1px solid #dcdfe6;
    padding: 15px;
    display: flex;
    height: 52px;
    justify-content: space-between;
  }
  .drawer-status {
    padding: 15px 15px 0;
  }
  .drawer-main {
    width: 100%;
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .el-form {
    height: 214px;
  }
  .close-btn {
    cursor: pointer;
  }
  .table-title {
    padding: 10px 0;
    border-top: 1px solid #dcdfe6;
    display: flex;
    height: 40px;
    box-sizing: border-box;
    justify-content: space-between;
  }
  .table-operate {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    align-items: flex-end;
    height: 38px;
    box-sizing: border-box;
  }
  .person-table {
    border: 1px solid #dfe6ec;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .drag-wrapper {
    height: calc(100% - 40px);
    overflow: auto;
    flex: 1;
  }
  .table-item {
    display: flex;
    font-size: 12px;
    align-items: center;
    border-bottom: 1px solid #dfe6ec;
    box-sizing: border-box;
    height: 40px;
    box-sizing: border-box;
    cursor: grab;
    .item-order {
      width: 50px;
      box-sizing: border-box;
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border-right: 1px solid #dfe6ec;
    }
    .item-name {
      width: 130px;
      box-sizing: border-box;
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border-right: 1px solid #dfe6ec;
    }
    .item-status {
      width: 100px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 40px;
      padding-left: 10px;
      border-right: 1px solid #dfe6ec;
    }
    .item-btn {
      flex: 1;
      display: flex;
      padding-left: 10px;
      align-items: center;
    }
  }
  .table-head {
    font-weight: 600;
    color: #909399;
    height: 40px;
    box-sizing: border-box;
    cursor: context-menu;
  }
  .no-drag {
    cursor: context-menu;
  }
}

.open {
  right: 0;
}
.sortable-ghost {
  background-color: #409eff;
}

</style>
