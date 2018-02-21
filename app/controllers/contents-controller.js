/*
 * --------------------------------------TODO--------------------
 * for the function action and then when the action is edit existing, we should display the list of all users. if it is edit existing or display empty fields if new user is done.
 * 
 */

var mainApp = angular.module('aklesia');

mainApp.controller('contentsController',function ($scope){
    $scope.model=[];
    $scope.model.allCatagories=["Page","Article","User"];
    $scope.model.allArticleTypes=["Text","Picture","Video","Audio"];
    $scope.model.allPages=["page1","page2","page3","page4"];
    $scope.model.allUsers=[
        {"firstName":"Abebe","userType":"Admin","email":"abc@yahoo.com"},
        {"firstName":"Kebede","userType":"normal","email":"kebede_chala2@yahoo.com"},
        {"firstName":"Melaeke","userType":"Admin","email":"sdfs@yahoo.com"},
        {"firstName":"Chala","userType":"pageAdmin","email":"sddfadf@yahoo.com"}
    ];
    $scope.model.allUserTypes=["normal","pageAdmin","Admin"];

    $scope.action=(actionType)=>{
        $scope.model.selectedAction=true;

        if(actionType === 'createNew'){
            if($scope.model.selectedCatagory === 'User'){
                $scope.model.selectedUser=true;
            }
        }else if(actionType === 'editExisting'){
            if($scope.model.selectedCatagory === 'User'){
                $scope.model.selectedUser=false;
            }
        }

    }

    $scope.selectUser=(user)=>{
        $scope.model.user=user;
        $scope.model.selectedUser=true;
        console.log(user);
    }

    $scope.$watch('model.action',function(){
        console.log("action",$scope.model.action);
    });


    $scope.$watch('model.selectedCatagory',function(){
        //when changing catagory, reinitialize everything.
        $scope.model.action="";
        $scope.model.selectedAction=false;

        console.log("Selected Catagory",$scope.model.selectedCatagory);
    });
})