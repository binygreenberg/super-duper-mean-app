function appCtr ($http,$cookies) {
    var self = this;

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

    self.alreadyVoted = function(itemId){
        return self.votedPosts.indexOf(itemId) !== -1;
    }

    self.upperCaseFirst = function(arr){
        return arr.forEach(function (element) {
            element = element.charAt(0).toUpperCase() + element.slice(1);
        })
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
}

angular.module('app').controller('appCtr',appCtr);
