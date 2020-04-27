const path = require("path");
module.exports = {
    entry:{
        index:path.resolve(__dirname,'../src/index.js'),
    },
    mode:"production",
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'index.js',
        libraryTarget: 'umd',
        library: 'GRAPE',
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/(node_modules)/,//排除掉node_module目录
                include: [
                    path.resolve(__dirname, '../src')
                ],
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }
};
