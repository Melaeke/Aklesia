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

    var articlesTypeController= require('../controllers/articleTypesController');
    app.route('/api/articleTypes')
        .get(articlesTypeController.getAll)
        .post(articlesTypeController.create);

    app.route('/api/articleTypes/:articelTypeId')
        .get(articlesTypeController.getOne)
        .put(articlesTypeController.update)
        .delete(articlesTypeController.delete);

    //articles
    var articlesController=require('../controllers/articlesController');
    app.route('/api/articles')
        .get(articlesController.getAll)
        .post(articlesController.create);
    
    app.route('/api/articles/:articleId')
        .get(articlesController.getOne)
        .put(articlesController.update)
        .delete(articlesController.delete);
    
}