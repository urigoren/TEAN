app.controller("socket_test", function ($scope, socket) {
    socket.emit('test', {}, function (data) {
        $scope.test = data;
    });
});
