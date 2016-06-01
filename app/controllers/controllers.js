
App.controller('IndexController', ['$scope', '$location','userService', function($scope, $location, userService) {
  var vm = this;

  vm.AppName = "Quantiam";

  vm.body = {};

  vm.body.title = "Thing";
	
	$scope.user = userService.refreshUser();
	console.log($scope.user);
	
	
	$scope.isActive = false;
	
$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
	

}]);


App.controller('HomeController', ['$scope', function($scope) {
  var vm = this;
  vm.title = 'Dashboard';

}]);


App.controller('AuthController', ['$scope', 'userService', function ($scope, userService){
	
    $scope.authenticate = function() {
				if(userService.authenticateUser($scope.username,$scope.password))
				{
					//broadcast an event to update the controller. 
					$(location).attr('href', '#/dashboard');
				}
				else
				{
					toastr.error('Your username or password are incorrect.', 'Authentication Error');
				}
    };
	
	
	}]);


App.controller('RtoController', ['$scope', '$location', 'rtoService', function($scope, $location, rtoService) {


    $scope.rtoTable = {};


   $scope.getTable = function () {

       $scope.rtoList = rtoService.rtoList();
       $scope.rtoData = $scope.rtoList.data;

       
       setTimeout(function () {


           $scope.rtoTable = $('#rtotable').DataTable(
                                   {
                                       "order": [[3, "desc"], [2, "desc"]]
                                   }
                               );
                           }, 0);
   };

       $scope.showRto = function (request_id) {
           $location.path('/rto/' + request_id);
       };

    $scope.getTable();

    $scope.addRto = function() {
    // console.log('test');
        
        $scope.results = rtoService.addRto();

        $scope.showRto($scope.results.requestID);
    }



}]);

App.controller('RtoViewController', ['$scope', '$stateParams', '$filter', 'rtoViewService', 'userInfoService', function($scope,  $stateParams, $filter, rtoViewService, userInfoService) {
    var request_id = $stateParams.rtoid;

    $scope.show_form = false;

    $scope.rtoData = rtoViewService.rtoViewData(request_id);

    $scope.userInfo = userInfoService.getUserData($scope.rtoData.employeeID);
    $scope.name = $scope.userInfo.firstname+' '+$scope.userInfo.lastname;


        $scope.viewTables = function () {
            setTimeout(function () {


        /*        $scope.rtoTable = $('#rtotable').DataTable(
                    {
                        "order": [[4, "desc"]],
                        "searching": false,
                        "paging": false,
                        "info": false
                    }
                );

                $scope.approvalTable = $('#approvaltable').DataTable(
                    {
                        "oder": [[4, "desc"]],
                        "searching": false,
                        "paging": false,
                        "info": false
                    }
                );

                $scope.formtable = $('#formtable').DataTable(
                    {
                        "searching": false,
                        "paging": false,
                        "info": false
                    }
                );*/



            }, 0);
        };







    $scope.viewTables();

    $scope.postRtotime = function() {

        var params = {
            "hours": $scope.hours,
            "type": $scope.type,
            "date": "2016-01-01"

        };
       $scope.rtoData.requested_time.push(rtoViewService.postRtotime(params,request_id));

    }


    $scope.newForm = function(){

        $scope.show_form = true;
        $scope.formMode = 'Create New RTO';

        //clear fields
        $scope.hours ="";
        $scope.type = null;
        $scope.date="";


    }


    $scope.editForm = function(rtotime_id, $filter){

        $scope.rtotime = $scope.rtoData.requested_time;

        // Set object to accurate rtotime table values.
       for (i = 0; i < $scope.rtotime.length; i++)
       {
           if ($scope.rtotime[i].rtotimeID == rtotime_id)
           {
               $scope.rtotime = $scope.rtotime[i];
           }
       }
        console.log($scope.rtotime.date);
        //set values to pop up in tables.
        $scope.hours = $scope.rtotime.hours;
        $scope.type = $scope.rtotime.type;
        $scope.date=new Date($scope.rtotime.date);

        $scope.show_form = true;
        $scope.formMode = 'Edit Existing RTO';

    }
    $scope.deleteForm = function(rtotime_id, index){
        console.log('deleted' + rtotime_id);
        console.log(index);
       if(rtoViewService.deleteRtotime(rtotime_id)) {

           $scope.rtoData.requested_time.splice(index, 1);
       }

        
    }

//    $scope.submittTimeoff();


    //loop through all requests

    //#scopeshow_form = false;










}]);

App.controller('NewRtoController', ['$scope', '$stateParams', function($scope, $stateParams) {

    console.log($stateParams);


}]);
