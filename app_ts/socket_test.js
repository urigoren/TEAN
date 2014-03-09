app.controller("socket_test", function ($scope, socket) {
    $scope.model = { test: 'none' };
    socket.emit('test', {}, function (data) {
        $scope.model.test = data;
    });
});
