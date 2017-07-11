/**
 * Created by binyamin.greenberg on 7/11/17.
 */

module.exports = function(env) {
    //noinspection JSAnnotator
    return require(`./webpack.${env}.js`)
}
// /**
//  * Created by binyamin.greenberg on 7/11/17.
//  */
// var path = require('path');
// var webpack = require("webpack");
//
//
// module.exports = {
//
//     entry:{
//         app:'./app/app.module.js',
//     },
//
//     output:{
//         filename:'bundle.js',
//         path:path.resolve(__dirname,'dist')
//     },
//     plugins:[
//         // new webpack.optimize.UglifyJsPlugin({
//         //     compress: {
//         //         warnings: false
//         //     }
//         // })
//     ],
//     watch: true
// }
