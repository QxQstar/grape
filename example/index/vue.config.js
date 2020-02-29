module.exports = {
    chainWebpack: config => {
        config.output
            .libraryTarget('umd')
            .library('')
            .jsonpFunction('webpackJsonp_index')

    },
}
