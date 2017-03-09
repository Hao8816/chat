var DB = require('../chat_server/models.js');

var relations = [
    {
        'uid_1'      : '12',
        'uid_2'      : '13',
        'status'     : 1
    },{
        'uid_1'      : '12',
        'uid_2'      : '14',
        'status'     : 1
    },{
        'uid_1'      : '12',
        'uid_2'      : '15',
        'status'     : 1
    },{
        'uid_1'      : '12',
        'uid_2'      : '16',
        'status'     : 1
    },
    {
        'uid_1'      : '13',
        'uid_2'      : '14',
        'status'     : 1
    },{
        'uid_1'      : '13',
        'uid_2'      : '15',
        'status'     : 1
    },{
        'uid_1'      : '13',
        'uid_2'      : '16',
        'status'     : 1
    },{
        'uid_1'      : '14',
        'uid_2'      : '15',
        'status'     : 1
    },{
        'uid_1'      : '14',
        'uid_2'      : '16',
        'status'     : 1
    },{
        'uid_1'      : '15',
        'uid_2'      : '16',
        'status'     : 1
    }
];

// 导入用户数据
for (var i=0;i<relations.length;i++){
    var relation = relations[i];
    var doc = {
        'uid_1'      : relation['uid_1'],
        'uid_2'      : relation['uid_2'],
        'status'     : 1
    };
    DB.relationModel.create(doc, function(error){
        if(error) {
            console.log(error);
        } else {
            console.log('save ok');
        }
    });
}