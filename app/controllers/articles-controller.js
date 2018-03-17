
var mainApp = angular.module('aklesia');

mainApp.controller('articlesController',function ($scope,$http,networkService,$routeParams){
    $scope.model=[];
    $scope.model.allArticles=[];
    var url="api/";
    var fieldsToGet="?fields=title,type,_id,thumbnailPath,shortDescription,filePath,fileName";
    switch($routeParams.filterType){
        case "page":{
            url=url+"articlesPerPage/"+$routeParams.id+fieldsToGet;
            break;
        }
        case "articleType":{
            url=url+"articlesPerType/"+$routeParams.id+fieldsToGet;
            break;
        }
    }
    networkService.getFromServer(url)
        .then((articlesToView)=>{
            $scope.model.articlesToView=articlesToView;
        },(error)=>{
            console.error("Error retrieving articles");
        });

    $scope.playOrPause=(ele)=>{
        var video=angular.element(ele.srcElement);
        video[0].play();
    }
});