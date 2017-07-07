function tagsService($http){

    var subjectAndTags =  [{
            subject:"Frontend Frameworks",
            tags:["AngularJS","Angular2","React","Vue.js","Ember"]
        },
        {
            subject:"Frontend Tools",
            tags:["Webpack","Gulp","Browserify","Grunt"]
        },
        {
            subject:"Backend Frameworks",
            tags:["Node.js","Ruby on Rails","Django","Flask","Express","Meteor","Play","Laravel"]
        },
        {
            subject:"Cloud",
            tags:["AWS","Heroku","DigitalOcean","Azure","Google Cloud"]
        },
        {
            subject:"Languages",
            tags:["Python","Java","JavaScript","TypeScript","Ruby","PHP","CSS","Go"]
        },
        {
            subject:"Databases",
            tags:["Redis","MongoDB","PostgreSQL","My SQL"]
        },
        {
            subject:"Testing",
            tags:["Jest","Mocha","Jasmine"]
        },
        {
            subject:"Web Servers",
            tags:["Jest","Mocha","Jasmine"]
        },
        ];
    var specialCaseTags = ["TypeScript","AngularJS","PostgreSQL","CSS","Ruby on Rails","MongoDB","DigitalOcean","My SQL","AWS","PHP","Google Cloud"];
    var specialCaseTagsLowercase = specialCaseTags.toString().toLowerCase().split(',');
    var self = this;

    self.getSubjectAndTags = function(){
        return subjectAndTags;
    }

    //returns a promise
    self.getTags = function() {
            return $http.get('/api/tags',{ cache: true }).then(function (response) {
                return response.data.map(function (tag) {
                    var index = specialCaseTagsLowercase.indexOf(tag);
                    if ( index == -1) {
                        return tag.charAt(0).toUpperCase() + tag.slice(1);
                    } else {
                        return specialCaseTags[index];
                    }
                }).sort();
            });
    }

    self.getSpecialWords = function () {
        return
    }
}
angular.module('app').service('tagsService',tagsService);