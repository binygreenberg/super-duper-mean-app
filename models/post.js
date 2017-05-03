/**
 * Created by binyamin.greenberg on 4/9/17.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    title: String,
    link: String,
    tags:  [String],
    points: Number,
    video: Boolean,
    official: Boolean

});

module.exports = mongoose.model('Post', PostSchema);

