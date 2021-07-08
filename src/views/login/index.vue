<template>
    <div class='login-container'>
        <!-- el-form 表单组件 每个表单项都必须使用el-form-item组件包裹 -->
        <!-- 配置Form表单验证：
          1、必须给el-form组件绑定model为表单数据对象
          2、给需要验证的表单项el-form-item绑定prop属性
            注意：prop属性需要指定表单对象中的数据名称
          3、通过el-form组件的rules属性配置验证规则

          手动触发表单验证：
          1、给el-form设置ref 起个名字（随便起名，但不要重复即可）
          2、通过ref获el-form组件，调用组件的validate进行验证
          -->
        <el-form
        class='login-form'
        ref="login-form"
        :model="user"
        :rules='formRules'
        >
            <el-form-item>
              <div class="login-head">
              </div>
            </el-form-item>
            <el-form-item prop='mobile'>
                <el-input
                placeholder="请输入手机号"
                v-model="user.mobile"></el-input>
            </el-form-item>
            <el-form-item prop='code'>
                <el-input
                placeholder="请输入验证码"
                v-model="user.code"></el-input>
            </el-form-item>
            <el-form-item prop='agree'>
              <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button
              class='login-btn'
              type="primary"
              :loading="loginLoading"
              @click="onLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>
<script>
import { login } from '@/api/user.js' // {}里面添加需要的方法，即按需加载
export default {
  name: 'LoginIndex',
  components: {
  },
  props: {
  },
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false// 是否同意协议
      },
      // checked: false, // 是否同意协议的状态
      loginLoading: false,
      formRules: { // 表单验证规则配置
        // 要验证的数据名称：规则列表[]
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        agree: [
          {
            // validator验证函数不是你来调用的，而是当element表单触发验证的时候它会自己内部调用
            // 所以你只需要提供校验函数处理逻辑就可以了
            validator: (rule, value, callback) => {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误信息'))
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选同意用户协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  counted () {
  },
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user
      // 表单验证
      // validate方法是异步的
      // console.log(this.$refs['login-form'])
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败，停止请求提交
        // console.log(valid)
        if (!valid) {
          return
        }
        // 验证通过，提交登录
        this.login()
      })
      // 处理后端响应结果
      // 成功：
      // 失败s
    },
    login () {
      const user = this.user
      // 开启登录中Loading...
      this.loginLoading = true
      // 对于代码中的请求操作
      // 1、接口请求可能需要重复使用
      // 2、实际工作中，接口非常容易变动，改起来麻烦
      // 建议的做法是把所有的请求都封装成函数然后统一的组织到模块中进行管理
      // 这样做的好处就是：管理维护更方便，也好重用
      login(user).then(res => {
        // console.log(res)// 登录成功
        this.$message({
          message: '登录成功',
          type: 'success',
          showClose: true
        })
        // 关闭loading...
        this.loginLoading = false
        // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
        // 本地存储智能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为JSON格式字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(error => {
        console.log('登录失败', error)// 登录失败
        this.$message.error('手机号或者验证码错误')
        // 关闭loading...
        this.loginLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .login-container{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
    .login-form{
      background-color: #fff;
      padding: 50px;
      min-width: 300px;
      .login-btn{
        width: 100%;
        }
    }
    .login-head{
      height: 57px;
      width: 300px;
      background:url('./heima-head.jpg') no-repeat;
      // margin-bottom: 1px;
    }
  }
</style>
