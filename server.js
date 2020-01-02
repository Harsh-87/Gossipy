/**
 * Author: Harsh KOthari
 * Version: 1.0.0
 */
'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/");
});


// usernames which are currently connected to the chat
let usernames = {};
let rooms = {};

io.on('connection', function(socket) {
    socket.on('sendchat', (data) => {
        io.to(socket.roomname).emit('updatechat', socket.username, data);
    });

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', (username, roomname) => {
        socket.username = username;
        socket.roomname = roomname;
        socket.join(roomname);
        usernames[username] = socket.id;
        rooms[username] = roomname;
        io.to(roomname).emit('updatechat', socket.username, `joined the chat`);
        io.to(roomname).emit('member update', rooms);
    });

    socket.on('typing', (name) => {
        socket.broadcast.to(socket.roomname).emit('type-send', name);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        socket.broadcast.to(socket.roomname).emit('updatechat', socket.username, `disconnected`);
        delete usernames[socket.username];
        delete rooms[socket.username];
        io.to(socket.roomname).emit('member update', rooms);
    });

});

http.listen(port, function() {
    console.log('listening on :' + port);
});