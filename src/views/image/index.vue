<template>
  <div class='image-container'>
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <!-- 图片列表 -->
      <imageList/>
      <!-- /图片列表 -->
    </el-card>
  </div>
</template>
<script>
import imageList from './components/image-list.vue'
export default {
  name: 'ImageIndex',
  components: {
    imageList
  },
  props: {
  },
  data () {
    return {}
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
</style>
