var DB = require('../chat_server/models.js');

//console.log(DB);
var contacts = [
    {
        'name':'Vaster',
        'avatar':'http://img1.2345.com/duoteimg/qqTxImg/2/78d4ee9b26cf134b72e6204fba2415f6.jpg',
        'message':'Hi, i am new here.',
        'time':'11:21',
        'uid' : '12',
        'sex' : '男'
    },{
        'name':'Tom',
        'avatar':'http://www.qq745.com/uploads/allimg/140825/1-140R5222015.jpg',
        'message':'No news is good news.',
        'time':'10:37',
        'uid' : '14',
        'sex' : '女'
    },{
        'name':'Jack',
        'avatar':'http://img.cnjiayu.net/3211573049-3310678237-21-0.jpg',
        'message':'Jack is a good boy.',
        'time':'09:15',
        'uid' : '15',
        'sex' : '男'
    },{
        'name':'Smite',
        'avatar':'http://img2.imgtn.bdimg.com/it/u=1963725967,863016856&fm=214&gp=0.jpg',
        'message':'Smite every day!',
        'time':'08:22',
        'uid' : '16',
        'sex' : '女'
    }
];


// 导入用户数据
for (var i=0;i<contacts.length;i++){
    var contact = contacts[i];
    var doc = {
        uid        : contact['uid'],
        username   : contact['name'],
        password   : '123456',
        email      : '',
        sex        : contact['sex'],
        birthday   : '',
        status     : 1,
        avatar     : contact['avatar']
    };
    DB.userModel.create(doc, function(error){
        if(error) {
            console.log(error);
        } else {
            console.log('save ok');
        }
    });
}