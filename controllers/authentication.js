
var passport = require('passport');
var session = require('express-session');
var passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose');

exports.protect = function (app) {

    app.use(session({
        secret: "Littlesecret",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    const userSchema = new mongoose.Schema({
        username: String,
        password: String
    });

    userSchema.plugin(passportLocalMongoose);
    const User = new mongoose.model("User", userSchema);

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}