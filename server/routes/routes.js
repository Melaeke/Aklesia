'use strict';

//this is the default function exported as routes(app)
module.exports = (app)=>{

    //users API endpoints.
    var usersController = require('../controllers/usersController');
    app.route('/api/users')
        .get(usersController.getAll)
        .post(usersController.create);

    app.route('/api/users/:userId')
        .get(usersController.getOne)
        .put(usersController.update)
        .delete(usersController.delete);

    //articles
    var articlesController=require('../controllers/articlesController');
    app.route('/api/articles')
        .get(articlesController.getAll)
        .post(articlesController.create);
    
    app.route('/api/articles/:articleId')
        .get(articlesController.getOne)
        .put(articlesController.update)
        .delete(articlesController.delete);

    app.route('/api/articlesPerPage/:pageId')
        .get(articlesController.articlesPerPage);

    //pages
    var pagesController=require('../controllers/pagesController');
    app.route('/api/pages')
        .get(pagesController.getAll)
        .post(pagesController.create);

    app.route('/api/addArticleToPage')
        .post(pagesController.addArticle);
    
    app.route('/api/pages/:pageId')
        .get(pagesController.getOne)
        .put(pagesController.update)
        .delete(pagesController.delete);


    
    //predefined values
    app.route('/api/articleTypes')
        .get((req,res)=>{
            res.json(
                ['Picture','Text','Video','Live','Audio','Resources']
            );
        });
    
    app.route('/api/userTypes')
        .get((req,res)=>{
            res.json(
                ["Admin","uploader","normal"]);
        })
}