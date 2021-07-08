<template>
  <div class='upload-cover'>
    <div class="cover-wrap" @click="showCoverSelect">
      <img class="cover-image" ref="cover-image" :src="value" alt="">
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      append-to-body
      >
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="素材库" name="first">
            <!--
              ref有两个作用
              1、作用到普通HTML标签上可以获取DOM
              2、作用到组件上可以获取组件
             -->
            <imageList :is-show-add="false" :is-show-action="false"
            ref="image-list"
            :is-show-selected="true"
            />
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="second">
            <input type="file" @change="onFileChange" ref="file">
            <img src="" width="100px" ref="preview-image">
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import imageList from '@/views/image/components/image-list.vue'
import { uploadImage } from '@/api/image.js'
export default {
  name: 'UploadCover',
  components: {
    imageList
  },
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
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
    showCoverSelect () {
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file) // 获取选择文件的url
      // 让图片的src指向刚刚选择文件的url
      this.$refs['preview-image'].src = blob
      // 防止用户选择同一个文件不触发change事件，这里不需要，因为有了它就清空了，选择不上图片
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      // 如果tab是上传图片，并且input-file有选择的文件，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        const blob = window.URL.createObjectURL(file)
        if (!file) {
          this.$message({
            message: '请选择文件'
          })
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file) // 这里的image是看的接口文件（上传用户素材）里明文规定是Image,不能乱写
        uploadImage(fd).then(res => {
          // 关闭弹出框
          this.dialogVisible = false
          // 将图片预览内容上传给cover,展示上传的图片
          // this.$refs['cover-image'].src = res.data.data.url
          // 将图片的地址发送给父组件
          // this.$emit('update-cover', res.data.data.url)
          // console.log(res.data.data.url)
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据,通过在引用标签上加ref
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message({
            message: '请选择文件'
          })
          return
        }
        // 关闭弹出框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .cover-wrap {
    width: 150px;
    height: 100px;
    border: 1px dotted #ccc;
    .cover-image {
      max-width: 100%;
      height: 120px;
    }
  }
</style>
