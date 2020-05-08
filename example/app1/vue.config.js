const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const cdn = {
    css: [
        // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css',  自定义改过样式，不能使用cdn

    ],
    js: [
        'https://unpkg.com/@hydesign/grape@2.2.0/dist/index.js',
    ]
}
module.exports = {
    devServer:{
        port:9020,
        headers: {
            "Access-Control-Allow-Headers":"Cache-Control",
            "Access-Control-Allow-Origin": "*",
        },
    },
    publicPath:process.env.VUE_APP_publicPath,
    chainWebpack: config => {
        config.plugin('script-ext-html')
            .use(ScriptExtHtmlWebpackPlugin,[{
                custom: {
                    test: /app.*\.js$/,
                    attribute: 'entry',
                    value: true
                }
            }]);
        config.output
            .libraryTarget('umd')
            .library('APP1')
            .jsonpFunction('webpackJsonp_APP1')
        config.externals([{'@hydesign/grape':'GRAPE'}])

        config.optimization.minimize(true);
        config.plugin('html')
          .tap(args => {
              args[0].cdn = cdn;
              return args;
          });
        // config.externals([{'vue-router':'vueRouter'}])
    },
}
