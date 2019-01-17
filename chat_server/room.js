var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('客户端连接成功',socket.id);
    socket.on('login', function(data){
      const roomId = data.roomId
      const message = data.message
      socket.join(roomId)
      console.log('登陆信息', data)
      io.to(roomId).emit('message', message);
    })
})
server.listen(3001);