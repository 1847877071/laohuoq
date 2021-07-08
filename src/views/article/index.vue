<template>
  <div class='article-container'>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- :to="{ path: '/'}还可以写成 :to='/' 或者 :to='{name:'home'}' -->
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px"  size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- el-radio默认把label作为文本和选中之后的value值 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
            <!-- <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="(channel,index) in channels" :label="channel.name" :value="channel.id" :key='index'></el-option>
            <!-- <el-option v-for="item in channels" :label="item.name" :value="item.id" :key='item.index'></el-option> // 不知道这样写行不行 -->
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format='yyyy-MM-dd'
            value-format='yyyy-MM-dd'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!--
            button按钮的click事件有个默认参数
            当你没有指定参数的时候，它会默认传递一个没用的数据
           -->
          <el-button
          type="primary"
          :disabled='loading'
          @click="loadArticles(1)"
          >筛选</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{totalCount}}条结果：
      </div>
      <!-- 列表数据 -->
      <!-- Table表格组件
        1.把需要展示的数据列表数据绑定给table组件
        的data属性
        注意：你不用去v-for遍历，它自己会遍历
        2.设计表格列el-table-column
        width可以设定表格列的宽度
        label可以设定列的标题
        prop用来设定要渲染的列表数据字段,智能展示文本
        3.表格列默认只能渲染普通文本，如果需要展示
        其它内容，例如放个按钮、图片等，就需要自定义
        表格模板了，见element组件table里自定义列模板
      -->
      <el-table
        stripe
        :data="articles"
        style="width: 100%"
        class="list-table"
        size='small'
        v-loading="loading"
      >
        <el-table-column
          label="封面">
          <template slot-scope="scope">
            <!-- <el-image
            style="width: 100px; height: 100px"
            :fit="cover"></el-image> -->
            <img class='article-cover' v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="" :fit="cover">
            <img class='article-cover' v-else src="./article-noimage.jpg" alt="">
            <!-- <img class='article-cover' src="./article-noimage.jpg" alt=""> -->
            <!--下面这种情况是在运行期间动态改变处理的
            而本地图片必须在打包的时候就存在  -->
            <!-- <img class='article-cover' v-if=(scope.row.cover.images[0]) :src="scope.row.cover.images[0]" alt=""> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项
          数据，那么就在template上声明
          slot-scope="scope",等号前面是固定属性名，后面引号中可修改
           -->
           <template slot-scope="scope">
            <!-- <el-tag type="warning" v-if="scope.row.status===0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status===1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status===2">审核通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status===3">审核失败</el-tag>
            <el-tag type="info" v-else-if="scope.row.status===4">已删除</el-tag> -->
            <el-tag :type='articleStatus[scope.row.status].type'>{{articleStatus[scope.row.status].text}}</el-tag>
           </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期">
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作">
          <!-- 如果需要自定义表格列模板，
          则把需要自定义的内容放到template里面 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              icon="el-icon-edit"
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id)"></el-button>
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
              ></el-button>
      </template>
        </el-table-column>
      </el-table>
      <!-- /列表数据 -->
      <!-- 列表分页 -->
      <!-- total用来设定总数据的条数
      它默认按照10条每页计算总页码 -->
      <!-- page-size每页显示条目个数，这个系统默认值是10条，
      所以如果需要后台按照实际每页显示的条数来分页，
      需要单独对page-size设置值 -->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        @current-change='onCurrentChange'
        :page-size="pageSize"
        :disabled='loading'
        :current-page.sync="page">
        <!--这里如果没用sync就页面点击和数据就同步不过来-->
      </el-pagination>
      <!-- /列表分页 -->
    </el-card>

  </div>

</template>
<script>
import { getArticles, getArticlechannels, deleteArticle } from '@/api/article.js'
export default {
  name: 'ArticleIndex',
  components: {
  },
  props: {
  },
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'warning' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 20, // 每页大小
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 列表页面加载中
      page: 1
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadArticles(1)
    this.loadChannels()
  },
  mounted () {
  },
  methods: {
    loadArticles (page = 1) {
      // 展示加载中loading
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize, // 如果不用pageSize那么这里per_page改变时，页面总页数没变，所以在分页组件上加了:page-size='pageSize',将数据告知分页组件
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 起始时间，不传就不限定开始时间
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止时间，不传就不限定结束时间
      }).then(res => {
        // 数据重构{}
        // 数据重命名原名total_count:totalCount新名字
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // this.articles = res.data.data.results
        // this.totalCount = res.data.data.total_count

        // 关闭加载loading
        this.loading = false
      })
    },
    onSubmit (page) {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticlechannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .filter-card{
    margin-bottom:30px;
  }
  .list-table{
    margin-bottom: 20px;
    .article-cover{
      width:50px;
      background-size: cover;
    }
  }
</style>
