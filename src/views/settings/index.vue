<template>
  <div class='settings-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="16">
          <el-form ref="form" :model="user" label-width="40px">
            <el-form-item label="编号">
              <span>{{user.id}}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{user.mobile}}</span>
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <!-- 下面这种写法不行，不能展示到页面 -->
            <!-- <el-form-item label="媒体介绍1">
              <el-input type="textarea">{{user.mobile}}</el-input>
            </el-form-item> -->
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser" :loading="updateUserProfileLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- :offset='2'设置偏移 -->
        <el-col :offset="2" :span="6">
          <el-avatar
          shape="square"
          :size="150"
          fit="cover"
          :src="user.photo">
          </el-avatar>
          <p @click="$refs.file.click()">点击修改头像</p>
          <label for="file"></label>
          <!-- input本身有个change事件,change事件是当选择图片改变时触发，如果两次选择的图片一样就不会触发事件 -->
          <input id='file' type="file" ref="file" @change="onFileChange" hidden>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpen"
      >
      <!-- @closed="onDialogClosed" -->
      <div class="preview-image-wrap">
        <img
        class="preview-image"
        :src="previewImage"
        ref="preview-image"
        >
        <!-- @opened="onDialogOpen"
        ref="preview-image" -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
        type="primary"
        :loading="updatePhotoLoading"
        @click="onUpdatePhoto"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user.js'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  name: 'settingIndex',
  components: {
  },
  props: {
  },
  data () {
    return {
      user: {
        email: '',
        id: null, // 数字就写Null初始化
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      cropper: null, // 裁切器示例
      updatePhotoLoading: false, // 用户头像更新点击确定loading
      updateUserProfileLoading: false // 更新用户信息loading
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadUser()
  },
  mounted () {
  },
  methods: {
    onUpdateUser () {
      // 开启loading状态
      this.updateUserProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({ name, intro, email }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 关闭loading 状态
        this.updateUserProfileLoading = false
        // 更新头部当前登录用户信息
        // 发布通知，用户信息已修改
        globalBus.$emit('updateUser', this.user)
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
        // console.log(this.user)
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file // 它就是上面file类型的input
      // file有个files属性，打印后时个对象
      // console.log(file.files[0]) 就能看到上传图片时选择文件的资料
      const blobData = window.URL.createObjectURL(file.files[0]) // 这是h5里面新增的，它就是个api,记住就行了
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true
      // 解决选择相同文件不触发change事件问题
      this.$refs.file.value = '' // this.$refs.file表示拿到input那个标签
    },
    onDialogOpen () { // 这个函数可以不用要了
      // 图片裁切器必须基于Image进行初始化：注意（image必须是可见状态才能正常完成初始化），
      // 所以此时需要在图片上加上事件@opened="onDialogOpen"详细见dialog的event属性
    // 然后将以下代码加入onDialogOpen这个方法中
      const image = this.$refs['preview-image'] // 获取图片DOM节点，但是我们在vue中是通过ref获取元素，所以在image元素上加一个ref=’preview-image‘
      // 第一次初始化好以后，如果预览裁切器的图片发生了改变，
      // 裁切器默认不会更新
      // 如果需要预览图片发生变化更新裁切器
      // 方式一：裁切器.replace方法
      // 方式二：销毁裁切器.destroy，重新初始化
      // 同时将此句换成：const image = this.$refs['preview-image']
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return // 这里写return就不用再去写else了，不然就需要else把后面这段代码加进去
      }
      this.cropper = new Cropper(image, { // 初始化裁切器
        aspectRatio: 16 / 9, // 裁切器比例 ，1：1简写为1，如果发现问题，可以看包的选项进行添加调整属性。
        // 当你移动裁切器的时候会触发调用crop方法,
        crop (event) {
          console.log(event.detail.x)
          console.log(event.detail.y)
          console.log(event.detail.width)
          console.log(event.detail.height)
          console.log(event.detail.rotate)
          console.log(event.detail.scaleX)
          console.log(event.detail.scaleY)
        }
      })
    },
    // onDialogClosed () {
    //   // 对话框关闭，销毁裁切器
    //   this.cropper.destroy()
    // }
    onUpdatePhoto () {
      // 点击确定按钮开始loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        // fd.append('字段名称', file) // 这里的字段名称看接口文件中编辑用户头像里面的参数
        fd.append('photo', file)
        // 请求更新用户头像,请求提交fd
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          // 直接把裁切结果的文件对象转为blob数据本地预览这样更快
          this.user.photo = window.URL.createObjectURL(file)
          // this.user.photo = res.data.data.photo // 把服务端返回的图片进行展示有点慢
          console.log(res)
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 关闭确定按钮的loading
          this.updatePhotoLoading = false
          // 更新顶部登录信息
          globalBus.$emit('updateUser', this.user)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>·  .preview-image-wrap{
    .preview-image{
      /* 确保图像的大小与容器完全匹配 */
      display: block;
      /* 这条规则很重要，请不要忽视这一点 */
      max-width: 100%;
      height: 200px;
  }
  }
</style>
