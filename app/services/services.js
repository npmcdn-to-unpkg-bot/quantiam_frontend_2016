App.service(
    "apiRequest",
    function($http,   errorService) {

        return {
         

				send: function (httpVerb,path,params){
				
			
			
					var apiUrl = "http://apps.edm.quantiam.com:2000";
					//var apiUrl = "http://localhost/quantiam_api/public";
					var response;
					var token = localStorage.getItem('token');


						
						var req = {
											 method: httpVerb,
											 url: apiUrl + path,
											 headers: {
												 "Authorization": "Bearer " + token,
											 },
											 data: params,
											 params: params
											}

						 response =	$http(req).success(function(r){
									
					
						 }).error(function(e,s){
						 
					return e;
						 
						 
						 });
						
						return response;
					}
				}
					
		});
							
					
		


App.service("dateStringService", function($filter) {

	return ({
		dateToString: dateToString
	});

	function dateToString(date)
	{
		return $filter('date')(date, "yyyy-MM-dd");
	};
})

App.service("rtoService", function($http, apiRequest) {


        // Return public API.
        return ({

            rtoList: rtoList,
						addRto: addRto
					});
		
        function rtoList()
        {
            var params =  {
                "page": "",
                "status": "",
                "employeeID": "",
                "firstDate": "",
                "lastDate": "",
                "perPage": "" };

             return  apiRequest.send('post','/rto', params);
     
        }


		function addRto()
		{
			return apiRequest.send('post', '/rto/new', null);
		}

    }
);

App.service("rtoViewService", function($http, $location, apiRequest) {
 
	
		var rtoObject = {};
		var rtoExistingAbsencesObject = {};
	
		function postRtotime(params,requestID)
		{
			return apiRequest.send('post', '/rto/' + requestID + '/requestTime', params);
		}

		function putRtotime(params)
		{
			return apiRequest.send('put', '/rto/requestTime', params);
		}



		function deleteRtotime(rtotime_id)
		{
			return apiRequest.send('delete', '/rto/time/' + rtotime_id, null).success(function(r){
				
				
				
				});
		}



	function rtoViewData(request_id)
		{
            return  apiRequest.send('get','/rto/' + request_id, null).success(function(r){
	
							rtoObject = r;
		
							});

        }


        function getRtotime(request_id)
		{
            return apiRequest.send('get','/rto/' + request_id, null);


        }

    
		
		function getRtoObject(){
			
			
			return rtoObject;
			
			}

		function deleteRto(requestID)
		{
			return apiRequest.send('delete', '/rto/' + requestID, null).success(function(r){
				
				$location.path('/rto');
				
				});
		}
			
			
			function refreshRtoExistingAbsencesObject(dateArray)
			{
				var params = {'dateArray': dateArray}
			
					return apiRequest.send('post','/rto/existingabsences', params).success(function(r){
	
							rtoExistingAbsencesObject = r;
					
		
				}).error(function(e){
					
							toastr.error('The fetching of existing absences failed miserably. ', 'API Error');
					});
				
			}
			
			
			function getRtoExistingAbsencesObject(){
			
			
			return rtoExistingAbsencesObject;
			
			}
		
		
		       // Return public API.
	     return ({

			 rtoViewData: rtoViewData,
			 getRtotime: getRtotime,
			 postRtotime: postRtotime,
			 putRtotime: putRtotime,
			 deleteRtotime: deleteRtotime,
			 deleteRto: deleteRto,
			 rtoObject: rtoObject,
			 refreshRtoExistingAbsencesObject: refreshRtoExistingAbsencesObject
    });
		
		
});
App.service("userInfoService", function($http, apiRequest) {

	return ({

		getUserData: getUserData,
		getHierarchyData: getHierarchyData,
		getUserRtoBank: getUserRtoBank,
		QueryUserRtoBank: QueryUserRtoBank,
		getUsers: getUsers,
		changeSupervisor: changeSupervisor,
		editUserInfo: editUserInfo,
	});
	var UserRtoBank = {};
	
	function getUserData(employee_id)
	{
	
		
		return apiRequest.send('get', '/user/' + employee_id, null).success(function(r){
			
			
		
			
			});
	}
	function getUserRtoBank ()
	{
	
				return UserRtoBank;
	}
	
	function QueryUserRtoBank (employee_id)
	{
	
		
		return apiRequest.send('get', '/u/rtobank', null).success(function(r){
			
			
			for( var employeeID in r)
			{

			    if (employeeID == employee_id) {
						
									
									
							UserRtoBank = r[employeeID];
				
					}
				
			}
			
			
			});
		
		}

	function getUsers()
	{
		return apiRequest.send('get', '/users', null);

	}

	function getHierarchyData()
	{
		return apiRequest.send('get', '/user/tree')
	}

	function changeSupervisor(params)
	{
		return apiRequest.send('post', '/user/move', params);
	}

	function editUserInfo(params)
	{
		return apiRequest.send('put', '/user/edit', params);
	}
});

/*
	This service contains methods used to authenticate and update the user.
*/
App.service("userService",  function( $location, $rootScope, apiRequest ) {
		
		 
			
		var storedUserObject = {};
		var lastPath;

			
		// Obtain the user JWT token using credentials
		function authenticateUser (username, pass)
		{
		
		
			var params = {"username": username, "pass": pass};
			var response = apiRequest.send('post','/auth',params).success(function(r){
							
							localStorage.setItem('token', r.token);
							
							$rootScope.$broadcast('updateIndexUserObject');
							return true;
									 
					 }) 
					.error(function(e){
						
				
						return false;
				
						
						 });
			
			return response;
			
				
		}
		
		
		function checkIfUserGroupMember (groupID){
		
		if(storedUserObject.groups)
		{
	//	console.log(storedUserObject.groups.length);
			for (var i = 0; i < storedUserObject.groups.length; i++) {
			
						
							
						if(storedUserObject.groups[i].group_id == groupID)
						{

							return true
						
						}

			}
			
				return false; 
		}
		
		
		}
		
		function getstoredUser(){
					
						return storedUserObject; //returns stored object
					
		}
		
		// Use the stored token to refresh the user object.
		function refreshUser() 
		{
			
					
					
					var response = apiRequest.send('get','/user').success(function(r){
							
							storedUserObject = r;
							 
							return r; 
							
									 
					 })
					 .error(function(e){
							
						
						 		logoutUser();
									return false;
						 });
			
		
				
	
					return response;
						
			
		}
		
		// Used to redirect the user to the login screen and delete the stored token.
		function logoutUser()
		{
		
				localStorage.clear(); // clear stored data
				lastPath = $location.path();
				console.log(lastPath);
				$location.path('/login');
				
		}
		function getlastPath (){
					return lastPath;
			
			}
		
		
return ({

							authenticateUser: authenticateUser,
							refreshUser: refreshUser,
							getstoredUser: getstoredUser,
							logoutUser: logoutUser,
							storedUserObject: storedUserObject,
							getlastPath: getlastPath,
							checkIfUserGroupMember: checkIfUserGroupMember
			});

	});


App.service("rtoApprovalService", function(apiRequest) {
	return ({
		approve: approve,
		remove: remove,
	});

	function approve(params) {

		return apiRequest.send('post', '/approval/' + params.requestID, params);

	}

	function remove(approvalID)
	{
		return apiRequest.send('delete', '/approval/' + approvalID, null);
	}
});






/* 
	This service povides a place to store all api errors. 
*/
App.service("errorService", function (){
	
	var error_array = []; //Upon loading the application, create an array to store errors in. 
	
	function new_error (Obj){
	
			var temp_object = {}; // Create temporarty object. 
			
				for (var property in Obj) // Loop through error object.
				{
					if (typeof Obj[property] != 'function') // Only allow non-function properties
					{
						temp_object[property] = Obj[property]; // Append non-function properties to the temporary array.
					}
				}
				//temp_object.timestamp = new Date().toISOString().slice(0,19);
				error_array.unshift(temp_object); //Adds error object striped of functions to the front of error_array
				console.log(error_array); // Display in console 
	}
	
	return {
    new_error: new_error
  };
	
	
});

App.service("emailService", function(apiRequest) {

	return {
		sendRtoNotification: sendRtoNotification,
		sendEditNotification: sendEditNotification,
	}


	function sendRtoNotification(recipientID, employeeName) {

		var params = {
			"subject": "New Time Off Request from "+employeeName+" Awaiting Approval",
			"body": "<a href='"+document.location.href+"'>Click here to view time-off request.</a>",
			"recipientID": recipientID
		};

		return apiRequest.send('post', '/mail/send', params);
	}

	function sendEditNotification(recipientID, name) {
		
		var params = {
			"subject": "A supervisor has modified your time off request.",
			"body": "<a href='"+document.location.href+"'>Click here to view modified time-off request.</a>",
			"recipientID": recipientID
		};
		console.log(params);

		return apiRequest.send('post', '/mail/send', params);
	}
})




