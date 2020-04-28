<a name="2.1.0"></a>
# [2.1.0](https://github.com/QxQstar/grape/compare/2.0.0...2.1.0) (2020-04-28)


### Features

* 实现样式的隔离 ([2fbf782](https://github.com/QxQstar/grape/commit/2fbf782))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/QxQstar/grape/compare/1.3.0...2.0.0) (2020-04-27)


### Features

* 修改 demo 中暴露生命周期的方式 ([6d43415](https://github.com/QxQstar/grape/commit/6d43415))
* 修改demo ([869d8ce](https://github.com/QxQstar/grape/commit/869d8ce))
* 修改例子 ([e339e6f](https://github.com/QxQstar/grape/commit/e339e6f))
* 修改获取子项目生命周期函数的变量 ([a4be727](https://github.com/QxQstar/grape/commit/a4be727))
* 删除多余的文件 ([f9eedb1](https://github.com/QxQstar/grape/commit/f9eedb1))
* 增加沙盒模式 ([2e1a306](https://github.com/QxQstar/grape/commit/2e1a306))
* 提供子应用的需要暴露的生命周期 ([8554369](https://github.com/QxQstar/grape/commit/8554369))
* 沙盒 demo ([1708f24](https://github.com/QxQstar/grape/commit/1708f24))
* 默认不开启沙盒模式 ([99f1b12](https://github.com/QxQstar/grape/commit/99f1b12))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/QxQstar/grape/compare/1.2.0...1.3.0) (2020-02-29)


### Features

* explame ([d485441](https://github.com/QxQstar/grape/commit/d485441))
* start 方法返回promise ([dd762ab](https://github.com/QxQstar/grape/commit/dd762ab))
* 优化错误提示 ([04a6563](https://github.com/QxQstar/grape/commit/04a6563))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/QxQstar/grape/compare/1.1.4...1.2.0) (2020-01-17)


### Features

* app获取失败之后可以重新获取 ([64db23b](https://github.com/QxQstar/grape/commit/64db23b))
* 判断入口函数中是否导出了钩子函数 ([f3fc921](https://github.com/QxQstar/grape/commit/f3fc921))
* 升级[@hydesign](https://github.com/hydesign)/grape ([2d44ca0](https://github.com/QxQstar/grape/commit/2d44ca0))
* 单独注册每一个子项目 ([473c9ce](https://github.com/QxQstar/grape/commit/473c9ce))
* 增加 app 的状态 ([8dc5084](https://github.com/QxQstar/grape/commit/8dc5084))
* 给 grape 对象新增 loadApp 方法 ([c324a99](https://github.com/QxQstar/grape/commit/c324a99))
* 项目加载失败之后触发浏览器自定义事件 ([0cc608e](https://github.com/QxQstar/grape/commit/0cc608e))



<a name="1.1.4"></a>
## [1.1.4](https://github.com/QxQstar/grape/compare/1.1.3...1.1.4) (2019-12-25)


### Bug Fixes

* 确保资源的加载顺序 ([80241e3](https://github.com/QxQstar/grape/commit/80241e3))


### Features

* 修改demo ([ad4ec83](https://github.com/QxQstar/grape/commit/ad4ec83))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/QxQstar/grape/compare/1.1.2...1.1.3) (2019-12-20)


### Features

* 使用babel编译js代码 ([c1b2d77](https://github.com/QxQstar/grape/commit/c1b2d77))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/QxQstar/grape/compare/1.1.1...1.1.2) (2019-12-13)


### Bug Fixes

* 将js脚本的type设置成text/javascript ([c6602bb](https://github.com/QxQstar/grape/commit/c6602bb))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/QxQstar/grape/compare/1.1.0...1.1.1) (2019-12-11)


### Bug Fixes

* 解决在请求头设置Cache-Control导出OPTIONS请求的bug ([561c7e8](https://github.com/QxQstar/grape/commit/561c7e8))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/QxQstar/grape/compare/1.0.0...1.1.0) (2019-12-11)


### Features

* 修改demo ([91ab32b](https://github.com/QxQstar/grape/commit/91ab32b))
* 用fetch获取项目访问入口时，在请求头中设置Cache-Contro: max-age=0 ([845465a](https://github.com/QxQstar/grape/commit/845465a))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/QxQstar/grape/compare/0.0.5...1.0.0) (2019-12-06)


### Bug Fixes

* 解决当子项目的访问入口中有多个js脚本，子项目加载失败的bug ([7a906b8](https://github.com/QxQstar/grape/commit/7a906b8))


### Features

* 从子项目的访问入口中获取内嵌脚本和内嵌样式，并且将其插入到主项目的文档中 ([4155519](https://github.com/QxQstar/grape/commit/4155519))
* 增加例子 ([d9024ca](https://github.com/QxQstar/grape/commit/d9024ca))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/QxQstar/grape/compare/v0.0.4...0.0.5) (2019-11-25)


### Bug Fixes

* 解决项目配置path为数组时的bug ([2b14086](https://github.com/QxQstar/grape/commit/2b14086))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/QxQstar/grape/compare/0.0.3...v0.0.4) (2019-11-25)



<a name="0.0.3"></a>
## [0.0.3](https://github.com/QxQstar/grape/compare/0.0.1...0.0.3) (2019-11-25)


### Features

* 内部集成systemJs 并且支持importmap ([55e5401](https://github.com/QxQstar/grape/commit/55e5401))



<a name="0.0.1"></a>
## [0.0.1](https://github.com/QxQstar/grape/compare/dd5af5e...0.0.1) (2019-11-23)


### Features

* init project ([dd5af5e](https://github.com/QxQstar/grape/commit/dd5af5e))
* 支持转递路由模式 ([b5b2eb9](https://github.com/QxQstar/grape/commit/b5b2eb9))



