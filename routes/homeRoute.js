
var path = require('path');

module.exports = function (app) {
    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            res.sendFile(path.resolve("index.html"));
        } else {
            res.redirect("/login");
        }
    });
}