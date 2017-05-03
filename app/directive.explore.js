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