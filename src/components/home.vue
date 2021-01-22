<template>
  <div class="home-container">
    <el-button type="info" @click="goback">退出</el-button>
  </div>
</template>

<style lang="less" scoped>

</style>

<script>
export default {
  methods: {
    goback () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
