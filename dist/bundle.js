/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function appCtr($http, $cookies, $mdDialog,$location) {
    var self = this;
    self.facebookShare = function () {
        console.log('heeelo');
        FB.ui({
            method: 'share',
            display: 'popup',
            href: 'http://178.62.19.62:3000/',
        }, function (response) {
        });
    };
    self.openCard = true;
    self.selectedTags = [];
    self.posts = [];
    self.isLoading = false;

    var showDialog = function () {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('No tutorial matching all the tags was found')
                .textContent('Either limit the search or feel free to add one')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
        );
    }

    var getPosts = function (arrOfTags) {
        var config = {'params': {'tags': arrOfTags}};
        var url = '/api/post'
        $http.get(url, config).then(function (response) {
                self.isLoading = false;

                if (response.data) {
                    self.posts = response.data.sort(function (a, b) {
                        return b.points - a.points;
                    });
                }
                if (response.data.length === 0) {
                    showDialog();
                }
            },
            function (e) {
                console.log(e);
            });

    }

    self.searchForTut = function () {
        if (self.selectedTags.length === 0){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .textContent('Enter one or more tags')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
            );
        }
        self.isLoading = true;
        var lowerCaseTags = self.selectedTags.map(function (tag) {
            return tag.toLowerCase();
        });
        $location.search({'tags': lowerCaseTags});
        getPosts(lowerCaseTags );
    }

    //if browser bar contains url with tags get them.
    var tagsInBrowser = $location.search()['tags'];
    if ($location.search() != undefined && tagsInBrowser) {
        getPosts(tagsInBrowser);
    }

}

angular.module('app').controller('appCtr', ['$http','$cookies','$mdDialog','$location',appCtr]);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

function addPost($mdDialog,$http) {
    return {
        restrict: 'E',
        template: '<md-button class="md-raised" ng-click="vm.showAdvanced()">Add</md-button>',
        controllerAs: 'vm',
        scope: {},
        bindToController: true,
        controller: function () {
            var dialogCtr = function () {
                var self = this;
                self.post = {
                    title : '',
                    link : '',
                    video : false,
                    official : false,
                    tags : []
                }
                self.selectedTags = [];
                self.submit = function(){
                    self.post.tags = self.selectedTags.join('|').toLowerCase().split('|');
                    $http.post("/api/post",self.post).then(function (response) {
                        },
                        function (e) {
                            console.log(e);
                        });
                    self.closeDialog();
                }

                self.closeDialog = function() {
                    $mdDialog.hide();
                }
            }
            self = this;
            self.showAdvanced = function () {
                $mdDialog.show({
                    templateUrl: 'templates/dialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    controller: dialogCtr,
                    controllerAs: 'dialog',
                    bindToController: true,
                });
            }
            }
        }
    }
angular.module('app').directive('addPost',['$mdDialog','$http',addPost]);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function chipsInput(tagsService) {
    return {
        restrict: 'E',
        templateUrl:'templates/chips.tmpl.html',
        controllerAs: 'vm',
        scope: {
            selectedTags :'=',
            notFoundStrategy:'='
        },
        bindToController: true,
        controller:function () {
            /**
             * Create filter function for a query string
             */
            var createFilterFor = function (query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(tag) {
                    return (tag.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }

            var self = this;
            self.querySearch = function (query,arr) {
                return query ? arr.filter( createFilterFor(query) ) : arr;
            }
            self.transformChip = function(chip) {
                // If it is an object, it's already a known chip
                if (angular.isObject(chip)) {
                    return chip;
                }
            }
            tagsService.getTags().then(
                function (response) {
                    self.tags = response;
                }
            );

            self.newTag = function (tag) {
                self.selectedTags.push(tag);
                self.searchText = "";
            }


        }
    }
}
angular.module('app').directive('chipsInput',['tagsService',chipsInput]);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function explore(tagsService,$mdDialog) {
    return {
        restrict: 'E',
        controllerAs: 'myVm',
        templateUrl:'templates/explore.tmpl.html',
        scope: {
        },
        bindToController: {
            selectedTags :'='
        },
        controller: function () {
            var self = this;
            self.subjectAndTags = tagsService.getSubjectAndTags();

            self.closeMenu = function () { $mdMenu.close();}
            self.addToInput = function(tag){
                self.selectedTags.push(tag);
            }
            self.openRoadMap = function () {
                $mdDialog.show({
                    templateUrl: 'templates/roadmap.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    controller: function () {
                        var urls = {'backEndUrl' : 'https://camo.githubusercontent.com/a69353cebac96bd2e82b45771d6edd32715ca0c3/68747470733a2f2f692e696d6775722e636f6d2f6d3956385a69562e706e67',
                            'frontEndUrl' : 'https://camo.githubusercontent.com/93280354d6367052b6dbb71bbcd76c2ea81294c8/68747470733a2f2f692e696d6775722e636f6d2f3576465457634f2e706e67',
                            'devOpsUrl' : 'https://camo.githubusercontent.com/3e4577550f330f8b507d7aff61d09c0fadd7d93f/687474703a2f2f692e696d6775722e636f6d2f694e4e495a7a542e706e67'}

                        var self = this;

                        self.currentUrl = urls['frontEndUrl'];

                        self.setCurrentUrl = function (url) {
                            self.currentUrl = urls[url];
                        }

                        self.close = function () {
                            $mdDialog.cancel();
                        }
                    },
                    controllerAs: 'dialog',
                    bindToController: true,
                });
            }
        }
    }
}

angular.module('app').directive('explore',['tagsService','$mdDialog',explore]);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by binyamin.greenberg on 5/5/17.
 */
function postList($cookies,$http,tagsService) {
    return {
        restrict: 'E',
        controllerAs: 'myVm',
        templateUrl:'templates/posts_list.tmpl.html',
        scope: {
        },
        bindToController: {
            posts :'=',
            selectedTags:'='
        },
        controller: function () {
            var votedPosts = $cookies.getObject('voted') || [];

            var vote = function (postId,inc) {
                votedPosts.push(postId)
                //there is no push() for cookie must replace all array
                // $cookies.putObject('voted', votedPosts,{'domain':'localhost'});

                $http.put("/api/post/"+postId,{"inc":inc}).then(function (response) {
                        self.posts.some(function(currentValue){
                            if (currentValue._id == postId){
                                currentValue.points = response.data.points;
                                return true;
                            }
                            return false;
                        });
                    },
                    function (e) {
                        console.log(e);
                    });
            }

            var self = this;

            self.firstLetterToUpper = function (chip) {
                return tagsService.specialCaseConversion(chip);
            }

            self.upvote = function (postId) {
                vote(postId,"up")
            };
            self.downvote = function (postId) {
                vote(postId,"down")
            };

            self.alreadyVoted = function(itemId){
                return false;
                //return votedPosts.indexOf(itemId) !== -1;
            }

            self.tagEqual = function (item) {
                //show all posts
                if (self.showExactTags) {
                    var lowercaseSelectedTags = self.selectedTags.map(function (tag) {
                        return tag.toLowerCase();
                    }).sort();
                    if (item.tags.sort().toString() == lowercaseSelectedTags.toString()) {
                        return true;
                    }
                    return false;
                }
                if (self.showOnlyVideo){
                    return item.video;
                }
                return true;
            }
        }
    }
}

angular.module('app').directive('postList',['$cookies','$http','tagsService',postList]);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function tagsService($http){

    var subjectAndTags =  [{
            subject:"Frontend Frameworks",
            tags:["AngularJS","Angular2","React","Vue.js","Ember"]
        },
        {
            subject:"Frontend Tools",
            tags:["Webpack","Gulp","Browserify","Grunt"]
        },
        {
            subject:"Backend Frameworks",
            tags:["Node.js","Ruby on Rails","Django","Flask","Express","Meteor","Play","Laravel"]
        },
        {
            subject:"Cloud",
            tags:["AWS","Heroku","DigitalOcean","Azure","Google Cloud"]
        },
        {
            subject:"Languages",
            tags:["Python","Java","JavaScript","TypeScript","Ruby","PHP","CSS","Go"]
        },
        {
            subject:"Databases",
            tags:["Redis","MongoDB","PostgreSQL","My SQL"]
        },
        {
            subject:"Testing",
            tags:["Jest","Mocha","Jasmine","Karma"]
        },
        {
            subject:"Web Servers",
            tags:["NGINX","Tomcat","Apache"]
        },
    ];
    var specialCaseTags = ["TypeScript","AngularJS","PostgreSQL","CSS","Ruby on Rails","MongoDB","DigitalOcean","My SQL","AWS","PHP","Google Cloud"];
    var specialCaseTagsLowercase = specialCaseTags.toString().toLowerCase().split(',');

    var self = this;

    self.specialCaseConversion = function(tag){
        var index = specialCaseTagsLowercase.indexOf(tag);
        if ( index == -1) {
            return tag.charAt(0).toUpperCase() + tag.slice(1);
        } else {
            return specialCaseTags[index];
        }
    }

    self.getSubjectAndTags = function(){
        return subjectAndTags;
    }

    //returns a promise
    self.getTags = function() {
            return $http.get('/api/tags',{ cache: true }).then(function (response) {
                return response.data.map(self.specialCaseConversion).sort();
            });
    }
}
angular.module('app').service('tagsService',['$http',tagsService]);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var app = angular.module('app', ['ngMaterial', 'ngCookies']);
app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});
__webpack_require__(0);
__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);


/***/ })
/******/ ]);