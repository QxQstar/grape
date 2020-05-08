const cdn = {
    css: [
        // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css',  自定义改过样式，不能使用cdn

    ],
    js: [
        'https://unpkg.com/@hydesign/grape@2.2.0/dist/index.js',
    ]
}

module.exports = {
    chainWebpack: config => {

        config.output
            .libraryTarget('umd')
            .library('')
            .jsonpFunction('webpackJsonp_index')
        config.plugin('html')
          .tap(args => {
              args[0].cdn = cdn;
              return args;
          });
        config.externals([{'@hydesign/grape':'GRAPE'}])
    },
}
