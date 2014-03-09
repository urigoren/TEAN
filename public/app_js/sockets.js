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
