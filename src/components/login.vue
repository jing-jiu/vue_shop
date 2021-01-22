<template>
    <div class="login-container">
       <div class="login_box">
         <!-- 头像区 -->
         <div class="avatar_box">
           <img src="../assets/logo.png" alt="logo">
         </div>
         <!-- 登录表单区 -->
         <el-form :model="loginForm" :rules="rules" class="login_form" ref="loginFormRef">
           <!-- 账号 -->
            <el-form-item prop='username'>
              <el-input  prefix-icon="el-icon-s-custom"  v-model="loginForm.username" type="text"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop='password'>
              <el-input  prefix-icon="el-icon-s-help" v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <!-- 提交 -->
            <el-form-item class="btns">
              <el-button type="primary" @click="login">提交</el-button>
              <el-button type="info" @click="resetLoginFrom">重置</el-button>
            </el-form-item>
        </el-form>
       </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginFrom () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return 1
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status !== 200) this.$message.error('登陆失败')
        else {
          this.$message.success('登陆成功')
          const token = result.data.token
          window.sessionStorage.setItem('token', token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .login-container{
    background-color: #2d4d6d;
    height: 100%;
    .login_box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        position:absolute;
        padding: 10px;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: #fff;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
      .login_form{
        width: 100%;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        padding: 0 20px;
        .btns{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
