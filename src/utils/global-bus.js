/**
 * 全局事件通信总线
 * 呼叫中心
 * 作用：可以让任何组件之间相互通信
 */
import Vue from 'vue'

export default new Vue()

// 假设 a 组件要给 b 组件发送数据

// b 注册通信的事件，这个写到生命周期钩子（created里面），这样就可以拿到this.user
// import globalBus from '@/utils/global-bus'
// globalBus.$on('foo', (data) => {
//   // 处理函数
// })

// a 发布通信事件，这个在事件发布完成后最后一行写
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('bar', 145623)

// 注意：通信的两端所使用的事件名称必须一致，否则是无效的

// 反之，如果 b 要给 a 发送数据
// 那肯定就是 a 注册事件，b 来发布
