App.service(
    "apiRequest",
    function($http, errorService) {

        return {
            send: send
        };

      function send (httpVerb,path,params){
			
					var apiUrl = "http://apps.edm.quantiam.com:2000";

          var response = {};

              $.ajax({
                  type: httpVerb,
                  async: false,
                  url: apiUrl + path,
                  headers: {
                      "Authorization": "Bearer " + localStorage.getItem('token'),
                      "content-type": "application/x-www-form-urlencoded"
                  },
                  data: params,
                  success: function (r) {

                      response = r;
                      //Do Something
                  },
                  error: function (e) {
                      // We need to build an ovious way to display an error here. 
											// response = e;
											errorService.new_error(e);
                  }
              });

					if(Object.keys(response).length != 0 && response.constructor === Object)
					{
						return response;
					}

        }


    }

);

App.service("rtoService", function($http, apiRequest) {


        // Return public API.
        return ({

            rtoList: rtoList
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

    }
);

App.service("rtoViewService", function($http, apiRequest, $routeParams) {

        // Return public API.
	     return ({

            rtoData: rtoData($routeParams.rtoid)
    });




        function rtoData(rtoid)
		{
             return  apiRequest.send('get','/rto/' + rtoid, null);

        }

    }
);


/*
	This service contains methods used to authenticate and update the user.
*/
	App.service("userService",function(apiRequest) {

		 return ({

							authenticateUser: authenticateUser,
							refreshUser: refreshUser,
							logoutUser: logoutUser
			});


		// Obtain the user JWT token using credentials
		function authenticateUser (username, pass)
		{
			var params = {"username": username, "pass": pass};
			var response = apiRequest.send('post','/auth',params);

				if(response)
				{
					localStorage.setItem('token', response. token);
					return true;
				}
		}

		// Use the stored token to refresh the user object.
		function refreshUser()
		{




		}

		// Used to redirect the user to the login screen and delete the stored token.
		function logoutUser()
		{


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