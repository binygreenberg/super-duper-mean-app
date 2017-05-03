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
