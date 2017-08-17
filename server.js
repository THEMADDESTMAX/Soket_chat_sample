'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/client.html');
});

app.get('/client/style.css', function (req, res) {
    res.sendFile(__dirname + '/client/style.css');
});

app.get('/client/client.js', function (req, res) {
    res.sendFile(__dirname + '/client/client.js');
});

io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        io.emit('chat message', responceConstructor("System", "blue", `User ${socket.nickname || socket.id} left`));
        io.emit('users_list', formatUsers());
    });
    socket.on('new_user', (msg) => {
        socket.nickname = msg;
        let system = responceConstructor("System", "blue", `New user ${socket.nickname} has connected`);
        io.emit('chat message', system);
        io.emit('users_list', formatUsers());
        socket.on('chat message', function (msg) {
            // io.emit('chat message', `${socket.nickname}: ${msg}`);
            io.emit('chat message', responceConstructor(socket.nickname, "red", msg));
        });
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

function responceConstructor(user, color, msg) {
    let result = {
        user: user,
        color: color,
        msg: msg
    };
    return result;
}

function formatUsers() {
    let users = io.sockets.sockets;
    let resArr = [];
    for (let key in users) {
        if (users[key].nickname)
            resArr.push(users[key].nickname);
    }
    return resArr;
}