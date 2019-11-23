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
        libraryExport: 'default',
        library: 'GRAPE',
    }
};
