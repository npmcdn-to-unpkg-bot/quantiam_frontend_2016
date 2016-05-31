
App.controller('IndexController', ['$scope', 'userService', function($scope, userService) {
  var vm = this;

  vm.AppName = "Quantiam";

  vm.body = {};

  vm.body.title = "Thing";
	
	userService.refreshUser();

}]);


App.controller('HomeController', ['$scope', function($scope) {
  var vm = this;


  vm.title = 'Dashboard';

}]);


App.controller('AuthController', ['$scope', 'userService', function ($scope, userService){
	
    $scope.authenticate = function() {
				if(userService.authenticateUser($scope.username,$scope.password))
				{
					$(location).attr('href', '#/dashboard');
				}
				else
				{
					toastr.error('Your username or password are incorrect.', 'Authentication Error');
				}
    };
	
	
	}]);


App.controller('RtoController', ['$scope', '$location', 'rtoService', function($scope, $location, rtoService) {


  //  console.log(rtoService);
		$scope.rtoList = rtoService.rtoList();
    $scope.rtoData = $scope.rtoList.data;



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

App.controller('RtoViewController', ['$scope', '$stateParams',  'rtoViewService', 'userInfoService',  function($scope,  $stateParams, rtoViewService, userInfoService) {
    var request_id = $stateParams.rtoid;

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
