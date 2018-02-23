var mongoose = require('mongoose');
var User = require('../dataSets/users');

exports.getAll=(req,res)=>{
    //added '-password' not to send back the password
    var fields="-password";
    if(req.query.fields){
        //split the comma separated fields and then join them with space to return them back.
        fields=req.query.fields.split(',');
        if(fields.indexOf('password')>-1){
            res.json({"Error":"What a sneaky thing you are doing remove the password field first."});
            return;
        }
    }
    User.find({},fields,(err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(user);
    });
};

exports.create=(req,res)=>{
    if(!checkIfCorrect(req.body,"new")){
        res.json({"Error":"User can't be created User doesn't have all the fields required."});
    }
    else{
        var newUser=new User(req.body);
        newUser.save((err,user)=>{
            if(err){
                console.error(err);
                res.send(err);
            }

            //added as a confirmation message and also not to send back the password.
            user.password=""
            res.json(user);
        });
    }
};

exports.getOne=(req,res)=>{
    User.findById(req.params.userId,'-password',(err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(user);
    });
};

exports.update=(req,res)=>{
    User.findById(req.params.userId,(err,user)=>{
        if(err){
            console.error(err);
            res.send("User Id doesn't exist");
        }
        var updatedUser=req.body;
        user.firstName=updatedUser.firstName;
        user.lastName=updatedUser.lastName;
        user.userType=updatedUser.userType;
        if(updatedUser.password){
            user.password=updatedUser.password;
        }
        console.log("updating new user ",user.firstName);
        user.save((err,user)=>{
            if(err){
                console.error(err);
                res.send({"Error":"Unable to update user"});
            }
            user.password="";
            res.json(user);
        });
    });
};

exports.delete=(req,res)=>{
    User.remove({_id:req.params.userId},(err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json({message: 'User Successfully deleted'});
    })
}

var checkIfCorrect=(user,newOrExisting)=>{
    if(newOrExisting==="new"){
        if(user.password && user.email && user.firstName && user.lastName){
            //checks if all fields are inserted.
            return true;
        }else{
            //if any fields are missing it will return false.
            return false;
        }
    }else if(newOrExisting === "existing"){
        //if we are editing an existing element
        if(user._id){
            //check if the element has an id or not. if it doesn't return false.
            return true;
        }else{
            return false;
        }
    }
}