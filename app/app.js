var app = angular.module('aklesia',['ngRoute']);

app.config(($routeProvider)=>{
    $routeProvider.when("/",{
        templateUrl:"app/views/index.html"
    }).when("/home",{
        templateUrl:"app/views/index.html"
    }).when("/pages",{
        templateUrl: "app/views/pages.html",
        controller: "app/controllers/pages"
    }).when("/contents",{
        templateUrl: "app/views/contents.html",
        controller: "app/controllers/contents"
    }).when("/notifications",{
        templateUrl: "app/views/notifications.html",
        controller: "app/controllers/contents"
    })
})


app.controller('itemController',($scope)=>{
    $scope.first=1;
    $scope.second=1;

    $scope.person.name="New Name";
})