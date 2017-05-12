function tagsService(){
    var subjectAndTags =  [{
            subject:"Frontend Frameworks",
            tags:["Angular","React","Vue.js","Ember JS","Preact","Inferno"]
        },
        {
            subject:"Backend Framworks",
            tags:["Node.js","Ruby on Rails","Django","Flask","Play","Laravel"]
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