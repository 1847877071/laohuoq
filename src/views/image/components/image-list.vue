<template>
  <div class='image-list'>
    <template>
      <div style='padding-bottom: 20px'>
        <!-- <el-radio-group v-model="radio1">
          <el-radio-button @click.native="loadImages(false)" label="全部"></el-radio-button>
          <el-radio-button @click.native="loadImages(true)" label="收藏"></el-radio-button>
        </el-radio-group> -->
        <el-radio-group size = 'mini' v-model="collect" @change='loadImages(1)'>
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button style="float: right" size = 'mini' type="success" @click="dialogUploadVisible='true'" v-if="isShowAdd">上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col class='image-item' :xs="8" :sm="6" :md="4" :lg="3" v-for="(image,index) in images" :key="index" @click.native="selected=index">
          <el-image
          style="height: 100px"
          :src="image.url"
          fit="cover"
          ></el-image>
          <div class="selected" v-if="selected===index && isShowSelected"
           ></div>
          <div class='image-active' v-if="isShowAction">
            <el-button :loading='image.collectLoading' @click='onCollect(image)' type="warning" :icon="image.is_collected ? 'el-icon-star-on':'el-icon-star-off'" circle size="mini"></el-button>
            <el-button :loading='image.deleteLoading' @click="onDelete(image)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            <!-- <el-button :loading='image.collectLoading' @click="onDelete(image)" type="danger" icon="el-icon-delete" circle size="mini"></el-button> -->
            <!-- class样式绑定{css类名：布尔值} true作用于类名，false不作用于类名-->
            <!-- <span @click='onCollect(image)' :class="{'el-icon-star-off':!image.is_collected,'el-icon-star-on':image.is_collected}"></span>
            <span :class="{'el-icon-delete':!image.is_collected,'el-icon-delete-solid':image.is_collected}"></span> -->
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
      <!-- 数据分页 -->
      <!-- 分页数据改变以后，页码不会变化，它需要单独处理高亮的页码-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onPageChange">
      </el-pagination>
      <!-- /数据分页 -->
      <el-dialog title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body='true'
      >
      <!--
      :modal-append-to-body='false'默认为true 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
      这个dialog和弹出层一起跑到image-container里面了,若为false一起跑进去-->
      <!-- :append-to-body='false'  建议用它，因为这个页面本身是在其它层上面，默认为false Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
      弹出层的遮挡效果，为false那么弹出层内容也被遮罩遮住，为true那么弹出层内容不会被遮罩遮住 若为true,一起跑出来到body下 -->

        <!-- upload组件本身就支持请求提交上传操作，使用它不用自己去发请求，它会自己发，
        请求方法：默认就是POST
        请求路径：action，必须写完整路径
        请求头：headers-->
        <!-- v-if="dialogUploadVisible"如果不加，那么每次添加图片时弹出层dialog会记忆之前添加的图片就是有个小勾勾那个，
        加上这个就会自动删除。
        或者设置 :show-file-list="false" 是否显示已上传文件列表,默认是true就是会显示.-->
        <el-upload
          v-if="dialogUploadVisible"
          class="upload-demo"
          drag
          action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
          :headers="uploadHeaders"
          name="image"
          :on-success="onUploadSuccess"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import { getImages, collectImage, deleteImage } from '@/api/image.js'
export default {
  name: 'ImageList',
  components: {
  },
  // 使用对象的方式定义prop，更严谨，功能更丰富，强烈建议在项目中使用
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认为true
    },
    // 是否显示图片上收藏删除图标
    isShowAction: {
      type: Boolean, // 布尔值
      default: true // 默认为true
    },
    // 是否展示选择
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  // 使用数组声明prop不建议，因为不够严谨，而且功能也不够强大，仅适合做demo演示
  // props: ['dsdsd'] 这种写法用得少
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(user)
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      pageSize: 10, // 每页大小
      page: 1, // 当前页码，这个是用于处理页码高亮切换全部和收藏时不返回第一页的
      totalCount: 0, // 总图片数量
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      selected: null // 素材图片中选中的索引
      // collectLoading: false // 默认不加载，点击请求中才加载，但是这里有个问题是会添加到每个图片的收藏按钮上，
      // 所以不采用此方法，而是给网页vue中的images中的数组对象加collectLoading状态
      // 详见发请求的地方loadImages方法中getImages方法中的forEach方法
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    // 页面初始化加载第一页的数据
    this.loadImages(1, false)
  },
  mounted () {
  },
  methods: {
    // loadImages(collect=false) {
    //   getImages({collect}).then(res => {
    //     console.log(res)
    //     this.images = res.data.data.results // 如果把后面的.url加上就实现不了，网页vue里面是空的
    //   })
    // }
    loadImages (page = 1) {
      // 重置高亮页码，防止数据和页码不对应
      // console.log(page) 这个page就是点击的那页就是那页
      this.page = page
      getImages({ page, per_page: this.pageSize, collect: this.collect }).then(res => {
        // console.log(res)
        const results = res.data.data
        results.results.forEach(imagE => {
          // image对象本来没collectLoading数据，
          // 我们这里收到的往里面添加该数据是用来控制每个收藏按钮的collectLoading状态
          imagE.collectLoading = false
          imagE.deleteLoading = false
        })
        this.totalCount = results.total_count
        this.images = results.results // 如果把后面的.url加上就实现不了，网页vue里面是空的
      })
    },
    // onImagesChange (value) {
    //   this.loadImages(1, value)
    // },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page) // 因为更新到全部图片，不是值只看收藏图片，所以这里传参数为false,上面设置的默认值为false,这里可省略
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (imagS) {
      // if (image.is_collected) {
      // 已收藏，取消收藏
      imagS.collectLoading = true
      // 更新视图状态
      collectImage(imagS.id, !imagS.is_collected).then(res => {
        imagS.is_collected = !imagS.is_collected
        imagS.collectLoading = false
      })
      // } else {
      // 未收藏，添加收藏
      // }
      // collectImage().then( res => {
      //   console.log(res)
      // })
    },
    onDelete (image) {
      image.deleteLoading = true
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteImage(image.id).then(res => {
          this.loadImages()
          image.deleteLoading = false
        })
        this.$message({
          type: 'success',
          message: '删除成功'
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
.image-item {
  position: relative;
  font-size: 20px;

}
.image-active {
  height: 30px;
  position: absolute;
  left: 5px;
  right: 5px;
  bottom: 5px;
  // color:rgb(155, 7, 93);
  background-color: rgba(204,204,204,.5);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.selected {
  background-image: url(./selected.png);
  background-size: cover;
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
}
</style>
