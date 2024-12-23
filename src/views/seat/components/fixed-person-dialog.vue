<template>
  <el-dialog title="人员选择" v-model="dialogFormVisible" width="400px" append-to-body>
    <el-form ref="ruleForm" :model="form">
      <el-form-item
        label="固定人员"
        :label-width="'80px'"
        prop="person"
        :rules="[{ required: true, message: '请选择人员', trigger: 'blur' }]"
      >
        <el-select v-model="form.person" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.personId"
            :label="item.personName"
            :value="item.personId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="setFixedSeat"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
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
    }
  },
  data() {
    return {
      form: {
        person: ''
      },
      dialogFormVisible: false
    }
  },
  computed: {
    options() {
      const persons = this.personList.reduce((prev, cur, index, arr) => {
        return prev.concat(cur.personList)
      }, [])
      const options = []
      const personIds = []
      persons.forEach(p => {
        if (!personIds.includes(p.personId) && !this.personIds.includes(p.personId)) {
          options.push(p)
          personIds.push(p.personId)
        }
      })
      return options
    }
  },
  methods: {
    open() {
      this.form.person = ''
      this.dialogFormVisible = true
    },
    setFixedSeat() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const person = this.options.find(
            (item) => item.personId == this.form.person
          )
          this.$emit('setFixedSeat', person)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.$emit('cancel')
    }
  }
}
</script>
