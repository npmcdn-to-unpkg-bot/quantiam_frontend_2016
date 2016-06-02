App.service(
    "apiRequest",
    function($http,   errorService) {

        return {
         

				send: function (httpVerb,path,params){
				
			
			
					var apiUrl = "http://apps.edm.quantiam.com:2000";
					var response;
					var token = localStorage.getItem('token');
				//	console.log(token);
				//	var response = $q.defer();
        

						
						var req = {
											 method: httpVerb,
											 url: apiUrl + path,
											 headers: {
												 "Authorization": "Bearer " + token 
											 },
											 data: params
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

App.service("rtoViewService", function($http, apiRequest) {
        // Return public API.
	     return ({

			 rtoViewData: rtoViewData,
			 getRtotime: getRtotime,
			 postRtotime: postRtotime,
			 putRtotime: putRtotime,
			 deleteRtotime: deleteRtotime
    });
	
	
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
			return apiRequest.send('delete', '/rto/time/' + rtotime_id, null);
		}



	function rtoViewData(request_id)
		{
             return  apiRequest.send('get','/rto/' + request_id, null);

        }


        function getRtotime(request_id)
		{
            return apiRequest.send('get','/rto/' + request_id, null);


        }

    }
);
App.service("userInfoService", function($http, apiRequest) {

	return ({

		getUserData: getUserData
	});

	function getUserData(employee_id)
	{
		return apiRequest.send('get', '/user/' + employee_id, null);
	}
});

/*
	This service contains methods used to authenticate and update the user.
*/
App.service("userService",  function( $location, apiRequest ) {
		
		 
			
		var storedUserObject = {};
			
			
		// Obtain the user JWT token using credentials
		function authenticateUser (username, pass)
		{
		
		
			var params = {"username": username, "pass": pass};
			var response = apiRequest.send('post','/auth',params).success(function(r){
							
							localStorage.setItem('token', r.token);
								return true;
									 
					 }) 
					.error(function(e){
						
						return false;
				
						
						 });
			
			return response;
			
				
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
				$location.path('/login');
				
		}
		
		
return ({

							authenticateUser: authenticateUser,
							refreshUser: refreshUser,
							getstoredUser: getstoredUser,
							logoutUser: logoutUser,
							storedUserObject: storedUserObject
			});

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