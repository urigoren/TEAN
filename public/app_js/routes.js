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
$routeProvider.when('/socket_test', {
templateUrl: 'app_views/socket_test.html',
controller: 'socket_test'
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
