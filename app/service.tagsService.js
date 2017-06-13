function tagsService($http){

    var subjectAndTags =  [{
            subject:"Frontend Frameworks",
            tags:["Angular","React","Vue.js","Ember JS"]
        },
        {
            subject:"Frontend Tools",
            tags:["Webpack","Gulp","Browserify","Grunt"]
        },
        {
            subject:"Backend Frameworks",
            tags:["Ruby on Rails","Django","Flask","Express,js","Meteor","Play","Laravel"]
        },
        {
            subject:"Cloud",
            tags:["AWS (Amazon Web Services)","Herouku","Digital Ocean","Azure"]
        },
        {
            subject:"Languages",
            tags:["Python","Java","JavaScript","TypeScript","Ruby","PHP"]
        },
        {
            subject:"Databases",
            tags:["Redis","MongoDB","PostgreSQL","My SQL"]
        },
        {
            subject:"Testing",
            tags:["Redis","MongoDB","PostgreSQL","My SQL"]
        },
        ];
    var self = this;

    self.getSubjectAndTags = function(){
        return subjectAndTags;
    }

    self.getTags = function() {
            return $http.get('/api/tags',{ cache: true });
    }
}
angular.module('app').service('tagsService',tagsService);