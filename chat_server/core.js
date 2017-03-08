var server = require('http').createServer();
var io = require('socket.io')(server);

var MS = require('./messages.js');

io.on('connection', function(client){
    console.log('客户端连接成功');

    // 处理用户登录消息
    client.on(MS.LOGIN, function(data){
        var res = MS.LOGIN_RES(data);
        client.emit(MS.LOGIN,res);
    });

    // 处理获取好友列表消息
    client.on(MS.CONTACT_LIST, function(data){
        var res = MS.CONTACT_LIST_RES(data);
        client.emit(MS.CONTACT_LIST,res);
    });

    // 处理最近聊天列表消息
    client.on(MS.RECENTLY_LIST, function(data){
        var res = MS.RECENTLY_LIST_RES(data);
        client.emit(MS.RECENTLY_LIST,res);
    });

    // 处理用户见




    client.on('disconnect', function(){});
});
server.listen(3000);