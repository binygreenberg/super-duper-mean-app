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