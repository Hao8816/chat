var DB = require('./models.js');
/*
*  不同类型的消息路由功能
*
* */

var MESSAGES = {
    'LOGIN' : 'login',
    'CONTACT_LIST' : 'contact_list',
    'RECENTLY_LIST' : 'recently_list',
    'CHAT_MESSAGE' : 'chat_message'
};

// 登录消息  LOGIN
// 登录响应  LOGIN_RES
MESSAGES['LOGIN_RES'] = function(data){
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
        return {'status': 'OK'};

    });
};


// 获取好友列表  CONTACT_LIST
// 获取好友列表响应  CONTACT_LIST_RES
MESSAGES['CONTACT_LIST_RES'] = function(data){
    var uid = data['uid'];
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
            }else{
                uids.push(uid_list[i]['uid_1']);
            }
        }
        // 查询批量用户的详细信息
        DB.userModel.find({ uid: { $in: uids} }).exec(function(err,res){
            if (err){
                console.log(err);
                return
            }
            console.log('好友列表详情',res);
            var contacts = res;
            return {'status': 'OK','contacts':contacts};
        });
        return {'status': 'OK','contacts':[]};

    });
};

// 最近聊天   RECENTLY_LIST
// 最近聊天响应  RECENTLY_LIST_RES
MESSAGES['RECENTLY_LIST_RES'] = function(data){
    console.log(data);
    var contacts = [
        {
            'name':'Vaster',
            'avatar':'http://img1.2345.com/duoteimg/qqTxImg/2/78d4ee9b26cf134b72e6204fba2415f6.jpg',
            'message':'Hi, i am new here.',
            'time':'11:21',
            'uid' : '12'
        },{
            'name':'Tom',
            'avatar':'http://www.qq745.com/uploads/allimg/140825/1-140R5222015.jpg',
            'message':'No news is good news.',
            'time':'10:37',
            'uid' : '14'
        },{
            'name':'Jack',
            'avatar':'http://img.cnjiayu.net/3211573049-3310678237-21-0.jpg',
            'message':'Jack is a good boy.',
            'time':'09:15',
            'uid' : '15'
        },{
            'name':'Smite',
            'avatar':'http://img2.imgtn.bdimg.com/it/u=1963725967,863016856&fm=214&gp=0.jpg',
            'message':'Smite every day!',
            'time':'08:22',
            'uid' : '16'
        }
    ];
    return {'status': 'OK','contacts':contacts};
};

MESSAGES['CHAT_MESSAGE_RES'] = function(){


};


// 退出消息  LOGOUT

module.exports = MESSAGES;
