# 基于single-spa的微前端框架

解决了微前端项目资源加载的问题

## 安装
```cli
npm i @hydesign/grape --save
```

## 使用
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

## demo
[github 源代码](https://github.com/QxQstar/single-spa-vue)
