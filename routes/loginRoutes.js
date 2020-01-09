
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');

module.exports = function (app) {

    const User = new mongoose.model("User");

    app.get('/login', function (req, res) {
        res.sendFile(path.resolve('views/login.html'));
    });

    app.post('/login', function (req, res) {
        var user_name = req.body.username;
        var user_password = req.body.password;
        const user = new User({
            username: user_name,
            password: user_password
        });
        req.login(user, function (err) {
            if (err) { console.log(err);res.redirect("/login"); }
            else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect("/");
                });
            }
        });
    });

};