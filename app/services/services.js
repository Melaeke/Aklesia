'user strict';
var mainApp = angular.module('aklesia');

//this creates a service that is used by calling uploadFileToURL which uploads file to a given url
mainApp.service('networkService',['$http',function($http){
    /**
     * this uploads a form data to a given url 
     * @param {*URLtoUploadTo} url 
     * @param {*theFormDataToUpload} formData the form data to upload to , it should be created as var fd=new FormData(); fd.append('file',file)
     */
    this.postFormDataToUrl=function(url,formData){
        return $http.post(url,formData,{
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
        })
        .then(function(){
            console.log("successfully uploaded Article")
        })
        .catch(function(err){
            console.error("Error uploading ");
            throw(err)
        });
    }

    this.putFormData= (url,formData)=>{
        console.log(formData)
        return $http.put(url,formData)
        .then(()=>{
            console.log("successfully put form");
        })
        .catch((err)=>{
            console.error("Error occured",err);
            throw(err);
        })
    }

    this.getFromServer=(url)=>{
        return $http.get(url).then((response)=>{
            return response.data;
        }).catch((error)=>{
            console.log("error with request",error);
            throw(error);
        })
    }

    this.sendObjectToUrl = (url,objectToPost,method)=>{
        return $http({
            url: url,
            method: method,
            data: objectToPost
        }).then((response)=>{
            return response.data;
        }).catch((error)=>{
            console.log("Error caught",error);
            throw(error);
        })
    }
}]);
