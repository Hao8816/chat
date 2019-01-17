var socket = require('socket.io-client')('http://127.0.0.1:3001');
const roomId = '2'
const message = {'name': 'test'}
socket.on('connect', function(){
    console.log("系统链接成功")
    socket.emit('login', {roomId: roomId, message: message})
});
socket.on('message', function(data){
    console.log("收到消息", data)
});
socket.on('disconnect', function(){});