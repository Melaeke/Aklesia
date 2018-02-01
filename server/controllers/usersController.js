var mongoose = require('mongoose');
var User = require('../dataSets/users');

exports.getAll=(req,res)=>{

    //added '-password' not to send back the password
    User.find({},'-password',(err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(user);
    });
};

exports.create=(req,res)=>{
    var newUser=new User(req.body);
    newUser.save((err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }

        //added as a confirmation message and also not to send back the password.
        user.password="Successfully created User"
        res.json(user);
    });
};

exports.getOne=(req,res)=>{
    User.findById(req.params.userId,(err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(user);
    });
};

exports.update=(req,res)=>{
    User.findOneAndUpdate({_id:req.params.userId},req.body,{new: false},(err,user)=>{
        if(err){
            console.error(err);
            res.send(err);
        }

        //delete the password so it won't be replied back as a response.
        user.password="Updating user successful";
        res.json(user);
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