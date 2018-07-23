// 配置页面路由 'chat'
var app_router = angular.module( 'chat' , ['ngRoute','luegg.directives']).run(function($rootScope,socket,$location) {
    $rootScope.pageH = document.documentElement.clientHeight-120;
    // 设置默认头像路径
    $rootScope.default_avatar = 'images/default_avatar.jpeg';

    socket.on('connect',function(){
        // 连接成功
        console.log('连接消息服务器成功');
    });
    if (!$rootScope.login_status){
        var storage_user = localStorage.getItem('USER');
        var user = JSON.parse(storage_user);
        if (user){
            socket.emit('login', user);
            socket.on('login_response', function(data){
                if (data['status'] == 'OK'){
                    console.log("登录成功",data);
                    // 缓存用户的信息在前端
                    $rootScope.login_status = true;
                    var user = data['user'];
                    $rootScope.user = user;
                    localStorage.setItem('USER',JSON.stringify(user));
                    //$location.path('/recently/-1/')
                }else{
                    alert(data['info']);
                }
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
        when('/recently/:id/', {
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
        when('/register/', {
            templateUrl: 'views/register.html',
            controller: 'registerPageController'
        }).

        otherwise({redirectTo: '/recently/-1/'});
}]);

app_router.factory('socket', function ($rootScope) {
    //var socket = io('http://www.tihub.cn:3000');
    var socket = io('http://127.0.0.1:3000');
    return {
        info : socket.listeners,
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        off: function (eventName, callback) {
            socket.off(eventName, function () {
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
    function recentlyPageController($scope, $rootScope, $routeParams, $http, socket, $cacheFactory) {
        var chat_id = $routeParams.id;
        $rootScope.link_index = 1;
        $scope.selected_uid = chat_id;
        var cache_user = localStorage.getItem('USER');
        var user = JSON.parse(cache_user);

        // 消息存储
        $scope.cacheMessages = function (key, data) {
            var message_uid = data[key];
            // 消息缓存,放到前端消息队列中
            var message_cache = $cacheFactory.get('MESSAGES_CACHE') || $cacheFactory('MESSAGES_CACHE');
            var message_list = message_cache.get(message_uid) || [];
            message_list.push(data);
            message_cache.put(message_uid, message_list);
        };

        // 获取对用用户的消息
        $scope.getCachedMessages = function(uid){
            // 消息缓存
            var message_cache = $cacheFactory.get('MESSAGES_CACHE');
            if(message_cache){
                var message_list = message_cache.get(uid) || [];
                // 消息去重复

                $scope.message_list = message_list;
            }
        };

        // 获取缓存中的联系人列表
        var cache_contacts = $cacheFactory.get('CONTACTS_CACHE');
        if (cache_contacts){
            // 查询缓存中的时间
            var update_time = cache_contacts.get('update_time');
            var now_time = new Date();
            if (now_time.getTime()-update_time.getTime() < 60*1000){
                var match_contact = false;
                $scope.contacts = cache_contacts.get('contacts');
                $scope.contacts.forEach(function(item){
                    if (item['uid']==chat_id){
                        $scope.current = item;
                        match_contact = true;
                    }
                });
                // 查询消息
                if (!match_contact && $scope.contacts.length>0){
                    $scope.current = $scope.contacts[0];
                }
                $scope.getCachedMessages($scope.current.uid);
            }else{
                // 获取更新
                socket.emit('recently_list',{'uid':user.uid});
            }
        }else{
            // 获取更新
            socket.emit('recently_list',{'uid':user.uid});
        }

        socket.on('recently_list', function(data){
            console.log("发送回去最近聊天列表...");
        });
        var recentlyList = function(data){
            var contacts = data['recent_list'];
            $scope.contacts = contacts;
            var update_time = new Date();
            // 定义缓存
            var cache = $cacheFactory.get('CONTACTS_CACHE') || $cacheFactory('CONTACTS_CACHE');
            cache.put('update_time', update_time);
            cache.put('contacts', contacts);

            var match_contact = false;
            contacts.forEach(function(item){
                if (item['uid']==chat_id){
                    $scope.current = item;
                    match_contact = true;
                }
            });
            if (!match_contact && contacts.length > 0){
                // 查询消息
                $scope.current = contacts[0];
            }
            $scope.getCachedMessages($scope.current.uid);
        }
        socket.on('recently_list_response', recentlyList);

        // 发送消息
        $scope.sendMessage = function(){
            var message = $scope.message;
            if (!message){
                return;
            }
            // 将消息显示在消息列表中
            var msg = {
                from : $rootScope.user.uid,
                to : $scope.current.uid,
                content : message,
                time : new Date().getTime()
            };
            // 发送的消息
            console.log('发送的消息',msg);
            socket.emit('chat_message', msg);

            // 存储消息
            $scope.cacheMessages('to',msg);
            // 查询消息
            $scope.getCachedMessages($scope.current.uid);
            $scope.message = '';
        };

        var charMessage = function (data) {
            console.log("接受到聊天消息",data);
            // 存储消息
            var msg = {
                from : data['from'],
                to : data['to'],
                content : data['content'],
                time : data['time']
            };

            $scope.cacheMessages('from',data);

            // 查询消息
            $scope.getCachedMessages($scope.current.uid);
        };
        socket.on('chat_message', charMessage);

        //$scope.chatWith = function(obj){
        //    $scope.contacts.forEach(function(item){
        //        if (item['uid']==chat_id){
        //            $scope.current = item;
        //        }
        //    });
        //    // 获取当前聊天用户的消息列表
        //    //$scope.getHistoryMessage($rootScope.uid,$scope.current.uid);
        //};

        $scope.getHistoryMessage = function(uid_1,uid_2){
            socket.emit('message_list',{'uid_1':uid_1,'uid_2':uid_2});
        };

        socket.on('message_list_response', function(data){
            console.log("历史消息列表",data);
            // 解析聊天消息
            var message_list = data['message_list'];
            $scope.message_list = message_list;
        });


    }
);

angular.module('chat').controller(
    'contactsPageController',
    function contactsPageController($scope, $rootScope, $http, socket) {
        $rootScope.link_index = 2;

        var cache_user = localStorage.getItem('USER');
        var user = JSON.parse(cache_user);

        socket.emit('contact_list',{'uid':user.uid});
        socket.on('contact_list', function(data){
            console.log("请求好友列表。。。",data);
        });
        socket.on('contact_list_response', function(data){
            console.log("获取好友列表成功",data);
            var contacts = data['contacts'];
            $scope.contacts = contacts;
            $scope.current = contacts[0];
        });


        $scope.chatWith = function(obj){
            // 当前选中的用户
            $scope.current = obj.contact;
        };

        // 搜素好友
        $scope.searchContacts = function(){
            var keyword = $scope.search_contacts;
            if (!keyword){
                return;
            }
            // 执行搜索操作
            socket.emit('contact_list',{'uid':user.uid,'keyword': keyword});
        };

        // 添加好友
        $scope.addContact = function(obj){
            socket.emit('add_contact',{'uid_1':user.uid,'uid_2':obj.contact.uid});
        }

    }
);

angular.module('chat').controller(
    'settingsPageController',
    function settingsPageController($scope, $rootScope, $http, $location) {
        $rootScope.link_index = 3;

        $scope.logout = function(){
            localStorage.clear();
            $rootScope.login_status = false;
            $location.path('/login/')
        }

    }
);


angular.module('chat').controller(
    'loginPageController',
    function loginPageController($scope, $rootScope, $http, socket, $location) {

        // 登录功能
        $rootScope.login = function(){
            var username = $scope.username;
            var password = $scope.password;
            socket.emit('login',{'username': username,'password':password})
        };

        socket.on('login', function(data){
            console.log("发送登录请求...");
        });

        socket.on('login_response', function(data){
            if (data['status'] == 'OK'){
                console.log("登录成功",data);
                $rootScope.login_status = true;
                var user = data['user'];
                $rootScope.user = user;
                localStorage.setItem('USER',JSON.stringify(user));
                $location.path('/recently/');
            }else{
                alert(data['info']);
            }
        });
    }
);


angular.module('chat').controller(
    'registerPageController',
    function registerPageController($scope, $rootScope, $http, socket, $location) {

        // 注册功能
        $rootScope.register = function(){
            var email = $scope.email;
            var nick = $scope.nick;
            var password = $scope.password;
            socket.emit('register',{'nick': nick,'email':email, 'password':password});
        };

        socket.on('register', function(data){
            console.log("发送注册请求...");
        });

        socket.on('register_response', function(data){
            if (data['status'] == 'OK'){
                console.log("注册成功",data);
                // 缓存用户的信息在前端
                $rootScope.login_status = true;
                var user = data['user'];
                $rootScope.user = user;
                localStorage.setItem('USER',JSON.stringify(user));
                $location.path('/recently/')
            }else{
                alert(data['info']);
            }
        });
    }
);


// 定义缓存相关的
app_router.factory('$cache', ['$window', function ($window) {
    return {        //存储单个属性
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        put: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
        },        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
        }
    }
}]);
