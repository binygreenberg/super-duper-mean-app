function chipsInput(tagsService) {
    return {
        restrict: 'E',
        templateUrl:'templates/chips.tmpl.html',
        controllerAs: 'vm',
        scope: {
        },
        bindToController: {
            selectedTags :'=selectedTags'
        },
        controller:function () {
            /**
             * Create filter function for a query string
             */
            var createFilterFor = function (query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(tag) {
                    return (tag.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }

            var self = this;
            self.querySearch = function (query,arr) {
                return query ? arr.filter( createFilterFor(query) ) : arr;
            }

            self.transformChip = function(chip) {
                // If it is an object, it's already a known chip
                if (angular.isObject(chip)) {
                    return chip;
                }
            }
            self.tags = tagsService.getTags();
        }
    }
}
angular.module('app').directive('chipsInput',chipsInput);