App.controller('IndexController', ['$scope', '$location','user','select2request', function($scope, $location, user,select2request ) {
  var vm = this;
	vm.memubar_visible = false;
	vm.expandedsidebarstate = false;
	
	$scope.select2request = select2request;
	
	
	vm.menubarHover = function()
	{
		vm.memubar_visible = true;
	}
	
		vm.menubarLeave = function()
	{
		vm.memubar_visible = false;
	}
	
	
	
  $scope.AppName = "Quantiam";

	
	$scope.getID = function (string)
	{
		var res = string.split("-");
		return res[1];
		
	}
	
	
 $scope.getNumber = function(num) {
		 return new Array(num);   
		 }
	
	
	$scope.humanize = function (str) {
		var frags = str.split('_');
		for (i=0; i<frags.length; i++) {
			frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
		}
		return frags.join(' ');
	}

	/// Store the user object in the index controller, such that we can use it everywhere.
	function updateIndexUserObject (){
		
		
			 user.refreshUser().then(function(r){
	
						$scope.user = user;
				
			 });
	}
	

	$scope.$on("updateIndexUserObject", function(){
			
			updateIndexUserObject ();
		
		});

	updateIndexUserObject ();
	
	
	
	/// Expanded Class Javascript Logics
	

	 vm.expandSidebar = function(){
    if (vm.expandedsidebarstate == true)
      vm.expandedsidebarstate = false;
    else
     vm.expandedsidebarstate = true;
  };
	
	$scope.expanded = ""; //default close all "expanded" menu elements
	
	
  $scope.expandSidebarMenuItem = function(lastSelectedSidebar){
	
	
	$scope.lastSelectedSidebar = lastSelectedSidebar.currentTarget.childNodes[3].innerText;

	
  };
	
	$scope.isLastSelectedSidebar = function (value){

			if($scope.lastSelectedSidebar == value)
			{
		
				return true;
			}
			else
			{
				return false;
			}
		
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
			user.logoutUser();
			
			}

			
	$scope.checkIfGroupMember = function (groupID){
		
		//console.log(groupID);
		//console.log(user.checkIfUserGroupMember(groupID));
		return user.checkIfUserGroupMember(groupID);
		
		}
		

	

}]);


App.controller('HomeController', ['$scope', function($scope) {
	
  var vm = this;
  vm.title = 'Dashboard';


	
}]);

App.controller('RtoController', function($scope,$location, $filter, dtRequest, apiRequest, DTColumnBuilder, rtoService) {
    var vm = this;

    vm.statusOptions = ['approved', 'pending', 'denied'];

    vm.rowClickHandler = function (info) {

        $location.path('/rto/' + info.requestID);


        $scope.$apply(); //must be used when being called outside of the angualr scope, does nothign otherwise.

    };

    vm.updateTable = function() {
        vm.getdtTable();
    };

    vm.getdtTable = function () {

        if (vm.startdate && vm.enddate)
        {

            vm.startdateConversion = new moment(vm.startdate).format('YYYY-MM-DD');
            vm.enddateConversion = new moment(vm.enddate).format('YYYY-MM-DD');

        }



        var customOptions = {

            'created' : vm.created,
            'status' : vm.status,
            'employeeID' : vm.employeeID,
            'startdate' : vm.startdateConversion,
            'enddate' : vm.enddateConversion,

        };


        //what columns do we want to show?
       var dtColumns = [

           DTColumnBuilder.newColumn('requestID').withTitle('ID').renderWith(function(data, type, full) {
               return '<b>' + full.requestID + '</b>';
           }),

            DTColumnBuilder.newColumn('lastname').withTitle('Name').renderWith(function(data, type, full) {

                return '<b>' + full.firstname +' ' + full.lastname + '</b>';
            }),

           DTColumnBuilder.newColumn('employeeID').withOption('type', 'num').withTitle('Employee ID'),

            DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(function(data, type, full) {
                if (full.status == 'denied')
                {
                    return '<span class="btn btn-block ink-reaction btn-flat btn-danger">Denied</span>';
                }
                else if (full.status == 'approved')
                {
                    return '<span class="btn btn-block ink-reaction btn-flat btn-success">Approved</span>';

                }
                else
                {
                    return '<span class="btn btn-block ink-reaction btn-flat btn-warning">Pending</span>';

                }
            }),
            DTColumnBuilder.newColumn('time').withTitle('Hours').renderWith(function(data, type, full)
            {
                //return new moment(full.created).format('MMMM Do, YYYY') + ' at ' + new moment(full.datetime).format('h:mm a');

                    vm.sumhours = [];
                    vm.sumhours['pto'] = 0;
                    vm.sumhours['vacation'] = 0 ;
                    vm.sumhours['unpaid'] = 0;
                    vm.sumhours['cto'] = 0;

                    angular.forEach(full.time, function(time) {

                        vm.sumhours[time.type] = vm.sumhours[time.type] + time.hours;

                    });

                    var htmlTable = '<table style="background: inherit; opacity: inherit; height: 35px; padding: 5px; padding-left:25px"> <thead> <td>PTO</td> <td>Vacation</td> <td>Unpaid</td> <td>CTO</td> </thead>' +
                                     '<tbody"> <tr style="text-align: center"><td>' + vm.sumhours['pto'] + '</td>' +
                                     '<td>' + vm.sumhours['vacation'] + '</td>' +
                                     '<td>' + vm.sumhours['unpaid'] + '</td>' +
                                     '<td>' + vm.sumhours['cto'] + '</td></tr></tbody></table>';



                    return  htmlTable;
            }),
           DTColumnBuilder.newColumn('time').withTitle('Dates').renderWith(function(data, type, full)
           {
               vm.dateList = [];

               angular.forEach(full.time, function(time) {
                   vm.dateList.push(' ' + new moment(time.date).format('MMM D'));
               });

               return vm.dateList;
           })


        ];


        vm.dtTable = dtRequest.build_dtOptions('rto/data/list', dtColumns, customOptions, vm, 'rowClickHandler'); //query endpoint for datables response



    };

    $scope.$watch('response.headers', function() {

        console.log(vm.dtTable);
    }, true);


    vm.getdtTable();



    vm.addRto = function() {

        rtoService.addRto().success(function(r)
        {
            console.log(r);
            $location.path('/rto/' + r.requestID);

        })


    }


});


App.controller('AuthController', ['$scope', '$location', 'user', function ($scope, $location, user){

    $scope.authenticate = function() {
			user.authenticateUser($scope.username,$scope.password).success(function(r){
				
			
				var lastPath = user.getlastPath();
			
				if(lastPath && lastPath != '/login')
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


App.controller('RtoDeprecatedController', ['$scope', '$location', 'rtoService', 'DTOptionsBuilder', 'DTColumnDefBuilder', function($scope, $location, rtoService, DTOptionsBuilder, DTColumnDefBuilder) {


		var vm = this;
		vm.pendingTable = {};
    vm.archiveTable = {};


    vm.archiveTable.dtOptions = {
        "order": [2, 'desc'],
    };

   $scope.getTable = function () {

        rtoService.rtoList().success(function(r){

						$scope.rtoList = r;

				 });

   };

       $scope.showRto = function (request_id) {
           $location.path('/rto/' + request_id);
       };

    $scope.getTable();
		
		
		console.log(DTOptionsBuilder.newOptions().withOption());
		 
    vm.pendingTable.dtOptions = {
			
			"order": []
			
			};
    
     
    vm.pendingTable.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
    //    DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
		



    $scope.addRto = function() {

       rtoService.addRto().then(function(r){

					 $scope.requestID = r.data.requestID;
					  $scope.showRto($scope.requestID);

					});


    }


}]);

App.controller('RtoViewController',['$scope', '$stateParams', '$filter',  '$location', 'rtoViewService', 'userInfoService', 'user', 'dateStringService', 'rtoApprovalService', 'emailService', 'apiRequest',
       
			 
			 
			 function($scope,  $stateParams, $filter, $location, rtoViewService, userInfoService, user, dateStringService, rtoApprovalService, emailService, apiRequest) {
  
        $scope.$on("$locationChangeStart", function() {
           // console.log('this is how you do functions on leaving page.');
        });

            // /console.log($location.path());
	
		var request_id = $stateParams.rtoid;

    $scope.show_form = false;
    $scope.notifyloady = 0;

		$scope.rtoData = {};

		
		
		rtoViewService.rtoViewData(request_id).then(function(r){

			$scope.rtoData = r.data;
					 
			$scope.checkExistingAbsences();

			if(!$scope.holidays)
			{
				
				apiRequest.send('get', '/timesheet/holidaylist', null).then(function(r){
				
				$scope.holidays = r.data;
		
				
				});
						
			}
			
			
			
				 userInfoService.getUserData($scope.rtoData.employeeID).then(function(r){

								$scope.userInfo = r.data;
								$scope.name = $scope.userInfo.firstname+' '+$scope.userInfo.lastname;
								
								
								
								userInfoService.QueryUserRtoBank($scope.rtoData.employeeID).then(function(r){
									
									$scope.bankTotals = userInfoService.getUserRtoBank();
									calculate_BankTotalsDifference ();
									checkHolidays ();

                                    $scope.user = user;

									
									});
					
					
				
					
					});

   	});
		
function checkHolidays ()
{
	for (var i = 0; i < $scope.rtoData.requested_time.length; i++) {
				$scope.holidays.forEach( function (holiday)
				{
					
					if($scope.rtoData.requested_time[i].date == holiday.date)
					{
								$scope.rtoData.requested_time[i].holiday = 1;
					}
					
				});
	}
	
	
	
}

function calculate_BankTotalsDifference (){
			
			var vm = this;
			
			var requestedTime = {};
			var resultTime = {};

		console.log($scope.bankTotals);
			
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
            "date": dateStringService.dateToString($scope.date)

        };

        if (params.type == 'vacation')
        {
           if (params.hours != 8 && params.hours != -8)
           {
               toastr.error('Vacation must be in increments of 8 hours', 'Error');
               return;
           }
        }


        rtoViewService.postRtotime(params,request_id).success(function(r){


             $scope.rtoData.requested_time.push(r);
						 	calculate_BankTotalsDifference ();
							$scope.checkExistingAbsences();
							checkHolidays ();

            if ($scope.rtoData.employeeID != $scope.user.employeeID)
            {
                $scope.editNotification();
            }


        }).error(function(e){

            toastr.error('Failed to create RTO');
        });

    };

    $scope.editRtotime = function()
    {
        var params = {
            "rtotimeID": $scope.rtotimeID,
            "hours": $scope.hours,
            "type": $scope.type,
            "date": dateStringService.dateToString($scope.date)
        };


        if (params.type == 'vacation')
        {
            if (params.hours != 8 && params.hours != -8)
            {
                toastr.error('Vacation must be in increments of 8 hours', 'Error');
                return;
            }
        }


        rtoViewService.putRtotime(params).success(function(r) {

            $scope.rtoData.requested_time.splice($scope.index, 1, r);
							calculate_BankTotalsDifference ();
							$scope.checkExistingAbsences();
								checkHolidays ();
							
							
            if ($scope.rtoData.employeeID != vm.user.employeeID)
            {
                $scope.editNotification();
            }


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

        var params = {
            "requestID": $scope.rtoData.requestID,
            "approval": approval
        };

        rtoApprovalService.approve(params).success(function(r) {
            console.log(r);
            $scope.rtoData.approvals.push(r);
            $scope.rtoData.status = (r.check);

            toastr.success('Approval Posted', 'Success');

        }).error(function(e) {

            toastr.error('Approval Failed', 'Error');
        });

    };


    $scope.removeApproval = function(approvalID, index)
    {
        $scope.click = false;
        rtoApprovalService.remove(approvalID).success(function(r) {
            $scope.rtoData.approvals.splice(index, 1);
            $scope.rtoData.status = (r);

            toastr.success('Approval Deleted', 'Success');

        }).error(function(e) {

            toastr.error('Deletion Failed: ');

        });
    };

    $scope.deleteRto = function() {

            rtoViewService.deleteRto($scope.rtoData.requestID).success(function (r) {

                toastr.success("RTO " + $scope.rtoData.requestID + " deleted successfully.");
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
        console.log($scope.supervisorID);
        $scope.notifyloady = 1;

        // Build date table.
        var dates = [];
        angular.forEach($scope.rtoData.requested_time, function(data) {

            var date = "<tr><td>" + new moment(data.date).format('MMMM Do, YYYY') + "</td><td>"+data.hours+" hrs</td></tr>";

            dates.push(date);
        });

        dates = "<table>" +
                     "<th>Dates Requested</th><th></th><th></th>" +
                 "<tbody>"
                         + dates +
            "</tbody></table>";


        var params = {
            "subject": "New Time Off Request from "+$scope.user.name+" Awaiting Your Approval",
            "body":  "<p>" + $scope.user.name + " has an absence request pending your approval. <a href='"+document.location.href+"'> Click here to view time-off request.</a></p>" + dates,
            "recipientID": $scope.supervisorID,
        };

        apiRequest.send('post', '/mail/send', params).success(function(r) {
           toastr.success('Email Sent');
            $scope.notifyloady = 0;
            console.log(r);
        }).error(function(e){
            $scope.notifyloady = 0;
            toastr.error('Failed to notify supervisor.');
          console.log(e);

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

App.controller('usersController', ['$scope', '$rootScope', '$location', '$stateParams', 'userInfoService', 'DTOptionsBuilder', 'apiRequest', 'dateStringService', function ($scope, $rootScope, $location, $stateParams, userInfoService, DTOptionsBuilder, apiRequest, dateStringService) {

    $scope.userInfoInput ={};
    $scope.groupList = {};

    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    var textInputs = ['employeeid', 'prefix', 'firstname', 'lastname', 'title'];
    var selectInputs = ['compensation'];
    var dateInputs = ['birthdate', 'startdate', 'leavedate'];

    $scope.isText = function(keyName)
    {
       return (textInputs.indexOf(keyName) > -1);
    }

    $scope.isDate = function (keyName)
    {
        return (dateInputs.indexOf(keyName) > -1);
    }

    $scope.isSelect = function (keyName)
    {
        $scope.compSelect= [
            'Salary',
            'Hourly',
            'Temporary'
        ];
        return (selectInputs.indexOf(keyName) > -1);
    }

    
    $scope.editUserInfo = function(email, key)
    {
        if ($scope.isDate(key))
        {
            $scope.userInfoInput.input = dateStringService.dateToString($scope.userInfoInput.input);
        }


        var params = {
            "email": email,
            "key": key,
            "value": $scope.userInfoInput.input,
        };
        console.log(params);
        userInfoService.editUserInfo(params).success(function(r) {
            toastr.success('good job');
            if (params.key == 'employeeid')
            {
                $location.path('/user/' + params.value);
            }
        }).error(function(e) {
            toastr.error(e);
        })
    };

    $scope.userData = {};

    userInfoService.getUsers().then(function(r) {

        $scope.userData = r.data;
        $scope.dtOptions = {
            order: [],
        };
    });

    $scope.showUserInfo = function(employeeID) {
        $location.path('/user/' + employeeID);
        console.log('click');
    }


    $scope.bracket = function(tag)
    {
        if (tag)
        {
            return " (" + tag + ") ";
        }
        else
        {
            return;
        }

    }

    $scope.userInfoData = {};
		
		
		$scope.refreshUserInfoData = function (){

    userInfoService.getUserData($stateParams.employeeID).then(function(r) {

        $scope.userInfoData = r.data;

        console.log($scope.userInfoData);
        $scope.directSupervisor = $scope.userInfoData.supervisors[($scope.userInfoData.supervisors).length -1 ];

        $scope.dtOptions = {
            order: [],
        };

						
				});
		
		}
		
		$scope.refreshUserInfoData();
    
    userInfoService.getHierarchyData().then(function(r) {

    });
		
		
		
		$scope.getGroupList = function (){
			
				params = null;
				apiRequest.send('get', '/grouplist', params).success(function(r){
				
				
				$scope.groupList = r;
				//console.log(r);
				
				}).error(function(e){
				
				
				toastr.error('Group List could not be loaded.');
				
				});
			
			
			
			}
		
		
		$scope.addGroup = function (){
			
			///some ng-model here 
			
			//call some route here. 
			
			if($scope.user_info_add_to_group)
			{
	
				apiRequest.send('post', '/group/'+$scope.user_info_add_to_group+'/user/'+$scope.userInfoData.employeeid, null).success(function(r){
				
				//console.log(r);
				
					$scope.refreshUserInfoData(); //tells the index object to update itself
					toastr.success('User was successfully added to this group.', 'Added');
				
				
				}).error(function(e){
				
				console.log(e);
				toastr.error('This user is already a member of this group.' );
				
				}); 
			
			}
			// do other things
			
			
			}
			
			$scope.removeFromGroup = function (groupID){
			
					apiRequest.send('delete', '/group/'+groupID+'/user/'+$scope.userInfoData.employeeid, null).success(function(r){
				
				//console.log(r);
				
					$scope.refreshUserInfoData(); //tells the index object to update itself
				toastr.success('User was successfully removed from this group.', 'Removed');
				
				}).error(function(e){
				
				console.log(e);
				toastr.error('An error occured whiel attempting to delete the user from the group.' );
				
				}); 
			
			
			}

    $scope.editSupervisor = function() {

        var params = {
            "employeeID": $scope.userInfoData.id,
            "newSupervisorID": $scope.userInfoData.newSupervisor,
        };

        console.log(params);
        userInfoService.changeSupervisor(params).success(function(r) {
            toastr.success('Supervisor changed', 'Success');
            $scope.directSupervisor.name = r.supervisor;

        }).error(function(e) {
            toastr.error('You can\'t do that', 'Error');
        });
        
        
    }

		
		$scope.getGroupList();


}]);

App.controller('WeatherCtrl', function ($scope, weatherService) {
    $scope.weather = weatherService.getWeather();
});


App.controller('rtoviewtestcontroller', function($stateParams, apiRequest, userInfoService, rtoViewService) {


    var vm = this;
    vm.rtoData = {};


    var request_id = $stateParams.rtoid;

    rtoViewService.rtoViewData(request_id).then(function(r){

        vm.rtoData = r.data;
        console.log(r.data);
        // console.log(vm.rtoData.requested_time[0].date);

        vm.checkExistingAbsences();

        if(!vm.holidays)
        {

            apiRequest.send('get', '/timesheet/holidaylist', null).then(function(r){

                vm.holidays = r.data;


            });

        }



        userInfoService.getUserData(vm.rtoData.employeeID).then(function(r){

            vm.userInfo = r.data;
            vm.name = vm.userInfo.firstname+' '+vm.userInfo.lastname;



            userInfoService.QueryUserRtoBank(vm.rtoData.employeeID).then(function(r){

                vm.bankTotals = userInfoService.getUserRtoBank();
                calculate_BankTotalsDifference ();
                checkHolidays ();

                vm.user = user.getstoredUser();


            });




        });

    });

    function checkHolidays ()
    {
        for (var i = 0; i < vm.rtoData.requested_time.length; i++) {
            vm.holidays.forEach( function (holiday)
            {

                if(vm.rtoData.requested_time[i].date == holiday.date)
                {
                    vm.rtoData.requested_time[i].holiday = 1;
                }

            });
        }



    }

    function calculate_BankTotalsDifference (){

        var vm = this;

        var requestedTime = {};
        var resultTime = {};

        console.log(vm.bankTotals);

        for (var i = 0; i < vm.rtoData.requested_time.length; i++) {

            if(!requestedTime[vm.rtoData.requested_time[i].type])
            {
                requestedTime[vm.rtoData.requested_time[i].type] = vm.rtoData.requested_time[i].hours;
            }
            else
            {
                requestedTime[vm.rtoData.requested_time[i].type] = requestedTime[vm.rtoData.requested_time[i].type] + vm.rtoData.requested_time[i].hours;
            }

        }

        //compare

        for (var key in vm.bankTotals.remaining )
        {
            if(requestedTime[key])
            {
                resultTime[key] = vm.bankTotals.remaining[key] - requestedTime[key];
            }
            else
            {
                resultTime[key] = vm.bankTotals.remaining[key];
            }

        }



        vm.requestedTime = requestedTime;
        vm.resultTime = resultTime;

    }



    vm.viewTables = function () {

    };

    vm.postRtotime = function() {
        var params = {
            "hours": vm.hours,
            "type": vm.type,
            "date": dateStringService.dateToString(vm.date)

        };

        if (params.type == 'vacation')
        {
            if (params.hours != 8 && params.hours != -8)
            {
                toastr.error('Vacation must be in increments of 8 hours', 'Error');
                return;
            }
        }


        rtoViewService.postRtotime(params,request_id).success(function(r){


            vm.rtoData.requested_time.push(r);
            calculate_BankTotalsDifference ();
            vm.checkExistingAbsences();
            checkHolidays ();

            if (vm.rtoData.employeeID != vm.user.employeeID)
            {
                vm.editNotification();
            }


        }).error(function(e){

            toastr.error('Failed to create RTO');
        });

    };

    vm.editRtotime = function()
    {
        var params = {
            "rtotimeID": vm.rtotimeID,
            "hours": vm.hours,
            "type": vm.type,
            "date": dateStringService.dateToString(vm.date)
        };


        if (params.type == 'vacation')
        {
            if (params.hours != 8 && params.hours != -8)
            {
                toastr.error('Vacation must be in increments of 8 hours', 'Error');
                return;
            }
        }


        rtoViewService.putRtotime(params).success(function(r) {

            vm.rtoData.requested_time.splice(vm.index, 1, r);
            calculate_BankTotalsDifference ();
            vm.checkExistingAbsences();
            checkHolidays ();


            if (vm.rtoData.employeeID != vm.user.employeeID)
            {
                vm.editNotification();
            }


        }).error(function(e) {
            toastr.error('Failed to update RTO');
        });



        /*    vm.rtoData.requested_time.splice(vm.index, 0, rtoViewService.putRtotime(params));
         vm.rtoData.requested_time.splice(vm.index, 1);*/
    };


    vm.newForm = function(){

        vm.show_form = true;
        vm.formTitle = 'Create New RTO';
        vm.formMode = 'new';

        //clear fields
        vm.hours ="";
        vm.type = null;
        vm.date="";


    };


    vm.editForm = function(rtotime_id, index){
        vm.rtotime = vm.rtoData.requested_time;

        // Set object to accurate rtotime table values.
        for (i = 0; i < vm.rtotime.length; i++)
        {
            if (vm.rtotime[i].rtotimeID == rtotime_id)
            {
                vm.rtotime = vm.rtotime[i];
            }
        }
        //set values to pop up in tables.


        var s = vm.rtotime.date.split('-');


        vm.hours = vm.rtotime.hours;
        vm.type = vm.rtotime.type;
        vm.date = new Date(Number(s[0]),Number(s[1]) -1 ,Number(s[2]));
        vm.rtotimeID = vm.rtotime.rtotimeID;
        vm.index = index;

        vm.show_form = true;
        vm.formTitle = 'Edit Existing RTO';
        vm.formMode = 'edit';

    };

    vm.deleteForm = function(rtotime_id, index){

        if(rtoViewService.deleteRtotime(rtotime_id)) {

            vm.rtoData.requested_time.splice(index, 1);
            calculate_BankTotalsDifference ();
            vm.checkExistingAbsences();
        }


    };

    vm.approveRto = function(approval)
    {

        var params = {
            "requestID": vm.rtoData.requestID,
            "approval": approval
        };

        rtoApprovalService.approve(params).success(function(r) {
            console.log(r);
            vm.rtoData.approvals.push(r);
            vm.rtoData.status = (r.check);

            toastr.success('Approval Posted', 'Success');

        }).error(function(e) {

            toastr.error('Approval Failed', 'Error');
        });

    };


    vm.removeApproval = function(approvalID, index)
    {
        vm.click = false;
        rtoApprovalService.remove(approvalID).success(function(r) {
            vm.rtoData.approvals.splice(index, 1);
            vm.rtoData.status = (r);

            toastr.success('Approval Deleted', 'Success');

        }).error(function(e) {

            toastr.error('Deletion Failed: ');

        });
    };

    vm.deleteRto = function() {

        rtoViewService.deleteRto(vm.rtoData.requestID).success(function (r) {

            toastr.success("RTO " + vm.rtoData.requestID + " deleted successfully.");
            console.log(r);
            history.go(-1);

        }).error(function (e) {

            console.log(e);
        })
    };


    vm.editNotification = function () {


        vm.notifyloady = 1;
        emailService.sendEditNotification(vm.rtoData.employeeID, vm.user.name).success(function(r) {

            console.log(r);
            toastr.success('Request modified');
            vm.notifyloady=0;

        }).error(function(e) {

            toastr.error('Could not edit request');
            vm.notifyloady=0;

        })
    }


    vm.emailSupervisor = function()
    {
        console.log(vm.supervisorID);
        vm.notifyloady = 1;

        var params = {
            "subject": "New Time Off Request from "+vm.user.name+" Awaiting Approval",
            "body": "<a href='"+document.location.href+"'>Click here to view time-off request.</a>",
            "recipientID": vm.supervisorID,
        };

        apiRequest.send('post', '/mail/send', params).success(function(r) {
            toastr.success('Email Sent');
            vm.notifyloady = 0;
            console.log(r);
        }).error(function(e){
            vm.notifyloady = 0;
            toastr.error(' This failed miserably. ');
            console.log(e);

        });
    }


    vm.popup1 = {
        opened: false
    };


    vm.open1 = function() {
        vm.popup1.opened = true;
    };

    vm.isEmptyObject = function(obj) {
        /* logic of your choosing here */
        return Object.keys(obj).length;
    };


    vm.showExistingAbsences = false;
    vm.existingAbsencesObject = {};

    vm.checkExistingAbsences = function()
    {
        var dateArray = [];


        for (var i = 0; i < vm.rtoData.requested_time.length; i++) {

            dateArray.push(vm.rtoData.requested_time[i].date);
        }

        rtoViewService.refreshRtoExistingAbsencesObject(dateArray).success(function(r){

            vm.existingAbsencesObject = r;


        });


    }




});


