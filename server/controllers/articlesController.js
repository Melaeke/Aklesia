var mongoose = require('mongoose');
var Article = require('../dataSets/articles');
var Page = require('../dataSets/pages');

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
    var fields ="";
    var populatePage=false;
    if(req.query.fields){
        fields=req.query.fields.split(',');
        if(fields.indexOf("page")>-1){
            populatePage=true;
        }
    }

    Article.find({},fields)
        .sort([['lastUpdated','descending']])
        .limit(pageSize)
        .skip(pageSize*pageNumber)
        .exec((err,articles)=>{
            if(err){
                console.error(err);
                res.send(err);
            }

            //if page is requiested populate only name field
            if(populatePage){
                Article.populate(articles,{path:"page",select:{"name":1}},function(err,articles){
                    if(err){
                        console.error("cannot populate Pages to articles",err);
                    }
                    res.json(articles);
                });
            }else{
                res.json(articles);
            }
        });
};

exports.countArticles=(req,res)=>{
    Article.count({},function(err,count){
        if(err){
            console.error(err);
            res.send({"Error":err});
        }
        res.json(count);
    });
}

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
    Article.findOne({_id:req.params.articleId})
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
    var articleId=req.params.articleId;
    Article.findOne({_id:articleId})
        .exec((err,article)=>{
            var pageId=article.page;
            Article.remove({_id:req.params.articleId},(err,article)=>{
                if(err){
                    console.error(err);
                    res.send(err);
                }
                console.log("article after delition ",article)
                //after deletion, remove article from page.articles list.
                Page.findById(pageId,(err,pageToDeleteFrom)=>{
                    if(err){
                        res.send({"Error":"Unable to get page to delte from"});
                        console.log(err);
                        return;
                    }
        
                    pageToDeleteFrom.articles.splice(pageToDeleteFrom.articles.indexOf(article._id),1);
                    pageToDeleteFrom.save((err,pageToDeleteFrom)=>{
                        if(err){
                            res.send({"Error":"Unable to delete article from page but delted page"});
                            console.log(err)
                            return;
                        }
                        res.send({"Message":"Successfully delted article"});
                    })
                })
            });
        })
};

exports.articlesPerPage=(req,res)=>{
    var pageId=req.params.pageId;
    var fields="";
    var pageNumber=0;
    var pageSize = 10;
    if(req.query.fields){
        fields=req.query.fields.split(',')
    }
    if(req.query.pageNumber){
        pageNumber=parseInt(req.query.pageNumber);
    }
    if(req.query.pageSize){
        pageSize=parseInt(req.query.pageSize);
    }
    Article.find({"page":pageId},fields)
        .sort([['lastUpdated','descending']])
        .limit(pageSize)
        .skip(pageSize*pageNumber)
        .exec((err,articlesInPage)=>{
            if(err){
                console.error(err);
                res.send({"Error":err});
            }
            res.json(articlesInPage);
        });
}

exports.countArticlesPerPage=(req,res)=>{
    var pageId=req.params.pageId;
    Article.count({"page":pageId},function(err,count){
        if(err){
            console.error(err);
            res.send({"Error":err});
        }
        res.json(count);
    });
}

exports.articlesPerType=(req,res)=>{
    var articleType=req.params.articleType;
    var fields="";
    var pageNumber=0;
    var pageSize = 10;
    if(req.query.fields){
        fields=req.query.fields.split(',')
    }
    if(req.query.pageNumber){
        pageNumber=parseInt(req.query.pageNumber);
    }
    if(req.query.pageSize){
        pageSize=parseInt(req.query.pageSize);
    }
    Article.find({"type":articleType},fields)
        .sort([['lastUpdated','descending']])
        .limit(pageSize)
        .skip(pageSize*pageNumber)
        .exec((err,articlesOfType)=>{
            if(err){
                console.error(err);
                res.send({"Error":err});
            }
            res.json(articlesOfType);
        });
}

exports.countArticlesPerType=(req,res)=>{
    var articleType=req.params.articleType;
    Article.count({"type":articleType},function(err,count){
        if(err){
            console.error(err);
            res.send({"Error":err});
        }
        res.json(count);
    });
}

exports.uploadFile=(req,res)=>{
    if(req.files.length>0){//check if there actually exists files.
        Article.findOne({_id:req.query.articleId},(err,article)=>{
            if(err){
                console.error("Can not find article");
                res.json({"Error":err});
            }
            if(req.query.file){
                article.fileName=req.query.file;
                req.files.forEach(file => {
                    if(file.originalname===req.query.file){
                        //this is the file
                        article.filePath=file.path;
                    }
                });
            }
            if(req.query.thumbnail){
                article.thumbnailName=req.query.thumbnail;
                req.files.forEach(file => {
                    if(file.originalname===req.query.thumbnail){
                        //this is the file
                        article.thumbnailPath=file.path;
                    }
                });
            }
            console.log("Saving article ",article);
            article.save(function (err,article){
                if(err){
                    console.error("Error occured during saving filename to article");
                    res.json({"Error":err})
                }
                res.json(article);
            });
        })
    }
}
exports.onFileError=(err,next)=>{
    console.error("error uploading file ",err);
    next();
}