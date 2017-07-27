$(function () {
    let socket = io();
    $('form').submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    $('#nick').submit(function () {
        socket.emit('new_user', $('#n').val());

        $('#username').css("display", "none");
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').html("<b style='color: " + msg.color + "'>" + msg.user + "</b>: " + msg.msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});