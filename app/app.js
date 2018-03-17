'use strict';

var app = angular.module('aklesia',['ngRoute']);

app.config(($routeProvider)=>{
    $routeProvider.when("/",{
        templateUrl:"app/views/index.html"
    }).when("/home",{
        templateUrl:"app/views/index.html"
    }).when("/admin",{
        templateUrl: "app/views/admin.html",
        controller: "adminController"
    }).when("/contents",{
        templateUrl: "app/views/contents.html",
        controller: "contentsController"
    }).when("/articles/:filterType/:id",{
        templateUrl:"app/views/articles.html",
        controller:"articlesController"
    }).when("/notifications",{
        templateUrl: "app/views/notifications.html",
        controller: "notificationsController"
    })
})
 


app.controller('itemController',($scope)=>{
    $scope.first=1;
    $scope.second=1;

    $scope.person.name="New Name";
})
