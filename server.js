/**
 * Created by binyamin.greenberg on 4/1/17.
 */

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
var path = require('path');
mongoose.connect('mongodb://localhost/test'); // connect to our database

var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var Post     = require('./models/post');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cookieParser())

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// on routes that end in /post
// ----------------------------------------------------
router.route('/post')

    .post(function(req, res) {

        var post = new Post();      // create a new instance of the Post model
        post.link = req.body.link;
        post.tags =req.body.tags;
        post.points = 0;
        post.video = req.body.video;

        setTimeout(function() {
            post.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: post});
            });
        }, 1000)

        // request(post.link, function(error, response, html){
        //     if(!error){
        //         var $ = cheerio.load(html);
        //         post.title = $('title').text();
        //     } else{
        //         post.title = 'title to be defined'
        //     }
        //     post.save(function(err) {
        //         if (err)
        //             res.send(err);
        //         res.json({ message: post });
        //     });
        // })

        // save the post and check for errors
        // post.save(function(err) {
        //     if (err)
        //         res.send(err);
        //
        //     res.json({ message: 'A Post was created!' });
        // });

    })

    .get(function(req, res) {
        if (req.query.tags != undefined) {
            var tagsArr = req.query.tags.split(" ");
            Post.find({"tags": {$all: tagsArr}}, function (err, posts) {
                if (err)
                    res.send(err);
                res.json(posts);
            });
        } else {
            Post.find(function (err, posts) {
                if (err)
                    res.send(err);
                res.json(posts);
            });
        }
    });
router.route('/post/:id')

    .put(function(req,res){
        Post.findByIdAndUpdate(req.params.id, {$inc: { points: 1 }},function(err,post) {
            if (err)
                res.send(err);
            // cookies dealt with on client side
            // var listOfPosts = req.cookies.voted || [];
            // listOfPosts.push(post._id.toString());
            // res.cookie('voted',listOfPosts);
            res.json({points:post.points});
        });
    });

router.route('/title/:link')
    .get(function (req,res) {
        var url = decodeURIComponent(req.params.link);
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var title = $('title').text();
                res.json(title);
            }
        })
    });


// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);