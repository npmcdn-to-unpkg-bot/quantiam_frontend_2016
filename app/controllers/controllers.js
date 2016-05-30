
App.controller('IndexController', ['$scope', function($scope) {
  var vm = this;

  vm.AppName = "Index";

  vm.body = {};

  vm.body.title = "Thing";




}]);


App.controller('HomeController', ['$scope', function($scope) {
  var vm = this;


  vm.title = 'Dashboard';

}]);



App.controller('RtoController', ['$scope', '$location', 'rtoService', function($scope, $location, rtoService) {


  //  console.log(rtoService);
   $scope.rtoList = rtoService.rtoList();
    $scope.rtoData = $scope.rtoList.data;



   setTimeout(function() {
       $('#rtotable').DataTable(
           {
               "order": [[2, "desc"]]
           }
       );
   }, 0);

    $scope.showRto = function(request_id) {
        $location.path('/rto/' + request_id);
        console.log($location.path);
    };




}]);

App.controller('RtoViewController', function($scope, $routeParams) {
    console.log($routeParams);
})
