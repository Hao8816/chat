var socket = require('socket.io-client')('http://127.0.0.1:3000');
var fs = require('fs')
socket.on('connect', function(){
    console.log("系统链接成功")
    var data = fs.readFileSync('./test.png')
    console.log('文件内容', data)
    socket.emit('image', data)
});
socket.on('message', function(data){
    console.log("收到消息", data)
});
socket.on('disconnect', function(){});
