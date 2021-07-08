<template>
  <div class='comment-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <!--
        1.把数据列表绑定给表格的data
        2.设计表格列
        3.给表格列绑定要渲染的数据字段
       -->
      <el-table
        class="table-list"
        stripe
        :data="comments"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数">
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数">
        </el-table-column>
        <!-- 因为状态是两种情况，true和false，所以需要自定义表格列 -->
        <el-table-column
          prop="comment_status"
          label="评论状态">
          <template slot-scope='scope'>
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <!-- slot-scope='scope'是vue的意思，组件作用域插槽 -->
          <template slot-scope='scope'>
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change='onStatusChange(scope.row)'
              :disabled='scope.row.statusDisabled'>
            </el-switch>
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
      </el-table>
      <!--
        绑定页码
        绑定每页大小
        :current-page="currentPage4"  设置高亮页码，控制激活的页码，初始值肯定是第一页
        :page-sizes 控制可选的每页大小，选择器
        :page-size 指定page-sizes里的选项
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalComments"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticles, updateCommentStatus } from '@/api/article.js'
export default {
  name: 'commentIndex',
  components: {
  },
  props: {
  },
  data () {
    return {
      currentPage4: 4,
      comments: [],
      totalComments: 0, // 总数据条数
      pageSize: 10, // 初始为10条每页 因为它是参数传递给了getComments函数，所以页面变化时，page分页会让这里的值变化，
      //  然后变化值传递给getComment函数，它的数据会变
      currentPage: 1 // 当前激活的页码  因为它是参数传递给了getComments函数，所以页面变化时，page分页会让这里的值变化，
      //  然后变化值传递给getComment函数，它的数据会变
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    // 初始化时就获取数据
    this.loadComments()
  },
  mounted () {
  },
  methods: {
    handleSizeChange () {
      // console.log(`每页 ${val} 条`)
      this.loadComments(1) // 1表示加载第一页数据
    },
    handleCurrentChange (page) {
      // 页码改变，加载指定页码数据
      this.loadComments(page)
    },
    loadComments (page = 1) {
      // 让分页组件的激活的页码和请求数据的页码保持一致
      this.currentPage = page // 后面这个Page是请求数据的第几页，就是函数中的参数，前面的Page是data中的高亮页
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        // const results = res.data.data.results
        // const { results } = res.data.data
        // 上面第二种写法是第一种写法的解构形式，可以查看学习数据结构
        const { results } = res.data.data
        results.forEach(comment => {
          comment.statusDisabled = false
        })
        console.log(results)
        this.comments = results
        this.totalComments = res.data.data.total_count
      })
    },
    onStatusChange (comment) {
      // 开启禁用状态
      comment.statusDisabled = true
      // 请求提交修改，这就需要找修改评论的接口
      // comment.id本来是个对象，对象里面有个数组，将id分成了数组里的两个值，comment.id.toString()就把两个值拼接起来了
      updateCommentStatus(comment.id.toString(), comment.comment_status).then(res => {
        // console.log(res)
        comment.comment_status = res.data.data.allow_comment
        // 关闭禁用状态
        comment.statusDisabled = false
        // 设置提醒语句
        this.$message({
          type: 'success',
          message: comment.comment_status ? '开启评论，可以接收评论啦' : '关闭评论，sorry'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.table-list {
  margin-bottom:10px;
}
</style>
