
var mainApp = angular.module('aklesia');

mainApp.controller('articlesController',function ($scope,$http,networkService,$routeParams,$location){
    $scope.model=[];
    $scope.model.allArticles=[];
    $scope.model.currentPage=0;
    $scope.model.pageSize=4;
    $scope.model.totalNumberOfPages=1;
    if($location.search().pageNumber){
        $scope.model.currentPage=parseInt($location.search().pageNumber);
    }

    var url="api/";
    var urlCount="api/";
    var fieldsToGet="?fields=title,type,_id,thumbnailPath,shortDescription,filePath,fileName";
    var queryParams="&pageNumber="+$scope.model.currentPage+"&pageSize="+$scope.model.pageSize;
    
    switch($routeParams.filterType){
        case "page":{
            url=url+"articlesPerPage/"+$routeParams.id+fieldsToGet+queryParams;
            urlCount=urlCount+"articlesPerPageCount/"+$routeParams.id;
            break;
        }
        case "articleType":{
            url=url+"articlesPerType/"+$routeParams.id+fieldsToGet+queryParams;
            urlCount=urlCount+"articlesPerTypeCount/"+$routeParams.id;
            break;
        }default :{//this is for home page. so just load all articles sorted on their time.
            url=url+"articles"+fieldsToGet+queryParams;
            urlCount=urlCount+"articlesCount/";
            break;
        }
    };
    networkService.getFromServer(url)
        .then((articlesToView)=>{
            $scope.model.articlesToView=articlesToView;
        },(error)=>{
            console.error("Error retrieving articles");
    });

    networkService.getFromServer(urlCount)
        .then((totalNumberOfArticles)=>{
            $scope.model.totalNumberOfArticles=totalNumberOfArticles;
            $scope.model.totalNumberOfPages=Math.ceil($scope.model.totalNumberOfArticles/$scope.model.pageSize);
    });

    $scope.changePage=(pageNumber)=>{
        var url="articles/"+$routeParams.filterType+"/"+$routeParams.id;
        $location.path(url).search({pageNumber:+pageNumber});
    }
});