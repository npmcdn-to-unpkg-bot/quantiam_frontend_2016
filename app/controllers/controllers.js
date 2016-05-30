
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


App.controller('AuthController', ['$scope', 'userService', function ($scope, userService){
	
    $scope.authenticate = function() {
				if(userService.authenticateUser($scope.username,$scope.password))
				{
					$(location).attr('href', '#/dashboard');
				}
    };
	
	
	}]);

	
	
	
	
	
	
	
	
	


App.controller('RtoController', ['$scope', 'rtoService', function($scope, rtoService) {
  var vm = this;

  vm.title="www";

  //  console.log(rtoService);
   vm.rtoList = rtoService.rtoList();
    vm.rtoData = vm.rtoList.data;




    $(document).ready(function() {
        $('#example').DataTable( {
            "ajax": vm.rtoList.data
        } );
    } );
console.log(vm.rtoList.data);




}]);

App.controller('RtoViewController', function($scope, $routeParams) {
    console.log($routeParams);
})
