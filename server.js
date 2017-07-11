var express = require('express'),
	app=express(),
	server=require('http').createServer(app),
	io=require('socket.io').listen(server),
	user=[];

app.use('/',express.static(__dirname+'/www'));
server.listen(process.env.PORT||3000);
console.log('server started on port:'+process.env.PORT||3000);

io.sockets.on('connection',function(socket){
	socket.on('login',function(nickname){
		if(user.indexOf(nickname)>-1){
			socket.emit('nickExisted');
		}else{
			socket.nickname=nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system',nickname,users.length,'login');
		};
	});
	socket.on('disconect',function(){
		if(socket.nickname!=null){
			users.splice(users.indexOf(socket.nickname),1);
			socket.broadcast.emit('system',socket.nickname,users.length,'logout');
		}
	});
	socket.on('postMsg',function(msg,color){
		socket.broadcast.emit('newMsg',socket.nickname,msg,color);
	});
	socket.on('img',function(imgData,color){
		socket.broadcast.emit('newImg',socket.nickname,imgData,color);
	});
});

