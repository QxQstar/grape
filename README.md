# 基于 single-spa 的微前端框架

解决了 single-spa 没有解决的微前端项目资源加载的问题，到资源加载失败时，提供重新加载资源的方法。

`@hydesign/grape`将每个项目的 html 作为 entry 得到这个项目的 js，css 资源，然后将 js,css 插入到 document 中

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

start 方法用于 启动 grape, start 方法可以接受一个对象作为参数

```
grape.start(opts)
```

opts 对象的属性

|属性名|类型|是否必填|可选值|默认值|描述|
|----|----|----|----|----|----|
|fetch|Function|否|-|window.fetch|@hydesign/grape 通过 fetch 函数来获取项目访问入口对应的 html 文档，fetch函数必须返回一个promise|
|repeatNum|Number|否|-|1|当使用 fetch 获取项目的 html 失败之后，重新获取的次数|
|repeatInterval|Number|否|-|2000|当使用 fetch 获取项目的 html 失败之后，再次获取间隔的毫秒数|

#### setImportMap 方法

当需要将各个项目的公共库从项目代码中抽离出来统一管理，setImportMap 方法会很有用处。setImportMap 与 webpack externals 配合使用可以抽离出项目中不想打包的库，在项目运行时使用到这个库的时候再动态加载，setImportMap 的用法见下文

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
import singleSpaVue from 'single-spa-vue';
const vueLifecycles = singleSpaVue({
  Vue:vue,
  appOptions: {
    el:'#main',
    render: (h) => h(App),
    router,
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
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

## 将子项目打包成umd格式

```
output: {
    ...
    libraryTarget: 'umd',
    library: xxx,
}
```

## setImportMap 方法与 webpack external 配合

`@hydesign/grape`与`webpack`的 externals 配合使用，能够抽离出项目中不想打包的库，并且在项目运行当使用到这个库的时候在动态加载。

```
 externals(['vue',{'vue-router':'vueRouter'},{'element-ui':'elementUI'},'axios','hytools'])
```

```js
 import Grape from '@hydesign/grape';

 new Grape(appsConf)
        .setImportMap({
                "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
                "vueRouter": "https://cdn.jsdelivr.net/npm/vue-router@3.0.7/dist/vue-router.min.js",
                "elementUI":"https://cdn.jsdelivr.net/npm/element-ui@2.12.0/lib/index.js",
                "Vuex":"https://cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js",
                "axios":"https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js"
            })
        .start()
```

## demo
[github 源代码](https://github.com/QxQstar/single-spa-vue)
