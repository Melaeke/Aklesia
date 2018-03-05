'user strict';
var mainApp = angular.module('aklesia');

mainApp.directive('fileDirectiveModel',['$parse',($parse)=>{
    return{
        restrict: 'A',
        link: function(scope,element,attrs){
            var model = $parse(attrs.fileDirectiveModel);
            var modelSetter = model.assign;

            element.bind('change',function(){
                scope.$apply(function(){
                    modelSetter(scope,element[0].files[0]);
                })
            })
        }
    }
}]);
