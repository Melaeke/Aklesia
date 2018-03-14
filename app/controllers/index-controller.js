
var mainApp = angular.module('aklesia');

mainApp.controller('indexController',function ($scope,$http,networkService,$routeParams){
    
    initializeHeader($scope,networkService)
    console.log($routeParams);
});

var initializeHeader=($scope,networkService)=>{
    $scope.model=[];
    $scope.model.allPages=[];
    networkService.getFromServer("api/pages?fields=_id,name")
        .then((allPages)=>{
            //this is a success
            $scope.model.allPages=allPages;
        },(error)=>{
            //this is an error
            console.error("The request returned with an error",error);
    });

    networkService.getFromServer("api/articleTypes?fields=_id,name")
        .then((allArticleTypes)=>{
            //this is a success
            $scope.model.allArticleTypes=allArticleTypes;
        },(error)=>{
            //this is an error
            console.error("The request returned with an error",error);
    });
}