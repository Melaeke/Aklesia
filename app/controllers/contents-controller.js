/*
 * --------------------------------------TODO--------------------
 * for the function action and then when the action is edit existing, we should display the list of all users. if it is edit existing or display empty fields if new user is done.
 * 
 */

var mainApp = angular.module('aklesia');

mainApp.controller('contentsController',function ($scope,$http,networkService){
    initialize($scope,$http);

    $scope.action=(actionType)=>{
        $scope.model.actionType=actionType;
        $scope.model.user=[];
        $scope.model.page=[];
        $scope.model.article=[];
        $scope.model.selectedAction=true;

        switch($scope.model.selectedCatagory){
            case "User":{
                if(!$scope.model.allUserTypes){
                    networkService.getFromServer("api/userTypes")
                        .then((allUserTypes)=>{
                            $scope.model.allUserTypes=allUserTypes;
                        },(error)=>{
                            console.error(error);
                    });
                }
                if(actionType === 'createNew'){
                    $scope.model.selectedUser=true;
                }else{
                    //because deletion might occur it is better to get this from server everyime.
                    networkService.getFromServer("api/users?fields=_id,firstName,userType,email")
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
                //if we are creating a new page there is nothing to do here only when editing a field.
                if(actionType==="editExisting"){
                    $scope.model.selectedArticle=false;
                    networkService.getFromServer("api/pages")
                        .then((allPages)=>{
                            $scope.model.allPages=allPages;      
                        },(error)=>{
                            console.error(error);
                            showErrorMessage($scope,"Can not access Server");
                    })
                }else{
                    $scope.model.selectedPage=true;
                }
                break;
            }case "Article":{
                networkService.getFromServer("api/articleTypes")
                    .then((allArticleTypes)=>{
                        $scope.model.allArticleTypes=allArticleTypes;
                    },(error)=>{
                        console.error(error);
                    });
                //if all pages is not loaded, load it now.
                if(!$scope.model.allPages){
                    networkService.getFromServer("api/pages")
                        .then((allPages)=>{
                            $scope.model.allPages=allPages;
                        },(error)=>{
                            console.error(error);
                            showErrorMessage($scope,"Can not access Server");
                        });
                }
                if(actionType==="createNew"){
                    $scope.model.selectedArticle=true;
                }else{
                    $scope.model.selectedArticle=false;
                    //fetch all articles.
                    networkService.getFromServer("api/articles/?fields=title,type,page&pageSize=0")
                    .then((allArticles)=>{
                        $scope.model.allArticles=allArticles;
                    },(error)=>{
                        console.error(error);
                        showErrorMessage($scope,"Can not access server");
                    });
                }
            }
        }
    }

    $scope.selectUser=(user)=>{
        hideAllMessages($scope);
        $scope.model.user=user;
        networkService.getFromServer("api/users/"+user._id)
            .then((user)=>{
                $scope.model.user=user;
            },(error)=>{
                console.error(error);
        });
        $scope.model.selectedUser=true;
    }

    $scope.selectPage=(page)=>{
        hideAllMessages($scope);
        $scope.model.page=page;
        $scope.model.selectedPage=true;

        //only fetch id, title, type for minimizing network activity
        networkService.getFromServer("api/articlesPerPage/"+page._id+"?fields=_id,title,type")
            .then((articlesInPage)=>{
                $scope.model.articlesInPage=articlesInPage;
            },(error)=>{
                console.error(error);
                showErrorMessage($scope,"Can not connect to server")
            })
    }

    $scope.selectArticle=(article)=>{
        hideAllMessages($scope);
        
        networkService.getFromServer("api/articles/"+article._id)
            .then((article)=>{
                $scope.model.article=article;
                $scope.model.selectedArticle=true;
            },(error)=>{
                console.error(error);
                showErrorMessage($scope,"Unable to contact Server");
            })
    }


    $scope.changeCatagory=()=>{
        //when changing catagory, reinitialize everything.
        $scope.model.action="";
        $scope.model.selectedAction=false;
        $scope.model.selectedPage=false;

    };

    $scope.cancel=()=>{
        halfInitialize($scope,false);
    }

    $scope.delete=(whatToDelete)=>{
        switch(whatToDelete){
            case 'User':{
                var user=$scope.model.user;
                deleteFromServer($scope,$http,"api/users/"+user._id)
                    .then((response)=>{
                        showStatusMessage($scope,"Successfully deleted user");
                        halfInitialize($scope,true);
                    },(error)=>{
                        console.error("Error deleting user ",error);
                        showErrorMessage($scope,"Error deleting user");
                    })
                break;
            }case 'Page':{
                var page=$scope.model.page;
                if(page.articles.length>0){
                    showErrorMessage($scope,"Can not delete a page which have articles. Please remove all the articles from the page first.");
                }else{
                    deleteFromServer($scope,$http,"api/pages/"+page._id)
                        .then((response)=>{
                            showStatusMessage($scope,"Successfully deleted Page");
                            halfInitialize($scope,true);
                        },(error)=>{
                            console.error("Error deleteing Page ",error);
                            showErrorMessage($scope,"Error deleting Page");
                    });
                }
                break;
            }case 'Article':{
                var article=$scope.model.article;
                deleteFromServer($scope,$http,"api/articles/"+article._id)
                    .then((response)=>{
                        showStatusMessage($scope,"Successfully deleted Article");
                        halfInitialize($scope,true);
                    },(error)=>{
                        console.error("Error deleting article",error)
                        showErrorMessage($scope,"Error deleting Article");
                    })
                break;
            }
        }
    }
    

    $scope.save=(whatToSave)=>{
        switch(whatToSave){
            case 'User':{
                saveUser($scope,$http,networkService);
                break;
            }
            case 'Page':{
                savePage($scope,$http,networkService)
                break;
            }case 'Article':{
                saveArticle($scope,$http,networkService);
                break;
            }
        }
    }
    $scope.selectArticleInPage=(article)=>{
        $scope.model.selectedCatagory="Article";
        $scope.model.selectedAction="Article";
        $scope.action("editExisting");
        $scope.selectArticle(article);
    }
})

var initialize=($scope,$http)=>{
    $scope.model=[];
    $scope.model.allCatagories=["Page","Article","User"];
}

var halfInitialize=($scope,leaveMessageOn)=>{
    $scope.model.selectUser=false;
    $scope.model.selectedPage=false;
    $scope.model.selectedArticle=false;
    $scope.action("editExisting");
    if(leaveMessageOn===false){
        hideAllMessages($scope);
    }

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

var saveUser=($scope,$http,networkService)=>{
    var user=$scope.model.user;
    if(!(user.email && user.firstName && user.lastName) || ($scope.model.actionType==="createNew" && !user.password)){
        if(!user.email){
            showErrorMessage($scope,"Please provide a proper Email address ");
        }else{
            showErrorMessage($scope,"Please provide all Inputs with a * sign ");
        }
        console.log("all necessary inputs not provided. Not saving user");
        return;
    }
    var userObject={
        "firstName":user.firstName,
        "email":user.email,
        "lastName":user.lastName
    }

    var url="api/users";
    if(user.userType){
        userObject.userType=user.userType;
    }
    if(user._id){
        userObject._id=user._id;
        url=url+"/"+user._id;
    }

    if(user.password){
        userObject.password=user.password;
    }

    networkService.sendObjectToUrl(url,userObject,user._id ? "PUT" : "POST")
    .then((response)=>{
        showStatusMessage($scope,"Successfully saved user");
        halfInitialize($scope,true);
    },(error)=>{
        console.error("Error putting data to server",error);
    })
}

var savePage=($scope,$http,networkService)=>{
    var page=$scope.model.page;

    if(!(page.name)){
        showErrorMessage($scope,"Page Name can not be empty");
        return;
    }

    //for now we can only edit the name of a page. the articles are edited in their individual pages.
    var objectToSave={
        "name":page.name
    };

    var url="api/pages";
    if(page._id){
        objectToSave._id=page._id;
        url=url+"/"+page._id;
    }
    networkService.
    sendObjectToUrl(url,objectToSave,objectToSave._id?"PUT":"POST")
        .then((response)=>{
            showStatusMessage($scope,"Successfully saved Page");
            halfInitialize($scope,true);
        },(error)=>{
            showErrorMessage($scope,"Error saving user");
            console.error(error);
        });
}

var saveArticle=($scope,$http,networkService)=>{
    //when saving an article first save the articles text section. i.e the sections which are not files.
    //then after saving the text sections, using the id of the created article, save the thumbnail and the file.
    var article=$scope.model.article;

    //check for all necessary fields.
    if(!(article.title)){
        showErrorMessage($scope,"Please provide a title");
        return;
    }
    if(!(article.type)){
        showErrorMessage($scope,"Please select the Article Type");
        return;
    }
    if(!(article.page)){
        showErrorMessage($scope,"Please select the page to upload to");
        return;
    }
    if(article.type==='Picture' || article.type ==='Video' || article.type=== 'Audio' || article.type==='Resource'){
        if($scope.model.actionType==="createNew"){
            //if we are creating new article we need to check if a file is uploaded before sending a request.
            if(!(article.file.name)){
                showErrorMessage($scope,"Please select a Picture to upload");
                return;
            }
        }
    }
    if(article.type ==='Text'){
        if(!(article.content)){
            showErrorMessage($scope,"Please provide a content before uploading")
            return;
        }
    }

    var url="api/articles";
    var objectToSave={
        "title":article.title,
        "type":article.type
    }

    if(article.shortDescription){
        objectToSave.shortDescription=article.shortDescription;
    }
    if(article.content){
        objectToSave.content=article.content;
    }
    if(article._id){
        objectToSave._id=article._id;
        url=url+"/"+article._id;
    }



    networkService.sendObjectToUrl(url,objectToSave,objectToSave._id?"PUT":"POST")
        .then((response)=>{

            //here the metadata is saved now check if there exists a file to save. 
            var thumbnailChanged=false;
            var fileChanged=false;
            //if it is a new article we are trying to create we need the id it created it with for further process
            article._id=response._id;
            //if the article.file exists and have the value file.name, it means that the user has changed it. 
            if(article.file && article.file.name){
                console.log("File changed");
                fileChanged=true;
            }
            //if the thumbnail exists and have the value, thumbnail.name it means that the user has changed it.
            if(article.thumbnail && article.thumbnail.name){
                console.log("thumbnail changed");
                thumbnailChanged=true;
            }

            if(thumbnailChanged || fileChanged){
                //save the changed data to server.
                url="api/uploadFile?articleId="+response._id;
                var formData=new FormData();
                if(thumbnailChanged){
                    formData.append("file",article.thumbnail);
                    url=url+"&thumbnail="+article.thumbnail.name;
                }
                if(fileChanged){
                    formData.append("file",article.file);
                    url=url+"&file="+article.file.name;
                }

                networkService.postFormDataToUrl(url,formData)
                    .then((response)=>{
                        //here add article to page
                        var newUrl="api/addArticleToPage?articleId"+article._id+"&pageId"+article.page;
                        networkService.sendObjectToUrl(newUrl,null,"POST")
                            .then((response)=>{
                                showStatusMessage($scope,"Saved Article Successfully");
                                halfInitialize($scope,true);
                            },(error)=>{
                                showErrorMessage($scope,"savedArticle and file, but could not upload to page");
                                console.error('error');
                            })
                    },(error)=>{
                        console.error('error');
                        showErrorMessage($scope,"Saved Article but could not save Files.");
                    })
            }
            else{
                //here add article to page.
                var newUrl="api/addArticleToPage?articleId="+article._id+"&pageId="+article.page;
                networkService.sendObjectToUrl(newUrl,null,"POST")
                    .then((response)=>{
                        showStatusMessage($scope,"Saved Article Successfully");
                        halfInitialize($scope,true);
                    },(error)=>{
                        showErrorMessage($scope,"savedArticle and file, but could not upload to page");
                        console.error('error');
                })
            }

        },(error)=>{
            showErrorMessage($scope,"Could not save Article");
        })
}


mainApp.controller('fileController',['$scope','fileUpload',function($scope,fileUpload){
    $scope.uploadFile=function(){
        var file=$scope.myFile;

        console.log('file is ');
        console.dir(file);

        var uploadUrl="/fileUpload";
        fileUpload.uploadFileToUrl(file,uploadUrl);
    }

    $scope.$watch('myFile',()=>{
        console.log("file changed ",$scope.myFile);
        console.dir($scope.myFile);
    })
}])

