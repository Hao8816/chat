// 配置页面路由 'chat'
var app_router = angular.module( 'chat' , ['ngRoute']).run(function($rootScope,socket) {
    $rootScope.screenH = document.documentElement.clientHeight;
    socket.on('connect',function(){
        socket.emit('login',{'name':'chenhao'})
    });

    socket.on('login', function(data){
        console.log("登录成功",data);

        $rootScope.Uid = '12';
    });
    socket.on('disconnect', function(){});
});

// 配置页面
app_router.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/recently/', {
            templateUrl: 'recently.html',
            controller: 'recentlyPageController'
        }).
        when('/contacts/', {
            templateUrl: 'contacts.html',
            controller: 'contactsPageController'
        }).
        when('/settings/', {
            templateUrl: 'settings.html',
            controller: 'settingsPageController'
        }).

        otherwise({redirectTo: '/recently/'});
}]);

app_router.factory('socket', function ($rootScope) {
    var socket = io('http://127.0.0.1:3000');
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

        socket.emit('recently_list',{'name':'chenhao'});
        socket.on('recently_list', function(data){
            console.log("获取最近聊天列表成功",data);
            var contacts = data['contacts'];
            $scope.contacts = contacts;
        });

        // 发送消息
        $scope.sendMessage = function(){
            var message = $scope.message;
            if (!message){
                return;
            }
            socket.emit('chat_message',{'message': message});
            // 将消息显示在消息列表中
            var msg = {
                from : '12',
                to : '21',
                content : message,
                time : new Date().getTime()
            };
            $scope.message_list.push(msg);
            $scope.message = '';
        };


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
    'contactsPageController',
    function contactsPageController($scope, $rootScope, $http, socket) {
        $rootScope.link_index = 2;
        $scope.contact_index = 2;

        socket.emit('contact_list',{'name':'chenhao'});
        socket.on('contact_list', function(data){
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
