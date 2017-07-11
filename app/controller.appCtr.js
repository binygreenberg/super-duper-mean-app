function appCtr($http, $cookies, $mdDialog) {
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
                .title('This is an alert title')
                .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
        );
    }

    self.searchForTut = function () {
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

}

angular.module('app').controller('appCtr', ['$http', '$cookies', '$mdDialog',appCtr]);
