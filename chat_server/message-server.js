var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
    console.log('客户端连接成功');
    client.on('event', function(data){
        console.log(data);
    });
    client.on('disconnect', function(){});
});
server.listen(3000);