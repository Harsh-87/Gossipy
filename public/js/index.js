'use strict';

let i = 0,
    my_username = '',
    my_room = '';
const socket = io();

//executes on being ready
$(document).ready(() => {
    new MainChat();
});

// A base class is defined using the new reserved 'class' keyword
class MainChat {
    // constructor
    constructor() {
        $('.messages-content').mCustomScrollbar();
        MainChat.LoadEventHandlers();
    }

    //set time for each chat message
    static setDate() {
        let d = new Date();
        let hrs = d.getHours();
        let min = d.getMinutes();
        if (hrs >= 12) {
            hrs = hrs % 12;
            $('<div class="timestamp">' + hrs + ':' + min + ' pm</div>').appendTo($('.message:last'));
        } else
            $('<div class="timestamp">' + hrs + ':' + min + ' am</div>').appendTo($('.message:last'));
    }

    //sends messages
    static insertMessage() {
        const msg = $('.message-input').val();
        if ($.trim(msg) == '') return false;
        $('.message-input').val(null);
        MainChat.updateScrollbar();
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', msg);
    }


    static LoadEventHandlers() {

        $('.message-submit').click(() => {
            MainChat.insertMessage();
        });

        $(window).on('keydown', e => {
            if (e.which == 13) {
                MainChat.insertMessage();
                return false;
            }
        });

        //to disconnect user
        $(".logmeout").click(()=>{
            socket.disconnect();
            window.location.href = "/user/logout";
        });

        // listener, whenever the server emits 'updatechat', this updates the chat body
        socket.on('updatechat', function (sender, data) {
            if (sender === my_username) {
                $('<div class="message message-personal">You  :  ' + data + '</div>').appendTo($('.mCSB_container')).addClass('new');
                MainChat.setDate();
                MainChat.updateScrollbar();
            } else {
                $('<div class="message new">' + sender + "  :  " + data + '</div>').appendTo($('.mCSB_container')).addClass('new');
                MainChat.setDate();
                MainChat.updateScrollbar();
            }
        });

        // on connection to server, ask for user's name with an anonymous callback
        socket.on('connect', () => {
            my_room = localStorage.getItem('roomname');
            my_username = localStorage.getItem('username');
            if (my_room == null || my_username == null) {
                $.get("/logout", function (data, status) {
                    console.log(status);
                });
            }
            $('#room-name').text("Room : " + my_room);
            $('.online-bullet').text(my_username);
            socket.emit('adduser', my_room, my_username);
            $('#typer').keypress(function () {
                socket.emit("typing", my_username);
            });
        });

        //update member list
        socket.on('member update', function (rooms, roomname, name) {
            $('.room-member').empty();
            for (let r in rooms) {
                if (rooms[r] === my_room) {
                    $(`<h1 style="font-size: 12px;text-transform: uppercase;padding:10px 10px 5px 20px;">${r}</h1><hr/>`).appendTo('.room-member');
                }
            }
        });

        var timeout;
        //show typing user
        socket.on('type-send', username => {
            console.log("I am " + username);
            $('#typing').text(`${username} is typing...`);
            //for already running timeout
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                $('#typing').text(``);
            }, 1000);

        });

        socket.on('disconnect', () => {

        });
    }

    static updateScrollbar() {
        $('.messages-content').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
            scrollInertia: 10,
            timeout: 0
        });
    }

}