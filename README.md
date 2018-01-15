# Music-Player
### 技能点
* 轮播图
* JSONP---跨域
* Promise
* Better-Scroll
* axios
* 后端接口代理
* flex布局
* scroll组件
* vue-lazyload
* better-scroll 和 fastclick 冲突问题
* loading组件
* autoPreFix
* 路由子组件
* 路由动画
* vuex
* touchstart 和 touchmove
* line-height: 1
* event.target 和 event.currentTarget
* setAttribute 和 getAttribute
* SVG图
* audio 标签
* create-keyframe-animation动画库
* referer 校验
* base64 转码
* Vue-mixin
* background-size: cover
* 节流函数 debounce
* 函数柯里化 => 实现节流函数
* 移动端滚动时，键盘收起
* 基础组件不做任何业务逻辑处理，直接向外派发事件即可，外部监听
* scroll组件内部第一层只能有一个div
* search组件在迷你播放器的高度自适应
* 添加@click.stop阻止冒泡
* 列表动画transition-group（name tag :key）
* 编译打包
1. node_modules --> vendor
2. prod.server.js
3. manifest --> 静态资源的清单
* node服务测试
* 性能优化
* 路由懒加载 --- 异步按需加载（减少首屏加载资源）
```js
const Recommend = resolve => {
  import('@/components/recommend/recommend').then(recommend => {
    resolve(recommend)
  })
}
```
* 配 CDN 域名 --- publicPath
* 移动端常用工具
1. vConsole 调试
2. Charles 抓包（windows系统 -> fiddler）https需要配置证书才可抓包
