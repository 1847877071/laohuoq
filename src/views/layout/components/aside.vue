<template>
  <!-- 默认激活的页面路径 -->
  <!-- default-active="2" -->
  <!--这里router是为了下面配置index路径-->
  <!-- :default-active="$route.path"这里的值在vue组件里看的 -->
  <el-menu
    :default-active="$route.path"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-picture"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="el-icon-chat-dot-round"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-present"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  name: 'AppAside',
  components: {},
  props: ['is-collapse'], // props这里面不能用驼峰法，需要小横杠连接
  data () {
    return {
      // isCollapse: true
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style lang="less" scoped>
.iconfont {
  width: 24px;
  height: 17.6px;
  margin: 0 5px
}
</style>
