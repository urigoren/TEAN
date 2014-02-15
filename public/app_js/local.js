app.controller("local", function ($scope) {
    $scope.model = {sample: "change me"};
    $scope.do_something = function () { alert ($scope.model.sample);};
});
