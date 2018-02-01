var mongoose = require('mongoose');
var articles = require('../dataSets/articles');

exports.getAll = (req,res)=>{
    //the default pageSize is 10. we can override it with api/articles?pageSize=xx
    //when pageSize=0 it returns everything
    //don't forget that the paging works on the sorting of the articles' lastUpdated
    var pageSize=10;
    if(req.query.pageSize){
        pageSize=parseInt(req.query.pageSize);
    }

    //the default page number is 0 we can override it with api/articles?pageNumber=xx
    var pageNumber=0;
    if(req.query.pageNumber){
        pageNumber=parseInt(req.query.pageNumber);
    }

    articles.find({})
        .sort([['lastUpdated','descending']])
        .limit(pageSize)
        .skip(pageSize*pageNumber)
        .exec((err,article)=>{
            if(err){
                console.error(err);
                res.send(err);
            }
            res.json(article);
        });
};

exports.create = (req,res)=>{
    var newArticle=new articles(req.body);
    newArticle.save((err,article)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(article);
    });
};

exports.getOne = (req,res)=>{
    articles.findOne({"_id":req.params.articleId})
        .populate('user')
        .exec((err,article)=>{
            if(err){
                console.error(err);
                res.send(err);
            }
            res.json(article);
        });
};

exports.update=(req,res)=>{
    articles.findOneAndUpdate({_id: req.params.articleId},req.body,{new: false},(err,article)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(article);
    });
};

exports.delete = (req,res)=>{
    articles.remove({_id:req.params.articleId},(err,article)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json({message:'article Successfully deleted'});
    });
};