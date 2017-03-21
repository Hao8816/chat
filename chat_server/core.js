var server = require('http').createServer();
var io = require('socket.io')(server);

var MS = require('./messages.js');
var SOCKETS = {};

io.on('connection', function(client){
    console.log('客户端连接成功');

    // 处理用户登录消息
    client.on(MS.LOGIN, function(data){
        var res = MS.LOGIN_RES(data);
        console.log(res)
        var uid = data['uid'];
        SOCKETS[uid] = this.id;
        client.emit(MS.LOGIN,res);
    });

    // 处理获取好友列表消息
    client.on(MS.CONTACT_LIST, function(data){
        MS.GET_CONTACT_LIST(data);
        client.emit(MS.CONTACT_LIST,{'status': 'OK'});
    });

    client.on(MS.CONTACT_LIST_RES, function(data){
        // 消息传递，解析用户信息，发送信息到客户段
        var uid = data['uid'];
        try {
            var socket_id = SOCKETS[uid];
            io.sockets.connected[socket_id].emit(MS.CONTACT_LIST_RES,data);
        }catch (err){
            console.log('++++'+err)
        }
    });

    // 处理最近聊天列表消息
    client.on(MS.RECENTLY_LIST, function(data){
        var res = MS.RECENTLY_LIST_RES(data);
        client.emit(MS.RECENTLY_LIST,res);
    });

    // 处理用户发送的消息，传递给好友
    client.on(MS.CHAT_MESSAGE, function(data){
        // 消息转发
        console.log(data);
        var uid = data['to'];
        try {
            var socket_id = SOCKETS[uid];
            io.sockets.connected[socket_id].emit(MS.CHAT_MESSAGE,data);
        }catch (err){
            console.log('++++'+err)
        }
    });

    client.on('disconnect', function(){});
});
server.listen(3000);