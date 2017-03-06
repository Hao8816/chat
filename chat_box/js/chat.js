// 配置页面路由 'chat'
var app_router = angular.module( 'chat' , ['ngRoute']).run(function($rootScope) {
    $rootScope.screenH = document.documentElement.clientHeight;
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
    function recentlyPageController($scope, $rootScope, $http) {

        $rootScope.link_index = 1;


    }
);

angular.module('chat').controller(
    'contactsPageController',
    function contactsPageController($scope, $rootScope, $http) {
        $rootScope.link_index = 2;

    }
);

angular.module('chat').controller(
    'settingsPageController',
    function settingsPageController($scope, $rootScope, $http) {
        $rootScope.link_index = 3;

    }
);
