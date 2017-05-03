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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function appCtr ($http,$mdDialog,$cookies) {
    var vm = this;

    vm.selectedTags=[];
    vm.votedPosts = $cookies.getObject('voted') || [];
    vm.posts = [];
    vm.isLoading = false;

    vm.searchForTut = function (){
        vm.isLoading = true;
        var url = "http://localhost:3000/api/post";
        if (vm.selectedTags.length > 0) {
            var queryString = '?tags=';
            vm.selectedTags.forEach(function (tag, index) {
                queryString += index ? '+' + tag : tag;
            });
            url += queryString.toLowerCase();
        }

        $http.get(url).then(function (response) {
                vm.posts = response.data.sort(function(a,b){
                    return b.points - a.points;
                });
                vm.isLoading = false;
            },
            function (e) {
                console.log(e);
            });
    }

    vm.alreadyVoted = function(itemId){
        return vm.votedPosts.indexOf(itemId) !== -1;
    }

    vm.upperCaseFirst = function(arr){
        return arr.forEach(function (element) {
            element = element.charAt(0).toUpperCase() + element.slice(1);
        })
    }

    vm.upvote = function (postId) {
        vm.votedPosts.push(postId)
        $cookies.putObject('voted', vm.votedPosts);

        $http.put("http://localhost:3000/api/post/"+postId).then(function (response) {
                vm.posts.some(function(currentValue){
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
                    $http.post("http://localhost:3000/api/post",self.post).then(function (response) {
                            self.closeDialog();
                        },
                        function (e) {
                            console.log(e);
                        });
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
        },
        bindToController: {
            selectedTags :'=selectedTags'
        },
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
            self.tags = tagsService.getTags();
        }
    }
}
angular.module('app').directive('chipsInput',chipsInput);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function explore(tagsService) {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        templateUrl:'templates/explore.tmpl.html',
        controller: function () {
            self = this;
            self.subjectAndTags = tagsService.getSubjectAndTags();

            self.closeMenu = function () { $mdMenu.close();}
        }
    }
}

angular.module('app').directive('explore',explore);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function tagsService(){
    var subjectAndTags =  [{
            subject:"Front End",
            tags:["Angular","React"]
        },
        {
            subject:"Backend",
            tags:["Django","Play"]
        },
        {
            subject:"Cloud",
            tags:["AWS","Herouku"]
        }];
    var self = this;

    self.getSubjectAndTags = function(){
        return subjectAndTags;
    }

    self.getTags = function(){
        var arrOfTags = [];

        subjectAndTags.forEach(function(element){
            arrOfTags = arrOfTags.concat(element.tags);
        });
        return arrOfTags.sort();
    }
}
angular.module('app').service('tagsService',tagsService);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app', ['ngMaterial', 'ngCookies']);
__webpack_require__(0);
__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);


/***/ })
/******/ ]);