function chipsInput($timeout,tagsService) {
    return {
        restrict: 'E',
        templateUrl:'templates/chips.tmpl.html',
        controllerAs: 'vm',
        scope: {
            selectedTags :'=',
            notFoundStrategy:'='
        },
        bindToController: true,
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
            var unFocus = function(){ document.getElementsByTagName('md-autocomplete-wrap')[0].children[0].blur(); };

            var self = this;
            self.querySearch = function (query,arr) {
                $timeout(function(){
                    var mask = document.getElementsByClassName('md-scroll-mask')[0];
                    if(mask)
                        mask.addEventListener('click', unFocus, true); },250);
                return query ? arr.filter( createFilterFor(query) ) : arr;
            }
            self.transformChip = function(chip) {
                // If it is an object, it's already a known chip
                if (angular.isObject(chip)) {
                    return chip;
                }
            }
            tagsService.getTags().then(
                function (response) {
                    self.tags = response;
                }
            );

            self.newTag = function (tag) {
                self.selectedTags.push(tag);
                self.searchText = "";
            }


        }
    }
}
angular.module('app').directive('chipsInput',['$timeout','tagsService',chipsInput]);