# 基于 single-spa 的微前端框架

沙盒模式实现全局变量隔离，子项目切换的过程中实现项目样式文件的移除和插入，主子应用之间的通信。通过项目的 html 得到项目的脚本和样式

## 安装

```cli
npm i @hydesign/grape --save
```

## 基本用法

```js
import Grape from '@hydesign/grape'

new Grape([
        {
            name:'xxx',// 项目名
            projectIndex:'http://xxxx.com',// 项目访问入口
            base:false,// 是否需要一直在页面中显示
            path:'#/goods',// 项目显示条件。可以是数组
            routeMode: 'hash' // 路由模式
        }
    ])
    .start()
```

### 子项目配置

|字段|类型|是否必填|可选值|默认值|描述|
|----|----|----|----|---|----|
|name|String|是|-|-|项目名|
|projectIndex|String|是|-|-|项目访问入口|
|base|Boolean|否|true,false|false|是否需要一直在页面中显示|
|path|[String,Array]|否|-|[]|项目的显示条件，当base为true时，path的值会被忽略|
|routeMode|String|否|hash，history|hash|路由模式。 routeMode 和 path 配合使用来确认项目的显示与否|
|domID|String|否|-|''|项目要挂载的dom节点的id属性|
|customProps|Object|否|-|{}|各个生命周期要传递到项目的自定义属性|

### grape 实例

#### start 方法

start 方法用于 启动 grape, start 方法可以接受一个对象作为参数，它返回一个 promise

```
grape.start(opts)
```

opts 对象的属性

|属性名|类型|是否必填|可选值|默认值|描述|
|----|----|----|----|----|----|
|fetch|Function|否|-|window.fetch|@hydesign/grape 通过 fetch 函数来获取项目访问入口对应的 html 文档，fetch函数必须返回一个promise|
|repeatNum|Number|否|-|1|当使用 fetch 获取项目的 html 失败之后，重新获取的次数|
|repeatInterval|Number|否|-|2000|当使用 fetch 获取项目的 html 失败之后，再次获取间隔的毫秒数|
|useSandbox|Boolean|否|-|false|是否开启沙盒模式

#### apps

如果想要得到 grape 中所有的 app 的信息你可以通过 apps 属性得到，apps 的值不能从外部修改

```
grape.apps
```

app的状态

* NOT_LOAD: 还没有开始加载 app 的资源
* LOADING: 正在加载 app 的资源
* LOAD_ERROR: app 的资源加载失败
* LOADED: app 的资源加载成功
* REGISTERED: app 注册成功
* REGISTER_ERROR: app 注册失败


## 高级用法

除了可以通过实例化 grape 对象时传入一系列 app，然后调用 start 的方式去注册 app，也可以调用 Grape 的 loadApp 方法去注册 app。

```js
import Grape from '@hydesign/grape'

new Grape().start();

Grape.loadApp({
    name:'xxx',// 项目名
    projectIndex:'http://xxxx.com',// 项目访问入口
    base:false,// 是否需要一直在页面中显示
    path:'#/goods',// 项目显示条件。可以是数组
    routeMode: 'hash' // 路由模式
})
```

可以在`grape`启动之后的任何时候调用`Grape.loadApp`

调用`Grape.loadApp`注册 app 时，它会做如下判断：

1. 这个 app 是否已经加入到 grape.apps 中，如果没有，将这个 app 加入 apps 中，并且加载 app 的资源，最后注册 app。
2. 这个 app 的资源是否加载失败或者 app 是否注册失败，如果失败了，则重新加载资源，然后注册 app
3. 这个 app 已经注册成功，这个方法什么都不会做

> 如果 app 已经加入到 grape.apps 中, 调用 Grape.loadApp 会使用 grape.apps 队列中的 app 的 projectIndex 去加载资源。

## 设置子项目的生命周期函数

```js
import vue from 'vue';
import App from './App.vue';
import router from './router';
import { isInGrape,GrapeLifecycle } from '@hydesign/grape'
let vueLifecycles = {}
if(isInGrape()) {
   vueLifecycles = GrapeLifecycle({
    Vue:vue,
    appOptions: {
      // el 指定挂载点
      el:'#main',
      render: (h) => h(App),
      router,
    },
  });
} else {
  // 独立运行
  new Vue({
      render: (h) => h(App),
      router,
    }).$mount('#main')
}



export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
```

## 主子项目之间通信

在主项目中初始化全局共享的状态

```js
    import { default as  Grape, initGlobalState} from '@hydesign/grape'
    const state = {xxx:'xxx'}
    
    // 初始化全局 statue
    const stateActions = initGlobalState(state)
    // 监听全局 state 的变化
    stateActions.onGlobalStateChange((state,prevState) => {
      console.log(state,prevState)
    })
    // 修改全局 state
    stateActions.setGlobalState({xxx:'xxxx'})
    
    new Grape([
            {
                name:'xxx',// 项目名
                projectIndex:'http://xxxx.com',// 项目访问入口
                base:false,// 是否需要一直在页面中显示
                path:'#/goods',// 项目显示条件。可以是数组
                routeMode: 'hash' // 路由模式
            }
        ])
        .start()
```

在子项目的生命周期钩子中得到操作全局state 的具柄

```js
    import vue from 'vue';
    import App from './App.vue';
    import router from './router';
    import { GrapeLifecycle } from '@hydesign/grape'
    
    const vueLifecycles = GrapeLifecycle({
        Vue:vue,
        appOptions: {
          el:'#main',
          render: (h) => h(App),
          router,
        },
      });
    
    export const bootstrap = vueLifecycles.bootstrap;
    export const unmount = vueLifecycles.unmount;
    
    export const mount = (props) => {
      // 在子项目中监听全局 state 的变更
      props.onGlobalStateChange((statue,prevState) => {
        console.log(statue,prevState)
      })
      // 在子项目中修改全局 state
      props.setGlobalState(state)
      
      return vueLifecycles.mount(props)
    }
  
```
## 给子项目的入口js加标识

经过打包工具（如：webpack）打包之后一个项目在 index.html 中插入的 js 脚本可能不只一个，所以为了确保`@hydesign/grape`能够正确的从项目中解析到入口js，给入口 js 文件加上一个 entry 属性，如果所有的js脚本都没有 entry 属性,`@hydesign/grape`会将index.html 的中最后一个脚本当作入口js
 
 ``` 
 const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
 plugins:[
     ...
     new ScriptExtHtmlWebpackPlugin({
       custom: {
         test: /app.*\.js$/,
         attribute: 'entry',
         value: true
       }
     })
   ]
 ```

## 打包子项目

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别子项目暴露出来的一些信息，子项目的打包工具需要增加如下配置：

```
output: {
    ...
    libraryTarget: 'umd',
    library: xxx,// library 与 子项目名一致 
    jsonpFunction: webpackJsonp_xxx,
}
```

## demo
[github 源代码](https://github.com/QxQstar/single-spa-vue)
