/**
 * Created by cpetrone on 23/06/2016.
 */

App.controller('slipcastController', ['$scope',  function($scope) {

    $scope.positions = [1, 2, 3, 4, 5];

    $scope.slipcast = {};
    $scope.slipcast.name = 'QMSC-';

    $scope.test = function()
    {
        console.log('test');

        $scope.slipcast.name = "QMSC-" + $scope.slipcast.id;
        console.log($scope.slipcast.name);
    }

    $scope.test2 = function()
    {
        console.log('dog');
    }
}]);