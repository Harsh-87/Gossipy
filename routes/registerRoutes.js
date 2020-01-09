

var path = require('path');
var mongoose = require('mongoose');

module.exports = function (app) {
    User = mongoose.model("User");
    app.get('/register', function (req, res) {
        res.sendFile(path.resolve('views/register.html'));
    });

    app.post('/register', function (req, res) {
        var user_name = req.body.username;
        var user_email = req.body.email;
        var user_password = req.body.password;
        User.register({ username: user_name }, user_password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            }
        });
    });
};