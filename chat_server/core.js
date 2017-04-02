var server = require('http').createServer();
var io = require('socket.io')(server);

var MS = require('./messages.js');
var SOCKETS = {};

io.on('connection', function(client){
    console.log('客户端连接成功',client.id);

    // 发送socket的id到客户端
    client.emit('sid',{'sid': client.id});

    // 处理用户登录消息
    client.on(MS.LOGIN, function(data){
        MS.USER_LOGIN(data);
        client.emit(MS.LOGIN,{'status': 'OK'});
    });
    client.on(MS.LOGIN_RES, function(data){
        // 消息传递，解析用户信息，发送信息到客户段
        var sid = data['sid'];
        try {
            io.sockets.connected[sid].emit(MS.LOGIN_RES,data);
        }catch (err){
            console.log('++++'+err)
        }
    });


    // 处理用户登录消息
    client.on(MS.REGISTER, function(data){
        MS.USER_REGISTER(data);
        client.emit(MS.REGISTER,{'status': 'OK'});
    });

    client.on(MS.REGISTER_RES, function(data){
        var sid = data['sid'];
        io.sockets.connected[sid].emit(MS.REGISTER_RES,data);
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
        MS.GET_RECENTLY_LIST(data);
        client.emit(MS.RECENTLY_LIST,{'status': 'OK'});
    });

    client.on(MS.RECENTLY_LIST_RES, function(data){
        // 消息传递，解析用户信息，发送信息到客户段
        var uid = data['uid'];
        try {
            var socket_id = SOCKETS[uid];
            io.sockets.connected[socket_id].emit(MS.RECENTLY_LIST_RES,data);
        }catch (err){
            console.log('++++'+err)
        }
    });

    // 处理聊天消息列表消息
    client.on(MS.MESSAGE_LIST, function(data){
        MS.GET_MESSAGE_LIST(data);
        client.emit(MS.MESSAGE_LIST,{'status': 'OK'});
    });
    client.on(MS.MESSAGE_LIST_RES, function(data){
        // 消息传递，解析用户信息，发送信息到客户段
        var uid = data['uid'];
        try {
            var socket_id = SOCKETS[uid];
            io.sockets.connected[socket_id].emit(MS.MESSAGE_LIST_RES,data);
        }catch (err){
            console.log('++++'+err)
        }
    });


    // 处理用户发送的消息，传递给好友
    client.on(MS.CHAT_MESSAGE, function(data){
        // 消息转发
        console.log(data);
        var uid = data['to'];
        try {
            var socket_id = SOCKETS[uid];
            console.log('消息传递id',socket_id,SOCKETS);
            io.sockets.connected[socket_id].emit(MS.CHAT_MESSAGE,data);
            data['status'] = 1;    // 标记消息为已读
        }catch (err){
            console.log('目标用户不在线，存储历史消息'+err);
        }
        // 消息存储
        MS.SAVE_CHAT_MESSAGE(data);
    });

    client.on('disconnect', function(){});
});
server.listen(3000);