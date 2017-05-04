function explore(tagsService) {
    return {
        restrict: 'E',
        controllerAs: 'myVm',
        templateUrl:'templates/explore.tmpl.html',
        scope: {
        },
        bindToController: {
            selectedTags :'=selectedTags'
        },
        controller: function () {
            self = this;
            self.subjectAndTags = tagsService.getSubjectAndTags();

            self.closeMenu = function () { $mdMenu.close();}
            self.addToInput = function(tag){
                self.selectedTags.push(tag);
            }
        }
    }
}

angular.module('app').directive('explore',explore);