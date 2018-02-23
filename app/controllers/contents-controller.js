/*
 * --------------------------------------TODO--------------------
 * for the function action and then when the action is edit existing, we should display the list of all users. if it is edit existing or display empty fields if new user is done.
 * 
 */

var mainApp = angular.module('aklesia');

mainApp.controller('contentsController',function ($scope,$http){
    initialize($scope,$http);

    $scope.action=(actionType)=>{
        $scope.model.actionType=actionType;
        $scope.model.user=[];
        $scope.model.page=[];
        $scope.model.article=[];
        $scope.model.selectedAction=true;

        switch($scope.model.selectedCatagory){
            case "User":{
                fetchElements($scope,$http,"api/userTypes")
                    .then((allUserTypes)=>{
                        $scope.model.allUserTypes=allUserTypes;
                    },(error)=>{
                        console.error(error);
                });
                if(actionType === 'createNew'){
                    $scope.model.selectedUser=true;
                }else{
                    fetchElements($scope,$http,"api/users?fields=_id,firstName,userType,email")
                        .then((allUsers)=>{
                            //this is a success
                            $scope.model.allUsers=allUsers;
                        },(error)=>{
                            //this is an error
                            console.error("The request returned with an error",error);
                    });

                    $scope.model.selectedUser=false;
                }
                break;
            }case "Page":{

            }case "Article":{

            }
        }



        if(actionType === 'createNew'){
             if($scope.model.selectedCatagory==='Page'){
                $scope.model.selectedPage=true;
            }else if($scope.model.selectedCatagory=== 'Article'){
                $scope.model.selectedArticle=true;
            }
        }else if(actionType === 'editExisting'){
            if($scope.model.selectedCatagory==='Page'){
                $scope.model.selectedPage=false;
            }else if($scope.model.selectedCatagory=== 'Article'){
                $scope.model.selectedArticle=false;
            }
        }

    }

    $scope.selectUser=(user)=>{
        $scope.model.user=user;
        fetchElements($scope,$http,"api/users/"+user._id)
            .then((user)=>{
                $scope.model.user=user;
            },(error)=>{
                console.error(error);
        });
        $scope.model.selectedUser=true;
    }

    $scope.selectPage=(page)=>{
        $scope.model.page=page;
        $scope.model.selectedPage=true;
        console.log($scope.model.page);
    }

    $scope.selectArticle=(article)=>{
        $scope.model.article=article;
        $scope.model.selectedArticle=true;
        console.log($scope.model.selectedArticle);
    }

    $scope.$watch('model.action',function(){
        console.log("action",$scope.model.action);
    });


    $scope.$watch('model.selectedCatagory',function(){
        //when changing catagory, reinitialize everything.
        $scope.model.action="";
        $scope.model.selectedAction=false;
        $scope.model.selectedPage=false;

        console.log("Selected Catagory",$scope.model.selectedCatagory);
    });

    $scope.cancel=()=>{
        halfInitialize($scope);
    }

    $scope.delete=(whatToDelete)=>{
        switch(whatToDelete){
            case 'User':{
                var user=$scope.model.user;
                deleteFromServer($scope,$http,"api/users/"+user._id)
                    .then((response)=>{
                        showStatusMessage($scope,"Successfully deleted user");
                        halfInitialize($scope);
                    },(error)=>{
                        console.error("Error deleting user ",error);
                        showErrorMessage($scope,"Error deleting user");
                    })
                break;
            }
        }
    }
    

    $scope.save=(whatToSave)=>{
        switch(whatToSave){
            case 'User':{
                var user=$scope.model.user;
                if(!(user.email && user.firstName && user.lastName) || ($scope.model.actionType==="createNew" && !user.password)){
                    if(!user.email){
                        showErrorMessage($scope,"Please provide a proper Email address ");
                    }else{
                        showErrorMessage($scope,"Please provide all Inputs with a * sign ");
                    }
                    console.log("all necessary inputs not provided. Not saving user");
                    break;
                }
                var objectToSave={
                    "firstName":user.firstName,
                    "email":user.email,
                    "lastName":user.lastName,
                    "password":user.password
                };
                var url="api/users";
                if(user.userType){
                    objectToSave.userType=user.userType;
                }
                if(user._id){
                    objectToSave._id=user._id;
                    url=url+"/"+user._id;
                }
                console.log("url",url);
                sendData($scope,$http,url,objectToSave)
                    .then((response)=>{
                        showStatusMessage($scope,"Successfully saved user.");
                        halfInitialize($scope);
                    },(error)=>{
                        showErrorMessage($scope,"Error saving user.");
                        console.error(error);
                    })
                break;
            }
            case 'Page':{

                break;
            }
        }
    }
})

var initialize=($scope,$http)=>{
    $scope.model=[];
    $scope.model.allCatagories=["Page","Article","User"];
}

var halfInitialize=($scope)=>{
    $scope.model.selectUser=false;
    $scope.action("editExisting");

}

var sendData=($scope,$http,url,dataToSend)=>{
    console.log(dataToSend);
    return $http({
        url:url,
        method: $scope.model.actionType==="createNew"?"POST":"PUT",
        data : dataToSend
    }).then((response)=>{
        console.log("the response is ",response);
        return response;
    }).catch((error)=>{
        throw(error);
    });
}


/**
 * This function performs all the necessary get requests.
 * @param {*}  scope the global scope of angular
 * @param {*}  http the http module of angular 
 * @param {*} url the url to send the link to.
 */
var fetchElements=($scope,$http,url)=>{
    //fetch all users with only fields id, firstName, userType and email.
    return $http.get(url).then((response)=>{
        return response.data;
    }).catch((error)=>{
        console.log("error with request ",error);
        throw(error);
    });
}

var deleteFromServer=($scope,$http,url)=>{
    return $http.delete(url).then((response)=>{
        return response.data;
    }).catch((error)=>{
        console.error("Error with delete request",error);
        throw(error);
    })
}

var showErrorMessage=($scope,message)=>{
    $scope.model.showStatusMessage=false;
    $scope.model.showErrorMessage=true;
    $scope.model.errorMessage=message;
}

var showStatusMessage=($scope,message)=>{
    $scope.model.showStatusMessage=true;
    $scope.model.showErrorMessage=false;
    $scope.model.statusMessage=message;
}

var hideAllMessages=($scope)=>{
    $scope.model.showStatusMessage=false;
    $scope.model.showErrorMessage=false;
}