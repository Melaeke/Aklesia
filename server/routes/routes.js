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

    
}