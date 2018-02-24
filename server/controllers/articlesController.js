var mongoose = require('mongoose');
var Article = require('../dataSets/articles');

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

    Article.find({})
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
    var newArticle=new Article(req.body);
    newArticle.save((err,article)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(article);
    });
};

exports.getOne = (req,res)=>{
    Article.findOne({"_id":req.params.articleId})
        //.populate('user') this keeps returning user password
        .exec((err,article)=>{
            if(err){
                console.error(err);
                res.send(err);
            }
            res.json(article);
        });
};

exports.update=(req,res)=>{
    Article.findOneAndUpdate({_id: req.params.articleId},req.body,{new: false},(err,article)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(article);
    });
};

exports.delete = (req,res)=>{
    Article.remove({_id:req.params.articleId},(err,article)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json({message:'article Successfully deleted'});
    });
};

exports.articlesPerPage=(req,res)=>{
    var pageId=req.params.pageId;
    var fields="";
    var typesRequired=true;
    if(req.query.fields){
        fields=req.query.fields.split(',')
        if(fields.indexOf("type">-1)){
            typesRequired=true;
        }else{
            typesRequired=false;
        }
    }
    Article.find({"page":pageId},fields,(err,articlesInPage)=>{
        if(err){
            console.error(err);
            res.send({"Error":err});
        }
        if(typesRequired){
            Article.populate(articlesInPage,{path:"type"},function(err,articlesInPage){
                if(err){
                    console.error("cannot populate");
                }
                res.json(articlesInPage);
            });
        }else{
            res.json(articlesInPage);
        }
    })
}