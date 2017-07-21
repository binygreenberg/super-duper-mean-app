/**
 * Created by binyamin.greenberg on 7/11/17.
 */
var path = require('path');
var webpack = require("webpack");


module.exports = {

    entry:{
        app:'./app/app.module.js',
    },

    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
    ],
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        proxy: {
            "/api": "http://localhost:3000"
        }
    },
}
