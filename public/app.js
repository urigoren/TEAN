/// <reference path="../.d.ts/angular.d.ts" />
var app = angular.module('app', ['ngRoute']);


app.config(function ($routeProvider) {
$routeProvider.when('/', {
templateUrl: 'app_views/home.html',
controller: 'home'
});
$routeProvider.when('/local', {
templateUrl: 'app_views/local.html',
controller: 'local'
});
$routeProvider.when('/remote', {
templateUrl: 'app_views/remote.html',
controller: 'remote'
});
$routeProvider.otherwise({ redirectTo: '/' });
});
app.service( 'api', function($http) {
this.sample={};
this.sample.echo=function (js_data,success_fn) {
return $http({
url: '/sample.echo?rand='+(''+Math.random()).replace('0.',''),
method: "POST",
data: json=js_data,
headers: {'Content-Type': 'application/json'}
}).success(function (json) {var data=angular.fromJson(json);success_fn(data);});
};
this.sample.add=function (js_data,success_fn) {
return $http({
url: '/sample.add?rand='+(''+Math.random()).replace('0.',''),
method: "POST",
data: json=js_data,
headers: {'Content-Type': 'application/json'}
}).success(function (json) {var data=angular.fromJson(json);success_fn(data);});
};
});

app.service( 'socket', function($rootScope) {
var socket=io.connect();
this.on= function (eventName, callback) {
socket.on(eventName, function () {  
var args = arguments;
$rootScope.$apply(function () {
callback.apply(socket, args);
});
});
socket.emit(eventName, data, function () {
var args = arguments;
$rootScope.$apply(function () {
if (callback) {
callback.apply(socket, args);
}
});
})
this.connect=function (msg,callback) {socket.emit('connect',msg,callback);};
this.test=function (msg,callback) {socket.emit('test',msg,callback);};
});

app.controller("home", function ($scope) {
    $scope.title = "Home";
});
app.controller("local", function ($scope) {
    $scope.model = {sample: "change me"};
    $scope.do_something = function () { alert ($scope.model.sample);};
});

/// <reference path="../.d.ts/api.d.ts" />
app.controller("remote", function ($scope, api) {
    $scope.model = {};
    $scope.model.param = "sample parameter";
    $scope.model.num1 = 1;
    $scope.model.num2 = 3;
    $scope.model.response = '';
    $scope.model.add_result = '';

    $scope.server_echo = function () {
        api.sample.echo($scope.model, function (data) {
            $scope.model.response = data;
        });
    };
    $scope.server_add = function () {
        api.sample.add($scope.model, function (data) {
            $scope.model.add_result = data;
        });
    };
});


app.controller("socket_test", function ($scope, socket) {
    socket.emit('test', {}, function (data) {
        $scope.test = data;
    });
});

