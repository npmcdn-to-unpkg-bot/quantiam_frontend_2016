App.service(  "apiRequest",  function($http,  $location, errorService) {

	var apiUrl = "http://apps.edm.quantiam.com:2000";
//	var apiUrl = "http://localhost/quantiam_api/public";
        return {
								send: function (httpVerb,path,params){
									var response;
									var data = params;
									if(httpVerb == 'put' || httpVerb == 'post')
									{
											var params = null;	
									}

									
										var req = {
															 method: httpVerb,
															 url: apiUrl + path,
															 headers: {
																 "Authorization": "Bearer " + localStorage.getItem('token'),
																 'Content-type': 'application/json',
															 },
															 data: data,
															 params: params,
													         //dataType: 'text',
										}
										 response =	$http(req).error(function(e,code){
											 
											 
															if(code == '401')
															{
																	toastr.error('Your login session is no longer valid');
																	user.logoutUser();
															}
											 
											 
											 });
										return response;
									},
									apiUrl: apiUrl,
				}
					
		});
							
					
		
App.service('dtRequest', function() {
		
		
		
		
		function build_dtOptions (requestPath, dtColumns, customData,Obj, RowClickCallbackName) {
				
				//requestPath     			api route for the datatables request
				//dtColumns      				 angular dtColumns object
				//customData							custom paramters/values you want set object format
				//Obj											the angular datatables object
				//RowClickCallbackName   the name of the function for which you want the rows to react using
				
				if(!dtColumns)
				{
						console.log('please specify the columns you want');
				}
				
				if(!customData)
				{
					customData = {};
				}
				
				
				return {
				
								 serverSide: true,
								 processing: true,
								
								 ajax: {
									 url: "http://apps.edm.quantiam.com:2000"+'/'+requestPath,
										 headers: {
												 "Authorization": "Bearer " + localStorage.getItem('token'),
											 },
											method: "POST",
										data: customData,
										dataSrc: 'aoData',
							/* 		  	success: function (r)
										{
											
										console.log(r);	
										},   */
								},
								"aaSorting": [],
							aoColumns: dtColumns,  // see https://l-lin.github.io/angular-datatables/#/api -> DT columnbuilder for object structure
						 rowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
							 
							    $('td', nRow).unbind('click');
											$('td', nRow).bind('click', function() {
															Obj[RowClickCallbackName](aData);
													
											});
											return nRow;
						 },
				}
			}
			
			
		return {
		
			build_dtOptions: build_dtOptions
		};
		
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
	function getUserList()
	{
		return apiRequest.send('get', '/userlistactive', null);

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
							refreshUser();
						
							
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


App.service('select2request', function(apiRequest){
	
	
	var vm = this;
	vm.params; //store paramters in this service instance
	
	vm.fetchList = function(path,params = null)
	{
		if(!params)
		{
			var params = {};
		}
		else
		{
			var params = params;	
		}
		
	
	return 	{
		
		 allowClear: true,
		 query: function (query) {
        
						params.like = query.term;
				
					//	console.log(params);
						apiRequest.send('get',path, params).success(function(r){
							
							var data = {};
							data.results = r;
         

							query.callback(data);
							
							});
					
        }
		
		}
		
		
	}
	

	
	
	return{
		
	
		fetchList: vm.fetchList
	
	}
	
});



