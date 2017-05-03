function tagsService(){
    var subjectAndTags =  [{
            subject:"Front End",
            tags:["Angular","React"]
        },
        {
            subject:"Backend",
            tags:["Django","Play"]
        },
        {
            subject:"Cloud",
            tags:["AWS","Herouku"]
        }];
    var self = this;

    self.getSubjectAndTags = function(){
        return subjectAndTags;
    }

    self.getTags = function(){
        var arrOfTags = [];

        subjectAndTags.forEach(function(element){
            arrOfTags = arrOfTags.concat(element.tags);
        });
        return arrOfTags.sort();
    }
}
angular.module('app').service('tagsService',tagsService);