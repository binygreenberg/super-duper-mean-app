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
                $cookies.putObject('voted', votedPosts);

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
                return votedPosts.indexOf(itemId) !== -1;
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