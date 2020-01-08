/**
 * Author: Harsh KOthari
 * Version: 1.0.0
 */
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var auth = require('./controllers/authentication.js');
var routes = require('./routes/routes.js');
var http = require('http').Server(app);
var socketController = require('./controllers/socketController.js');

app.use(bodyParser.urlencoded({ extended: true }));

//passport athentication using local strategy
auth.protect(app);

//mongo database connection
if(process.env.PORT){
    mongoose.connect(process.env.PORT,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
}else{
    const config = require('./appConfig.js');
    mongoose.connect(config.DBURL,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
}

//making public folder static to use resources
app.use('/public', express.static('public'));

//setup sockets
var io = require('socket.io')(http);
socketController(io);

//routes to listen
routes.initialize(app);

//port to listen
var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('listening on :' + port);
});