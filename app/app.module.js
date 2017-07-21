var app = angular.module('app', ['ngMaterial', 'ngCookies']);
app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});
require('./controller.appCtr.js');
require('./directive.chipsInput.js');
require('./directive.addPost');
require('./directive.explore');
require('./directive.postList');
require('./service.tagsService');
