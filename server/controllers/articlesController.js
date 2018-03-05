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

exports.uploadFile=(req,res)=>{
    if(req.files.length>0){//check if there actually exists files.
        Article.findOne({_id:req.query.articleId},(err,article)=>{
            if(err){
                console.error("Can not find article");
                res.json({"Error":err});
            }
            if(req.query.file){
                article.fileName=req.query.file;
                console.log("files are ",req.files);
                console.log("file is ",req.file);
                console.log("query string is ",req.query);
                req.files.forEach(file => {
                    if(file.originalname===req.query.file){
                        //this is the file
                        article.filePath=file.path;
                    }
                });
            }
            if(req.query.file){
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