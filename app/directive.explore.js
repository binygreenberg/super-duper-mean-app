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