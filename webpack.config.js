/**
 * Created by binyamin.greenberg on 7/11/17.
 */

module.exports = function(env) {
    //noinspection JSAnnotator
    return require(`./webpack.${env}.js`)
}
