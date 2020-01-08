var login = require('./loginRoutes.js');
var register = require('./registerRoutes.js');
var home = require('./homeRoute.js');
var logout = require('./logoutRoute.js');

exports.initialize = function (app) {
    home(app);
    login(app);
    register(app);
    logout(app);
}