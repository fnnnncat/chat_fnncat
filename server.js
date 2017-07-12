var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];
app.use('/', express.static(__dirname + '/www'));
server.listen(process.env.PORT || 3000);

//监听客户端链接，回调函数会传递本次链接的socket
io.sockets.on('connection', function(socket) {
    //监听新用户加入
    socket.on('login', function(username) {
        if (users.indexOf(username) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.username = username;
            users.push(username);
            socket.emit('loginSuccess');
            io.sockets.emit('system', username, users.length, 'login');
        };
    });
    //监听用户链接切断
    socket.on('disconnect', function() {
        if (socket.username != null) {
            users.splice(users.indexOf(socket.username), 1);
	     //信息传输对象为所有的client，排除当前socket对应的client
            socket.broadcast.emit('system', socket.username, users.length, 'logout');
        }
    });
    //监听用户发布的聊天内容
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.username, msg, color);
    });
    //监听用户发布的聊天图片
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.username, imgData, color);
    });
})
