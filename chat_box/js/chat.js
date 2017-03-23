// 配置页面路由 'chat'
var app_router = angular.module( 'chat' , ['ngRoute']).run(function($rootScope,socket,$location) {
    $rootScope.pageH = document.documentElement.clientHeight-200;
    socket.on('connect',function(){
        // 连接成功
        console.log('连接消息服务器成功');
    });
    if (!$rootScope.login_status){
        var local_uid = localStorage.getItem('UID');
        if (local_uid){
            socket.emit('login',{'uid': local_uid})
            socket.on('login_response', function(data){
                console.log("登录成功",data);
                var uid = data['uid'];
                $rootScope.login_status = true;
                $rootScope.uid = uid;
                $location.path('/recently/')
            });
        }else{
            $location.path('/login/');
        }
    }
    socket.on('disconnect', function(){});
});

// 配置页面
app_router.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/recently/', {
            templateUrl: 'views/recently.html',
            controller: 'recentlyPageController'
        }).
        when('/contacts/', {
            templateUrl: 'views/contacts.html',
            controller: 'contactsPageController'
        }).
        when('/settings/', {
            templateUrl: 'views/settings.html',
            controller: 'settingsPageController'
        }).
        when('/login/', {
            templateUrl: 'views/login.html',
            controller: 'loginPageController'
        }).

        otherwise({redirectTo: '/recently/'});
}]);

app_router.factory('socket', function ($rootScope) {
    var socket = io('http://www.tihub.cn:3000');
    //var socket = io('http://127.0.0.1:3000');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

// 判断是否为手机号码
function isPhone(phone){
    var myreg = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$|^147\d{8}/;
    if(!myreg.test(phone)){
        return false;
    }else{
        return true;
    }
}

// 判断是否为手机号码
function isEmail(email){
    var myreg = /[^\._-][\w\.-]+@(?:[A-Za-z0-9]+\.)+[A-Za-z]+/;
    if(!myreg.test(email)){
        return false;
    }else{
        return true;
    }
}

// 扩展ng-enter指令
app_router.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});


angular.module('chat').controller(
    'recentlyPageController',
    function recentlyPageController($scope, $rootScope, $http, socket) {
        $rootScope.link_index = 1;
        $scope.contact_index = 2;

        $scope.message_list = [
            {
                from : '21',
                to : '12',
                content : "你好",
                time : new Date().getTime()
            }
        ];

        socket.emit('recently_list',{'uid':'12'});
        socket.on('recently_list', function(data){
            console.log("发送回去最近聊天列表...");
        });
        socket.on('recently_list_response', function(data){
            console.log("获取z最近聊天列表成功",data);
            var contacts = data['recent_list'];
            $scope.contacts = contacts;
        });

        // 发送消息
        $scope.sendMessage = function(){
            var message = $scope.message;
            if (!message){
                return;
            }
            // 将消息显示在消息列表中
            var msg = {
                from : $rootScope.uid,
                to : $scope.current.uid,
                content : message,
                time : new Date().getTime()
            };
            socket.emit('chat_message', msg);
            $scope.message_list.push(msg);
            $scope.message = '';
        };
        socket.on('chat_message', function(data){
            console.log("接受到聊天消息",data);
        });


        $scope.chatWith = function(obj){
            $scope.contact_index = obj.$index;

            // 当前选中的用户
            $scope.current = {
                uid : obj.contact.uid,
                name : obj.contact.name,
                avatar: obj.contact.avatar
            }
        };


    }
);

angular.module('chat').controller(
    'contactsPageController',
    function contactsPageController($scope, $rootScope, $http, socket) {
        $rootScope.link_index = 2;
        $scope.contact_index = 2;

        socket.emit('contact_list',{'uid':'12'});
        socket.on('contact_list', function(data){
            console.log("请求好友列表。。。",data);
        });
        socket.on('contact_list_response', function(data){
            console.log("获取好友列表成功",data);
            var contacts = data['contacts'];
            $scope.contacts = contacts;
        });


        $scope.chatWith = function(obj){
            $scope.contact_index = obj.$index;

            // 当前选中的用户
            $scope.current = {
                name : obj.contact.name,
                avatar: obj.contact.avatar
            }
        };

    }
);

angular.module('chat').controller(
    'settingsPageController',
    function settingsPageController($scope, $rootScope, $http) {
        $rootScope.link_index = 3;

    }
);


angular.module('chat').controller(
    'loginPageController',
    function loginPageController($scope, $rootScope, $http, socket, $location) {

        $rootScope.login = function(){
            var username = $rootScope.username;
            socket.emit('login',{'uid': username})
        };

        socket.on('login', function(data){
            console.log("发送登录请求...");
        });

        socket.on('login_response', function(data){
            console.log("登录成功",data);
            var uid = data['uid'];
            $rootScope.login_status = true;
            $rootScope.uid = uid;
            localStorage.setItem('UID',uid);
            $location.path('/recently/')
        });
    }
);

