
module.exports = function (io) {

    // usernames which are currently connected to the chat
    let usernames = {};
    //roomnames currently active
    let rooms = {};

    io.on('connection', function (socket) {
        //listen for sent messages from sockets
        socket.on('sendchat', (data) => {
            io.to(socket.roomname).emit('updatechat', socket.username, data);
        });

        // when the client emits 'adduser', this listens and executes
        socket.on('adduser', (roomname,username) => {
            socket.username = username;
            socket.roomname = roomname;
            socket.join(roomname);
            usernames[username] = socket.id;
            rooms[username] = roomname;
            io.to(roomname).emit('member update', rooms);
            io.to(roomname).emit('updatechat', socket.username, `joined the chat`);
        });

        //Checks for user typing
        socket.on('typing', (name) => {
            socket.broadcast.to(socket.roomname).emit('type-send', name);
        });

        //on user disconnection
        socket.on('disconnect', () => {
            socket.broadcast.to(socket.roomname).emit('updatechat', socket.username, `disconnected`);
            delete usernames[socket.username];
            delete rooms[socket.username];
            io.to(socket.roomname).emit('member update', rooms);
        });
    });
}