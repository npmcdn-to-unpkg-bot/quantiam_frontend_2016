
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



   setTimeout(function() {
       $('#rtotable').DataTable(
           {
               "order": [[3, "desc"], [2, "desc"]]
           }
       );
   }, 0);

    $scope.showRto = function(request_id) {
        $location.path('/rto/' + request_id);
    };




}]);

App.controller('RtoViewController', ['$scope', 'rtoViewService', 'userInfoService', '$routeParams',  function($scope, rtoViewService, userInfoService, $routeParams) {

    var request_id = $routeParams.rtoid;

    $scope.rtoData = rtoViewService.rtoViewData(request_id);
    
    $scope.userInfo = userInfoService.getUserData($scope.rtoData.employeeID);
    $scope.name = $scope.userInfo.firstname+' '+$scope.userInfo.lastname;


    setTimeout(function() {
        $('#rtotable').DataTable(
            {
                "order": [[4, "desc" ]],
                "searching": false,
                "paging": false,
                "info": false
            }
        );
        $('#approvaltable').DataTable(
            {
                "oder": [[4, "desc"]],
                "searching": false,
                "paging": false,
                "info": false
            }
        );
    }, 0);



}])
