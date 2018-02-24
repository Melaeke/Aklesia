var mongoose = require('mongoose');
var Page = require('../dataSets/pages');
var Article= require('../dataSets/articles');

exports.getAll=(req,res)=>{
    //added '-password' not to send back the password
    var fields="";
    if(req.query.fields){
        //split the comma separated fields and then join them with space to return them back.
        fields=req.query.fields.split(',');
    }
    Page.find({},fields,(err,pages)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(pages);
    });
};

exports.create=(req,res)=>{
    if(!checkIfCorrect(req.body,"new")){
        res.json({"Error":"Page can't be created, the request doesn't have all the fields required."});
    }
    else{
        var newPage=new Page(req.body);
        newPage.save((err,page)=>{
            if(err){
                console.error(err);
                res.send(err);
            }
            res.json(page);
        });
    }
};

exports.getOne=(req,res)=>{
    var fields="";
    if(req.query.fields){
        //split the comma separated fields and then join them with space to return them back.
        fields=req.query.fields.split(',');
    }
    Page.findById(req.params.pageId,fields,(err,page)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json(page);
    });
};

exports.update=(req,res)=>{
    Page.findById(req.params.pageId,(err,page)=>{
        if(err){
            console.error(err);
            res.send("Page Id doesn't exist");
        }
        var updatedPage=req.body;
        page.name=updatedPage.name;
        page.save((err,page)=>{
            if(err){
                console.error(err);
                res.send({"Error":"Unable to update Page"});
            }
            res.json(page);
        });
    });
};

exports.delete=(req,res)=>{
    Page.remove({_id:req.params.pageId},(err,page)=>{
        if(err){
            console.error(err);
            res.send(err);
        }
        res.json({message: 'Page Successfully deleted'});
    })
}

exports.addArticle=(req,res)=>{
    var pageId=req.body.pageId;
    var articleId=req.body.articleId;
    Article.findById(articleId,(err,article)=>{
        if(err){
            console.error(err);
            res.send("Article Id doesn't exist");
        }
        //comapre the id of the article with the id of the new page.
        if(article.page.equals(pageId)){
            res.send({"Message":"Article already in page"});
            console.log("article already in page");
            return;
        }

        //Here the page exists, next check if the article exists. 
        Page.findById(pageId,(err,page)=>{
            if(err){
                console.error(err);
                res.send("Article Id doesn't exist");
            }
            //first delete the article from the previous page.
            var previousPageOfArticle=article.page;
            page.articles.push(articleId);
            article.page=pageId;
            page.save((err,page)=>{
                if(err){
                    console.error(err);
                    res.send({"Error":"Error saving to page."});
                }
                article.save((err,page)=>{
                    if(err){
                        console.error(err);
                        res.send({"Error":"Error saving article"});
                    }
                    //delte article from old page

                    Page.findById(previousPageOfArticle,(err,pageToDeleteFrom)=>{
                        if(err){
                            res.send({"Error":"Unable to get previous page"});
                            console.log(err)
                        }

                        pageToDeleteFrom.articles.splice(pageToDeleteFrom.articles.indexOf(articleId),1);
                        pageToDeleteFrom.save((err,pageToDeleteFrom)=>{
                            if(err){
                                res.send({"Error":"Unable to delete article from previous page"});
                                console.log(err)
                            }
                            res.send({"Message":"Successfully added article to new page from previous"});
                        })
                    })
                })
            })
        })
    })
}

var checkIfCorrect=(page,newOrExisting)=>{
    if(newOrExisting==="new"){
        if(page.name){
            return true;
        }else{
            return false;
        }
    }else if(newOrExisting === "existing"){
        if(page._id && page.name){
            return true;
        }else{
            return false;
        }
    }
}
