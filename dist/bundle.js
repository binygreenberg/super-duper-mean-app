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

function appCtr ($http,$cookies) {
    var self = this;
    self.facebookShare = function () {
        console.log('heeelo');
        FB.ui({
            method: 'share',
            display: 'popup',
            href: 'http://178.62.19.62:3000/',
        }, function(response){});
    };
    self.openCard = true;
    self.selectedTags = [];
    self.votedPosts = $cookies.getObject('voted') || [];
    self.posts = [];
    self.isLoading = false;

    self.searchForTut = function (){
        self.isLoading = true;
        var url = "/api/post";
        if (self.selectedTags.length > 0) {
            var queryString = '?tags=';
            self.selectedTags.forEach(function (tag, index) {
                queryString += index ? '+' + tag : tag;
            });
            url += queryString.toLowerCase();
        }

        $http.get(url).then(function (response) {
                self.posts = response.data.sort(function(a,b){
                    return b.points - a.points;
                });
                self.isLoading = false;
            },
            function (e) {
                console.log(e);
            });
    }

}

angular.module('app').controller('appCtr',appCtr);


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
angular.module('app').directive('addPost',addPost);

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
                    self.tags = response.data.map(function (tag) {
                        return tag.charAt(0).toUpperCase() + tag.slice(1);
                    }).sort();
                }
            );

            self.newTag = function (tag) {
                self.selectedTags.push(tag);
                self.searchText = "";
            }


        }
    }
}
angular.module('app').directive('chipsInput',chipsInput);

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

angular.module('app').directive('explore',explore);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by binyamin.greenberg on 5/5/17.
 */
function postList($cookies,$http) {
    return {
        restrict: 'E',
        controllerAs: 'myVm',
        templateUrl:'templates/posts_list.tmpl.html',
        scope: {
        },
        bindToController: {
            posts :'=',
            votedPosts:'='
        },
        controller: function () {
            var self = this;

            self.firstLetterToUpper = function (chip) {
                return chip.charAt(0).toUpperCase() + chip.slice(1);;
            }

            self.upvote = function (postId) {
                self.votedPosts.push(postId)
                $cookies.putObject('voted', self.votedPosts);

                $http.put("/api/post/"+postId).then(function (response) {
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
            };

            self.alreadyVoted = function(itemId){
                return self.votedPosts.indexOf(itemId) !== -1;
            }

        }
    }
}

angular.module('app').directive('postList',postList);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function tagsService($http){

    var subjectAndTags =  [{
            subject:"Frontend Frameworks",
            tags:["Angular","React","Vue.js","Ember JS"]
        },
        {
            subject:"Frontend Tools",
            tags:["Webpack","Gulp","Browserify","Grunt"]
        },
        {
            subject:"Backend Frameworks",
            tags:["Ruby on Rails","Django","Flask","Express,js","Meteor","Play","Laravel"]
        },
        {
            subject:"Cloud",
            tags:["AWS (Amazon Web Services)","Herouku","Digital Ocean","Azure"]
        },
        {
            subject:"Languages",
            tags:["Python","Java","JavaScript","TypeScript","Ruby","PHP"]
        },
        {
            subject:"Databases",
            tags:["Redis","MongoDB","PostgreSQL","My SQL"]
        },
        {
            subject:"Testing",
            tags:["Redis","MongoDB","PostgreSQL","My SQL"]
        },
        ];
    var self = this;

    self.getSubjectAndTags = function(){
        return subjectAndTags;
    }

    self.getTags = function() {
            return $http.get('/api/tags',{ cache: true });
    }
}
angular.module('app').service('tagsService',tagsService);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app', ['ngMaterial', 'ngCookies']);
__webpack_require__(0);
__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);


/***/ })
/******/ ]);