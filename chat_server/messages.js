var DB = require('./models.js');
var async = require('async');

// 处理客户端消息之后，消息通知客户端
var socket = require('socket.io-client')('http://127.0.0.1:3000');
socket.on('connect', function(){
    console.log("系统链接成功")
});
socket.on('disconnect', function(){});

/*
*  不同类型的消息路由功能
*
* */

var MESSAGES = {
    'LOGIN' : 'login',
    'LOGIN_RES' : 'login_response',
    'CONTACT_LIST' : 'contact_list',
    'RECENTLY_LIST' : 'recently_list',
    'RECENTLY_LIST_RES' : 'recently_list_response',
    'CHAT_MESSAGE' : 'chat_message',
    'CONTACT_LIST_RES' : 'contact_list_response'
};

// 登录消息  LOGIN
// 登录响应  LOGIN_RES
MESSAGES['USER_LOGIN'] = function(data){
    console.log(data);
    // 查询用户信息是不是正确
    var uid = data['uid'];
    DB.userModel.getUser(uid,function(err,res){
        if (err){
            console.log(err);
            return
        }

        // 处理用户信息

        console.log(res);
        socket.emit(MESSAGES.LOGIN_RES,{'status': 'OK','uid': uid});
    });
};


// 获取好友列表  CONTACT_LIST
// 获取好友列表响应  CONTACT_LIST_RES
MESSAGES['GET_CONTACT_LIST'] = function(data){
    var uid = data['uid'];
    async.waterfall([
        function(callback){
            DB.relationModel.find({ $or: [ {'uid_1': uid}, { 'uid_2': uid } ] }).exec(function(err,res){
                if (err){
                    console.log(err);
                    return
                }
                // 显示好友列表
                var uid_list = res;

                // 循环好友列表
                var uids = [];
                for(var i=0;i<uid_list.length;i++){
                    if (uid_list[i]['uid_1']==uid){
                        uids.push(uid_list[i]['uid_2']);
                    }else if(uid_list[i]['uid_2']==uid){
                        uids.push(uid_list[i]['uid_1']);
                    }else{
                        console.log('不符合条件数据')
                    }
                }
                console.log('好友数量',uids.length);
                callback(null, uids);
            });
        },
        function(uids, callback){
            // 去重处理

            // 查询批量用户的详细信息
            DB.userModel.find({ uid: { $in: uids} }).exec(function(err,res){
                if (err){
                    console.log(err);
                    return
                }
                console.log('好友列表详情');
                var contacts = res;
                callback(null, contacts);
            });
        }
    ], function (err, result) {
        console.log('查询好友列表成功');
        socket.emit(MESSAGES.CONTACT_LIST_RES,{'status': 'OK','contacts':result,'uid': uid});
    });
};



// 最近聊天   RECENTLY_LIST
// 最近聊天响应  RECENTLY_LIST_RES
MESSAGES['GET_RECENTLY_LIST'] = function(data){
    var uid = data['uid'];
    async.waterfall([
        function(callback){
            DB.relationModel.find({ $or: [ {'uid_1': uid}, { 'uid_2': uid } ] }).exec(function(err,res){
                if (err){
                    console.log(err);
                    return
                }
                // 显示好友列表
                var uid_list = res;

                // 循环好友列表
                var uids = [];
                for(var i=0;i<uid_list.length;i++){
                    if (uid_list[i]['uid_1']==uid){
                        uids.push(uid_list[i]['uid_2']);
                    }else if(uid_list[i]['uid_2']==uid){
                        uids.push(uid_list[i]['uid_1']);
                    }else{
                        console.log('不符合条件数据')
                    }
                }
                console.log('好友数量',uids.length);
                callback(null, uids);
            });
        },
        function(uids, callback){
            // 去重处理

            // 查询批量用户的详细信息
            DB.userModel.find({ uid: { $in: uids} }).exec(function(err,res){
                if (err){
                    console.log(err);
                    return
                }
                console.log('好友列表详情');
                var contacts = res;
                callback(null, contacts);
            });
        }
    ], function (err, result) {
        console.log('查询好友列表成功');
        socket.emit(MESSAGES.RECENTLY_LIST_RES,{'status': 'OK','recent_list':result,'uid': uid});
    });
};

MESSAGES['CHAT_MESSAGE_RES'] = function(){


};


// 退出消息  LOGOUT

module.exports = MESSAGES;
