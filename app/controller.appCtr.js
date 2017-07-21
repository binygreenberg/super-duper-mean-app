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
            return;
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
