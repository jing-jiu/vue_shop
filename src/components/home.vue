<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo-container">
        <img src="../assets/headlogo.png" alt="logo">
        <span id="spaninfo">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="goback">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" :unique-opened="true" :router="true" :default-active="dataPath">
          <el-submenu :index="item.id+''" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/'+items.path" v-for="items in menuList[index].children" :key='items.id'  @click="getUsersList">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ items.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间区域 -->
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.home-container{
  height: 100%;
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    .logo-container{
      display: flex;
      align-items: center;
      img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      #spaninfo{
        margin-left: 20px;
        color: rgba(255, 255, 255, 0.877);
        font-size: 30px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
}
</style>

<script>
export default {
  data () {
    return {
      menuList: [],
      dataPath: ''
    }
  },
  created () {
    this.getMenusList()
    this.dataPath = window.sessionStorage.getItem('path')
  },
  methods: {
    goback () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenusList () {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      else { this.menuList = result.data }
    },
    getPath (path) {
      window.sessionStorage.setItem('path', path)
    },
    getUsersList () {
      console.log('滴滴滴')
    }
  }
}
</script>
