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
