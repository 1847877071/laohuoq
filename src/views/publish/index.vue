<template>
  <div class='publish-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.id?'修改文章':'发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form :model="article" :rules='formRules' ref="publish-form" label-width="60px">
        <el-form-item label="标题" prop='title'>
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop='content'>
          <el-input type="textarea" v-model="article.content"></el-input>
          <!-- <el-tiptap v-model="article.content" :extensions="extensions" height="300" placeholder="请输入文章内容"></el-tiptap> -->
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 我们需要把选择的封面的图片地址放到article.cover.image

          当你给事件处理函数传递了自定义参数以后，就无法得到原本的那个数据参数了

          如果想要在事件处理函数自定义传参以后还想得到原来的那个事件本身的参数，则手动指定$event，它就代表那个事件本身的参数

          在组件上使用v-model
          当你给子组件提供的数据既要使用还要修改，这个时候我们可以使用 v-model 简化数据绑定。

            1.父组件v-model="article.cover.images[index]"
              给子组件传递了一个名字叫 value 的数据
            :value="article.cover.images[index]"
            2.//此时子组件Props也该改为props: ['value'],
            3.同时子组件upload-cover页面顶部的封面也该绑定:src="value",
            4.且需在upload-cover页面中loadImage接口中的
              // 将图片的地址发送给父组件
              this.$emit('update-cover', res.data.data.url)改为
              this.$emit('input', res.data.data.url)

              默认监听 input 事件，当事件发生，它会让绑定数据 = 事件参数
              @input="article.cover.images[index] = 事件参数"

            注意：v-model 仅仅是简写了而已，本质还在在父子组件通信

            v-model 的参考文档：https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
           -->
          <!-- @update-cover="onUpdateCover(index, $event)"
          :cover-image="article.cover.images[index]" -->
          <template v-if = "article.cover.type>0">
          <upload-cover v-for="(cover, index) in article.cover.type" :key="cover"
          v-model="article.cover.images[index]"
          />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop='channel_id'>
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
            :label="channel.name"
            :value="channel.id"
            v-for="(channel,index) in channels"
            :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{$route.query.id?'修改':'发表'}}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getArticlechannels, addArticle, updateArticle, getArticle } from '@/api/article'
import UploadCover from './components/upload-cover.vue'
// import Vue from 'vue'
// import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image.js'
// import {
//   // 需要的 extensions
//   ElementTiptapPlugin,
//   ElementTiptap,
//   Doc,
//   Text,
//   Paragraph,
//   Heading,
//   Bold,
//   Underline,
//   Italic,
//   Strike,
//   ListItem,
//   BulletList,
//   OrderedList,
//   Fullscreen,
//   Preview,
//   Image,
//   CodeBlock
// } from 'element-tiptap'
// Vue.use(ElementTiptapPlugin, {
//   lang: 'zh'
// })
export default {
  name: 'PublishIndex',
  components: {
    // 'el-tiptap': ElementTiptap
    UploadCover
  },
  props: {
  },
  data () {
    return {
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张，默认单图被选中
          images: [] // 封面图片的地址
        }, // 文章封面
        channel_id: '' // 文章频道
      },
      // extensions: [
      //   new Doc(),
      //   new Text(),
      //   new Paragraph(),
      //   new Heading({ level: 5 }),
      //   new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
      //   new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
      //   new Image({
      //     // 默认会把图片生成base64字符串和内容存储在一起，
      //     // 如果需要自定义图片上传
      //     uploadRequest (file) {
      //       // console.log('uploadRequest')
      //       // console.log(file)
      //       // 如果接口要求Content-Type是multipart/form-data，
      //       // 则请求体必须使用 FormData
      //       const fd = new FormData()
      //       fd.append('image', file) // 名为image的文件对象
      //       // 第1个return是返回Promise对象，因为axios本身就是返回Promise对象
      //       return uploadImage(fd).then(res => {
      //         // 这个return是返回最后的结果
      //         return res.data.data.url
      //       })
      //     }
      // }),
      //   new CodeBlock(),
      //   new Italic(),
      //   new Strike(),
      //   new ListItem(),
      //   new BulletList(), // 无序列表
      //   new OrderedList(), // 有序列表
      //   new Fullscreen(),
      //   new Preview()
      // ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') { // 这个是针对输入过内容删除的
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' } // 这个是针对没用输入的
        ],
        channel_id: [
          { required: true, message: '请x选择文章频道' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadChannels()
    if (this.$route.query.id) {
      this.loadArticle()
    }
    // 由于我们让发布和修改使用的同一个组件
    // 所以这里需要判断
    // 如果路由路径参数中有id，则请求展示文章内容
  },
  mounted () {
  },
  methods: {
    loadChannels () {
      getArticlechannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        // 验证失败，停止提交表单
        if (!valid) {
          return
        }
        // 验证通过，提交表单
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单

        // 如果是修改文章，则执行修改操作，否则执行添加操作

        // console.log(this.article)
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作，调用updateArticle接口函数
          updateArticle(articleId, this.article, draft).then(res => {
            console.log(res)
            this.$message({
              message: `${draft ? '存入草稿' : '修改'}成功`,
              type: 'success'
            })
          })
        } else {
          // 执行添加操作
          addArticle(this.article, draft).then(res => {
            console.log(res)
            this.$message({
              message: draft ? '存入草稿' : '发布成功',
              type: 'success'
            })
            this.$router.push('/article')
          })
        // 处理响应结果
        }
      })
    },
    loadArticle () {
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      // 模板绑定展示
      getArticle(this.$route.query.id).then(res => {
        // console.log('geteArticle', res)
        this.article = res.data.data
      })
      // uploadImage().then(res => {
      //   console.log(res)
      //   // this.article.cover.
      // })
    },
    onUpdateCover (index, url) {
      console.log(url)
      // this.article.cover.images[索引] = url
      this.article.cover.images[index] = url
      // console.log(this.article.cover.images[index])
    }
  }
}
</script>
<style lang="less" scoped>

</style>
