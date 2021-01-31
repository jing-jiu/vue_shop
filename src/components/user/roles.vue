<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="50%"
         @close="resetForm">
        <el-form :model="addForm" class="add_form" ref="addFormRef">
           <!-- 角色名称 -->
            <el-form-item prop='roleName'>
              <el-input  prefix-icon="el-icon-s-custom"  v-model="addForm.roleName" type="text"></el-input>
            </el-form-item>
            <!-- 角色描述 -->
            <el-form-item prop='roleDesc'>
              <el-input  prefix-icon="el-icon-s-help" v-model="addForm.roleDesc" type="text"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="rolesList" :border="true" :stripe="true">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :key="item1.id" v-for="(item1,i1) in scope.row.children" :class="['bd-bottom', 'vcenter', i1 === 0 ? 'bd-top' : '']">
              <el-col :span="5">
                <el-tag :closable="true" @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :key="item2.id" v-for="(item2,i2) in item1.children">
                  <el-col :span="6" :class="[i2 === 0 ? '' : 'bd-top,vcenter']">
                    <el-tag type="success" :closable="true" @close="removeById(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag :key="item3.id" v-for="(item3) in item2.children" type="warning" :closable="true" @close="removeById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="settingRoles(scope.row)">分配权限</el-button>
            <el-dialog
        title="分配权限"
        :visible.sync="dialog2Visible"
        width="50%" @close="resetDefKeys">
         <el-tree :data="treeList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog2Visible = false">取 消</el-button>
          <el-button type="primary" @click="settingRights">确 定</el-button>
        </span>
      </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bd-top{
  border-top: 1px solid #eee;
}
.bd-bottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
<script>
export default {
  data () {
    return {
      rolesList: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      dialogVisible: false,
      dialog2Visible: false,
      treeList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.rolesList = result.data
      }
    },
    resetForm () {
      this.$refs.addFormRef.resetFields()
    },
    add () {
      this.dialogVisible = false
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 1
        const { data: result } = await this.$http.post('roles', this.addForm)
        if (result.meta.status !== 201) this.$message.error('添加失败')
        else {
          this.$message.success('添加成功')
          this.getRolesList()
        }
      })
    },
    async del (list) {
      const { data: result } = await this.$http.delete(`roles/${list.id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.$message.success(result.meta.msg)
        this.getRolesList()
      }
    },
    async removeById (role, rightId) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (result === 'confirm') {
        const { data: result } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        else {
          this.$message.success(result.meta.msg)
          role.children = result.data
        }
      }
    },
    getRolesId (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getRolesId(item, arr)
      })
    },
    async settingRoles (role) {
      this.roleId = role.id
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.$message.success(result.meta.msg)
        this.treeList = result.data
        this.getRolesId(role, this.defKeys)
      }
      this.dialog2Visible = true
    },
    resetDefKeys () {
      this.defKeys = []
    },
    async settingRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const strs = keys.join(',')
      const { data: result } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: strs })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else {
        this.$message.success(result.meta.msg)
        this.dialog2Visible = false
        this.getRolesList()
      }
    }
  }
}
</script>
