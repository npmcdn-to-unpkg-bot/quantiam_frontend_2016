App.controller('IndexController', ['$scope', '$location','userService','select2request', function($scope, $location, userService,select2request ) {
  //var vm = this;
	$scope.select2request = select2request;

	
	
	
  $scope.AppName = "Quantiam";

	
	$scope.getID = function (string)
	{
		var res = string.split("-");
		return res[1];
		
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
	
	$scope.expandedsidebarstate = 'menubar-pin';
	 $scope.expandSidebar = function(){
    if ($scope.expandedsidebarstate === "menubar-pin")
      $scope.expandedsidebarstate = "";
    else
      $scope.expandedsidebarstate = "menubar-pin";
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
			userService.logoutUser();
			
			}

			
	$scope.checkIfGroupMember = function (groupID){
		
		//console.log(groupID);
		//console.log(userService.checkIfUserGroupMember(groupID));
		return userService.checkIfUserGroupMember(groupID);
		
		}
		

	

}]);


App.controller('HomeController', ['$scope', function($scope) {
	
  var vm = this;
  vm.title = 'Dashboard';


	
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


App.controller('RtoController', ['$scope', '$location', 'rtoService', 'DTOptionsBuilder', 'DTColumnDefBuilder', function($scope, $location, rtoService, DTOptionsBuilder, DTColumnDefBuilder) {


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

App.controller('RtoViewController',['$scope', '$stateParams', '$filter',  '$location', 'rtoViewService', 'userInfoService', 'userService', 'dateStringService', 'rtoApprovalService', 'emailService', 'apiRequest',
        function($scope,  $stateParams, $filter, $location, rtoViewService, userInfoService, userService, dateStringService, rtoApprovalService, emailService, apiRequest) {
  
        $scope.$on("$locationChangeStart", function() {
            console.log('this is how you do functions on leaving page.');
        });


            // /console.log($location.path());
	
		var request_id = $stateParams.rtoid;
		
	
    $scope.show_form = false;
    $scope.notifyloady = 0;

		$scope.rtoData = {};

		
		
		rtoViewService.rtoViewData(request_id).then(function(r){

			$scope.rtoData = r.data;
           // console.log($scope.rtoData.requested_time[0].date);
					 
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

                                    $scope.user = userService.getstoredUser();

									
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
							
							
            if ($scope.rtoData.employeeID != $scope.user.employeeID)
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

        var params = {
            "subject": "New Time Off Request from "+$scope.user.name+" Awaiting Approval",
            "body": "<a href='"+document.location.href+"'>Click here to view time-off request.</a>",
            "recipientID": $scope.supervisorID,
        };

        apiRequest.send('post', '/mail/send', params).success(function(r) {
           toastr.success('Email Sent');
            $scope.notifyloady = 0;
            console.log(r);
        }).error(function(e){
            $scope.notifyloady = 0;
            toastr.error(' This failed miserably. ');
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




App.controller('CommentsController', function($scope,apiRequest, $location, $sce) {
	
		$scope.comments;
		$scope.user_comment;
		
		$scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
}
		
	
		$scope.fetchComments = function () {
			
				
			var params = {
				'path': $location.path(),
				
				};
				
				
			apiRequest.send('get', '/comment', params).success(function(r){
				
				
				$scope.comments = r;
				console.log(r);
				
				}).error(function(e){
				
			/*
				toastr.error('Comments could not be loaded');
				*/
				});
			
			$scope.comments = ['comment1', 'comment2'];
		
			}
	
		$scope.addComment = function (user_comment) {
				var params = {
				'comment_text': user_comment,
				'comment_path': $location.path(),
				
				};
				
			
			apiRequest.send('post', '/comment', params).success(function(r){
				
				 $scope.user_comment = null;
				$scope.comments.unshift(r[0]);
				
				}).error(function(e){
				

				toastr.error('Comments failed to create.');
				
				});

			
			}
			
			
		$scope.removeComment = function (commentID, commentArrayIndex){
		
	
	
			
			apiRequest.send('delete', '/comment/'+commentID, null).success(function(r){
				
				
			$scope.comments.splice(commentArrayIndex, 1);
				
				toastr.success('Comment removed.');
				
				}).error(function(e){
				
				
				toastr.error('Comment failed to remove.');
				
				});
			
			
		}
			
			
		
		
		
		//run on intiatilizatiopn
		$scope.fetchComments();
	
	

});








App.controller('TolueneDataController', function() {

    $('#container').highcharts({
        xAxis:{
            categories: ['Time']
        },

        series:[{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }]
    });




});
App.controller('HumidityDataController', function() {





});