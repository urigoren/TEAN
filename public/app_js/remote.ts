/// <reference path="../../.d.ts/api.d.ts" />
app.controller("remote", function ($scope, api:i_api) {
    $scope.model = {};
    $scope.model.param = "sample parameter";
    $scope.model.num1 = 1;
    $scope.model.num2 = 3;
    $scope.model.response = '';
    $scope.model.add_result = '';

    $scope.server_echo = function () {
        api.sample.echo(
				$scope.model,
				function (data)
				{ $scope.model.response = data; }
					);
    }
    $scope.server_add = function () {
        api.sample.add(
				$scope.model,
				function (data)
				{ $scope.model.add_result = data; }
					);
    }
});
