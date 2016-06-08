
App.controller('IndexController', ['$scope', '$location','userService', function($scope, $location, userService) {
  var vm = this;
  vm.AppName = "Quantiam";


	/// Store the user object in the index controller, such that we can use it everywhere.
	function updateIndexUserObject (){
		
		
			 userService.refreshUser().then(function(r){
	
						$scope.user = userService.getstoredUser();

                 console.log($scope.user);
			
					
			 });
	}
		

	$scope.$on("updateIndexUserObject", function(){
			
			updateIndexUserObject ();
		
		});

	updateIndexUserObject ();
	
	
	
	/// Expanded Class Javascript Logics
	$scope.expanded = ""; //default close all "expanded"
  $scope.expandSidebar = function(){
    if ($scope.class === "expanded")
      $scope.class = "";
    else
      $scope.class = "expanded";
  };
	
	/// Logic for determining is something is active or not with respect to a route. 
	$scope.isActive = false;
	$scope.isActive = function (viewLocation) { 

			 if($location.path().indexOf(viewLocation) > -1) {
					return true;
				}
				else
				{
					return false;
				}
	
    };
	
	
	$scope.logout = function (){
			
			$scope.user = null;
			userService.logoutUser();
			
			}

	
	

}]);


App.controller('HomeController', ['$scope', function($scope) {
	
  var vm = this;
  vm.title = 'Dashboard';

	$scope.chartConfig = {

  options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be overriden by values specified below.
      chart: {
          type: 'bar'
      },
      tooltip: {
          style: {
              padding: 10,
              fontWeight: 'bold'
          }
      }
  },
  //The below properties are watched separately for changes.

  //Series object (optional) - a list of series using normal Highcharts series options.
  series: [{
     data: [10, 15, 12, 8, 7]
  }],
  //Title configuration (optional)
  title: {
     text: 'This is a test chart. '
  },
  //Boolean to control showing loading status on chart (optional)
  //Could be a string if you want to show specific loading text.
  loading: false,
  //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
  //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
  xAxis: {
  currentMin: 0,
  currentMax: 20,
  title: {text: 'values'}
  },
  //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
  useHighStocks: false,
  //size (optional) if left out the chart will default to size of the div or something sensible.
  size: {
   width: 400,
   height: 300
  },
  //function (optional)
  func: function (chart) {
   //setup some logic for the chart
  }
};
	
	
}]);


App.controller('AuthController', ['$scope', '$location', 'userService', function ($scope, $location, userService){

    $scope.authenticate = function() {
			userService.authenticateUser($scope.username,$scope.password).success(function(r){
				
			
				var lastPath = userService.getlastPath();
				console.log(lastPath);
				if(lastPath)
				{
					$location.path(lastPath);
				}
				else
				{
				$location.path('/dashboard');
				}
				
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

   };

       $scope.showRto = function (request_id) {
           $location.path('/rto/' + request_id);
       };

    $scope.getTable();



    $scope.addRto = function() {

       rtoService.addRto().then(function(r){

					 $scope.requestID = r.data.requestID;
					  $scope.showRto($scope.requestID);

					});


    }


}]);

App.controller('RtoViewController',
    ['$scope', '$stateParams', '$filter',  '$location', 'rtoViewService', 'userInfoService', 'userService', 'dateStringService', 'rtoApprovalService', 'emailService',
        function($scope,  $stateParams, $filter, $location, rtoViewService, userInfoService, userService, dateStringService, rtoApprovalService, emailService) {
  
  
	console.log($location.path());
	
		var request_id = $stateParams.rtoid;

    $scope.show_form = false;
    $scope.notifyloady = 0;

		$scope.rtoData = {};
		
		
		rtoViewService.rtoViewData(request_id).then(function(r){

			$scope.rtoData = r.data;
           // console.log($scope.rtoData.requested_time[0].date);
					 
			$scope.checkExistingAbsences();

				 userInfoService.getUserData($scope.rtoData.employeeID).then(function(r){

								$scope.userInfo = r.data;
								$scope.name = $scope.userInfo.firstname+' '+$scope.userInfo.lastname;
								
								
								
								userInfoService.QueryUserRtoBank($scope.rtoData.employeeID).then(function(r){
									
									$scope.bankTotals = userInfoService.getUserRtoBank();
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
							$scope.checkExistingAbsences();

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
							$scope.checkExistingAbsences();

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
						$scope.checkExistingAbsences();
       }


    };

		$scope.approveRto = function(approval)
    {
        $scope.click = true;

        $scope.user = userService.getstoredUser();
        var params = {
            "requestID": $scope.rtoData.requestID,
            "approval": approval,
        }

        rtoApprovalService.approve(params).success(function(r) {
            console.log(r);
            $scope.rtoData.approvals.push(r);
            $scope.rtoData.status = (r.check);

        }).error(function(e) {

            toastr.error('Approval Failed');
        });

    };


    $scope.removeApproval = function(approvalID, index)
    {
        $scope.click = false;
        rtoApprovalService.remove(approvalID).success(function(r) {
            $scope.rtoData.approvals.splice(index, 1);
            $scope.rtoData.status = (r);

        }).error(function(e) {

            toastr.error('Deletion Failed: ');

        });
    };

    $scope.deleteRto = function() {

            rtoViewService.deleteRto($scope.rtoData.requestID).success(function (r) {
                console.log($scope.rtoData.requestID);
                console.log(r);
                history.go(-1);

            }).error(function (e) {

                console.log(e);
            })
        };


    $scope.editNotification = function () {


        $scope.notifyloady = 1;
        emailService.sendEditNotification($scope.rtoData.employeeID, $scope.user.name).success(function(r) {

            console.log(r);
            toastr.success('Request modified');
            $scope.notifyloady=0;

        }).error(function(e) {

            toastr.error('Could not edit request');
            $scope.notifyloady=0;

        })
    }

            
    $scope.emailSupervisor = function()
    {
        $scope.notifyloady = 1;
        emailService.sendRtoNotification($scope.supervisorID, $scope.user.name).success(function(r) {
            console.log(r);
            toastr.success('Notification Sent');
            $scope.notifyloady = 0;
        }).error(function(e) {
            toastr.error('Email Notification Failed');
            $scope.notifyloady = 0;
        });
    }


		$scope.popup1 = {
				opened: false
		};


		$scope.open1 = function() {
				$scope.popup1.opened = true;
		};

		$scope.isEmptyObject = function(obj) {
    /* logic of your choosing here */
				return Object.keys(obj).length; 
		};
		
		
		$scope.showExistingAbsences = false;
		$scope.existingAbsencesObject = {};
		
		$scope.checkExistingAbsences = function()
		{
			var dateArray = [];
			
		
			for (var i = 0; i < $scope.rtoData.requested_time.length; i++) {
				
				dateArray.push($scope.rtoData.requested_time[i].date);
			}
			
					rtoViewService.refreshRtoExistingAbsencesObject(dateArray).success(function(r){
				
					$scope.existingAbsencesObject = r;

				
				});
		
		
		}
		
		
		
}]);




App.controller('NewRtoController', ['$scope', '$stateParams', function($scope, $stateParams) {

    console.log($stateParams);


}]);



App.controller('CommentsController', function($scope) {
	
		$scope.comments;
	
		$scope.fetchComments = function () {
			
			$scope.comments = ['comment1', 'comment2'];
			console.log('runs');
		//	return 'things and stuff';
			
			}
	
		//run on intiatilizatiopn
		
		$scope.fetchComments();
	
	

});


