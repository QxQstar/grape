const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
module.exports = {
    devServer:{
        port:8050,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Cache-Control"
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
            .library('APP2')
            .jsonpFunction('webpackJsonp_APP2')
        // config.externals([{'vue-router':'vueRouter'}])

    },
}
