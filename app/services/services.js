App.service(
    "apiRequest",
    function($http) {

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
                  //    response = e;
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


App.service("authService",function($http, apiRequest) {
	
	 return ({

            authenticate: authenticate
    });
		
	function authenticate (username, pass)
	{
		
		var params = {"username": username, "pass": pass};
		var response = apiRequest.send('post','/auth',params);
			
			if(response)
			{
				localStorage.setItem('token', response. token);
				return true;
			}
	}

});