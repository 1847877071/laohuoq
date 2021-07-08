<template>
  <el-container class="layout-container">
    <el-aside class="aside" width=auto :collapse="isCollapse">
      <AppAside :isCollapse="isCollapse" class="asideMenu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i @click="isCollapse = !isCollapse" :class="{'el-icon-s-fold':isCollapse,'el-icon-s-unfold':!isCollapse}"></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/settings')">设置</el-dropdown-item>
            <!-- 组件默认是不识别原生事件的，除非内部做了处理 -->
            <!-- .native原生事件修饰符 -->
            <el-dropdown-item
            @click.native="onLogout"
            >退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- <div class='layout-container'>
    <div>顶部导航栏</div>
    为了首页等页面中间内容能出来所以需要留一个子路由出口
    子路由出口
     <router-view/>
    <div>侧边导航栏</div>
  </div> -->
</template>
<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '@/api/user.js'
import globalBus from '@/utils/global-bus'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏的展开状态
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()
    // 注册自定义事件
    // 当这个事件发布以后，这个注册函数就会被调用到
    globalBus.$on('updateUser', data => {
      // this.user = data // 这样是不行的，以为对象之间的赋值是引用，会导致相互影响的问题（这样会导致输入框修改，头像那里直接就修改了）
      this.user.name = data.name
      this.user.photo = data.photo // 这样是普通数据类型，就不会像上面对象类型会直接影响，这样写就只要那边点击保存的时候才会改变
    })
  },
  mounted () {},
  methods: {
    // 除了登录接口，其它所有接口都需要授权才能请求使用
    // 或者说除了登录接口，其它接口都需要提供你的身份令牌才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      // 确认退出提示模板在element是消息弹窗
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
}
.aside {
  background-color: #d3dce6;
  .asideMenu {
    height: 100%;
  }
}
.header {
  // background-color: #b3c0d1;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    .avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.main {
  background-color: #e9eef3;
}
</style>
