<template>
  <el-dialog title="区域设置" v-model="visible" width="460px">
    <el-form ref="form" :model="addForm" :rules="rules" label-width="80px">
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入区域名称" />
      </el-form-item>
      <el-form-item label="区域颜色">
        <el-color-picker
          v-model="addForm.color"
          show-alpha
          :predefine="areaColors"
        />
      </el-form-item>
      <el-form-item label="人员分组" prop="personGroupId">
        <el-select v-model="addForm.personGroupId" placeholder="请选择人员分组">
          <el-option
            v-for="person in personList"
            :key="person.id"
            :label="person.name"
            :value="person.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="submitAdd">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    personList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'change' }
        ],
        personGroupId: [
          { required: true, message: '请选择人员分组', trigger: 'change' }
        ],
        seatRule: [
          { required: true, message: '请输入排座规则', trigger: 'change' }
        ]
      },
      areaColors: [
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
      addForm: {
        name: '',
        color: '',
        personGroupId: ''
      }
    }
  },
  mounted() {},
  methods: {
    open() {},
    submitAdd() {}
  }
}
</script>
