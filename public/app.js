var app = angular.module('app',['ngRoute']);
app.config(function ($routeProvider) {
$routeProvider.otherwise({ redirectTo: '/' });
});
app.service( 'api', function($http) {
this.user='';
this.user.index=function (js_data,success_fn) {
$http({
url: '/user.index',
method: "POST",
data: json=js_data,
headers: {'Content-Type': 'application/json'}
}).success(function (json) {var data=angular.fromJson(json);success_fn(data);});
};
});
