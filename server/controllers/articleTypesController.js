var mongoose = require('mongoose');
var ArticleTypes = require('../dataSets/articleTypes');

exports.getAll = (req,res)=>{
    ArticleTypes.find({},(err,articleType)=>{
        if(err){
            res.send(err);
        }
        res.json(articleType);
    });
};

exports.create = (req,res)=>{
    console.log(req.body);
    var newarticleType=new ArticleTypes(req.body);
    newarticleType.save((err,articleType)=>{
        if(err){
            res.send(err);
        }
        res.json(articleType);
    });
};

exports.getOne= (req,res)=>{
    console.log(req.params);
    ArticleTypes.findById(req.params.articleTypeId,(err,articleType)=>{
        if(err){
            res.send(err);
        }
        res.json(articleType);
    });
};

exports.update= (req,res)=>{
    ArticleTypes.findOneAndUpdate({_id: req.params.articleTypeId},req.body,{new: true},(err,articleType)=>{
        if(err){
            res.send(err);
        }
        res.json(articleType)
    });
};

exports.delete = (req,res)=>{
    ArticleTypes.remove({
        _id:req.params.articleTypeId
    },(err,articleType)=>{
        if(err){
            res.json({message:'articleType Successfully deleted'});
        }
    })
}