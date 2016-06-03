
App.controller('IndexController', ['$scope', '$location','userService', function($scope, $location, userService) {
  var vm = this;
	
	$scope.isActive = false;
  vm.AppName = "Quantiam";

	
	
	
	function updateIndexUserObject (){
		
		
			 userService.refreshUser().then(function(r){
	
						$scope.user = userService.getstoredUser();

                 console.log($scope.user);
			
					
			 });
	}
		
		$scope.isActive = function (viewLocation) { 
	return viewLocation === $location.path();
    };
	
	
	$scope.$on("updateIndexUserObject", function(){
			
			updateIndexUserObject ();
		
		});

	updateIndexUserObject ();
	

}]);


App.controller('HomeController', ['$scope', function($scope) {
  var vm = this;
  vm.title = 'Dashboard';

}]);


App.controller('AuthController', ['$scope', 'userService', function ($scope, userService){

    $scope.authenticate = function() {
			userService.authenticateUser($scope.username,$scope.password).success(function(r){
				
									$(location).attr('href', '#/dashboard');
				}).error(function(e){
				
					toastr.error('Your username or password are incorrect.', 'Authentication Error');
				
				});
		
    };


	}]);


App.controller('RtoController', ['$scope', '$location', 'rtoService', function($scope, $location, rtoService) {


    $scope.rtoTable = {};


   $scope.getTable = function () {

        rtoService.rtoList().success(function(r){

						$scope.rtoList = r;
						 $scope.rtoData = $scope.rtoList.data;

				 });


     /*
       setTimeout(function () {


           $scope.rtoTable = $('#rtotable').DataTable(
                                   {
                                       "order": [[3, "desc"], [2, "desc"]]
                                   }
                               );
                           }, 0);  */
   };

       $scope.showRto = function (request_id) {
           $location.path('/rto/' + request_id);
       };

    $scope.getTable();



    $scope.addRto = function() {
    // console.log('test');

       rtoService.addRto().then(function(r){

					 $scope.results = r;
					  $scope.showRto($scope.results.requestID);

					});


    }



}]);

App.controller('RtoViewController',
    ['$scope', '$stateParams', '$filter', 'rtoViewService', 'userInfoService', 'userService', 'dateStringService', 'rtoApprovalService',
        function($scope,  $stateParams, $filter, rtoViewService, userInfoService, userService, dateStringService, rtoApprovalService) {
    var request_id = $stateParams.rtoid;

    $scope.show_form = false;

		rtoViewService.rtoViewData(request_id).then(function(r){

			$scope.rtoData = r.data;
            console.log($scope.rtoData.requested_time[0].date);

				 userInfoService.getUserData($scope.rtoData.employeeID).then(function(r){

								$scope.userInfo = r.data;
								$scope.name = $scope.userInfo.firstname+' '+$scope.userInfo.lastname;
								userInfoService.QueryUserRtoBank($scope.rtoData.employeeID).then(function(r){
									
									$scope.bankTotals = userInfoService.getUserRtoBank();
									console.log($scope.bankTotals);
									calculate_BankTotalsDifference ();

                                    $scope.user = userService.getstoredUser();

									
									});
					
					
				
					
					});

   	});

function calculate_BankTotalsDifference (){
			
			var requestedTime = {};
			var resultTime = {};

		
			
			for (var i = 0; i < $scope.rtoData.requested_time.length; i++) {
				
				if(!requestedTime[$scope.rtoData.requested_time[i].type])
				{
				requestedTime[$scope.rtoData.requested_time[i].type] = $scope.rtoData.requested_time[i].hours;
				}
				else
				{
					requestedTime[$scope.rtoData.requested_time[i].type] = requestedTime[$scope.rtoData.requested_time[i].type] + $scope.rtoData.requested_time[i].hours;
				}

			}
			
			//compare 
			
			for (var key in $scope.bankTotals.remaining )
			{
					if(requestedTime[key])
					{
					resultTime[key] = $scope.bankTotals.remaining[key] - requestedTime[key];
					}
					else
					{
						resultTime[key] = $scope.bankTotals.remaining[key];
					}
				
			}
			
		
			
			$scope.requestedTime = requestedTime;
			$scope.resultTime = resultTime;
			
}
		
		

        $scope.viewTables = function () {

        };

    $scope.postRtotime = function() {
        var params = {
            "hours": $scope.hours,
            "type": $scope.type,
            "date": dateStringService.dateToString($scope.date),

        };

        rtoViewService.postRtotime(params,request_id).success(function(r){


             $scope.rtoData.requested_time.push(r);
						 	calculate_BankTotalsDifference ();

        }).error(function(e){

            toastr.error('Failed to create RTO', 'Authentication Error');
        });



    };

    $scope.editRtotime = function()
    {
        var params = {
            "rtotimeID": $scope.rtotimeID,
            "hours": $scope.hours,
            "type": $scope.type,
            "date": dateStringService.dateToString($scope.date),
        };

        rtoViewService.putRtotime(params).success(function(r) {

            $scope.rtoData.requested_time.splice($scope.index, 1, r);
							calculate_BankTotalsDifference ();

        }).error(function(e) {

            toastr.error('Failed to update RTO');
        });



    /*    $scope.rtoData.requested_time.splice($scope.index, 0, rtoViewService.putRtotime(params));
        $scope.rtoData.requested_time.splice($scope.index, 1);*/
    };


    $scope.newForm = function(){

        $scope.show_form = true;
            $scope.formTitle = 'Create New RTO';
            $scope.formMode = 'new';

        //clear fields
            $scope.hours ="";
            $scope.type = null;
            $scope.date="";


    };


    $scope.editForm = function(rtotime_id, index){
        $scope.rtotime = $scope.rtoData.requested_time;

        // Set object to accurate rtotime table values.
       for (i = 0; i < $scope.rtotime.length; i++)
       {
           if ($scope.rtotime[i].rtotimeID == rtotime_id)
           {
               $scope.rtotime = $scope.rtotime[i];
           }
       }
        //set values to pop up in tables.


            var s = $scope.rtotime.date.split('-');


            $scope.hours = $scope.rtotime.hours;
            $scope.type = $scope.rtotime.type;
            $scope.date = new Date(Number(s[0]),Number(s[1]) -1 ,Number(s[2]));
            $scope.rtotimeID = $scope.rtotime.rtotimeID;
            $scope.index = index;

        $scope.show_form = true;
            $scope.formTitle = 'Edit Existing RTO';
            $scope.formMode = 'edit';

    };
    $scope.deleteForm = function(rtotime_id, index){

       if(rtoViewService.deleteRtotime(rtotime_id)) {

           $scope.rtoData.requested_time.splice(index, 1);
					 	calculate_BankTotalsDifference ();
       }


    };

    $scope.approveRto = function(approval) {

        $scope.user = userService.getstoredUser();
        console.log($scope.user);
        var params = {
            "requestID": $scope.rtoData.requestID,
            "approval": approval,
        }

        rtoApprovalService.approve(params).success(function(r) {
            console.log($scope.user);
            $scope.rtoData.approvals.push(r);
            $scope.rtoData.status = (r.check);

        }).error(function(e) {

            toastr.error('Approval Failed');
        });

    };


    $scope.removeApproval = function(approvalID, index)
    {
        
        rtoApprovalService.remove(approvalID).success(function(r) {
            $scope.rtoData.approvals.splice(index, 1);
            $scope.rtoData.status = (r);

        }).error(function(e) {

            toastr.error('Deletion Failed');

        });
    };

    //loop through all requests

    //#scopeshow_form = false;

            $scope.popup1 = {
                opened: false
            };


            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };


}]);




App.controller('NewRtoController', ['$scope', '$stateParams', function($scope, $stateParams) {

    console.log($stateParams);


}]);


