<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
         @close="resetForm">
        <el-form :model="addForm" :rules="rules" class="add_form" ref="addFormRef">
           <!-- 账号 -->
            <el-form-item prop='username'>
              <el-input  prefix-icon="el-icon-s-custom"  v-model="addForm.username" type="text"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop='password'>
              <el-input  prefix-icon="el-icon-s-help" v-model="addForm.password" type="text"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item prop='email'>
              <el-input  prefix-icon="el-icon-s-custom" v-model="addForm.email" type="text"></el-input>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item prop='mobile'>
              <el-input  prefix-icon="el-icon-s-custom" v-model="addForm.mobile" type="text"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="usersList" :border="true" :stripe="true">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 会覆盖prop-->
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="getState(scope.row)">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<style lang="less" scoped>

</style>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: '',
      total: 0,
      id: 123,
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 15, max: 20, message: '长度在 15 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 10, max: 11, message: '长度在 10 到 11 个字符', trigger: 'blur' }
        ]
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: 123
      }
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    async getUsersList () {
      const { data: result } = await this.$http.get('users', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.usersList = result.data.users
        this.total = result.data.total
      }
    },
    handleSizeChange (newPage) {
      this.queryInfo.pagesize = newPage
      this.getUsersList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    resetForm () {
      this.$refs.addFormRef.resetFields()
    },
    add () {
      this.dialogVisible = false
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 1
        const { data: result } = await this.$http.post('users', this.addForm)
        if (result.meta.status !== 201) this.$message.error('添加失败')
        else {
          this.$message.success('添加成功')
          this.getUsersList()
        }
      })
    },
    async del (list) {
      const { data: result } = await this.$http.delete(`users/${list.id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.$message.success(result.meta.msg)
        this.getUsersList()
      }
    },
    async getState (list) {
      const { data: result } = await this.$http.put(`users/${list.id}/state/${list.mg_state}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.$message.success(result.meta.msg)
        this.getUsersList()
      }
    }
  }
}
</script>
