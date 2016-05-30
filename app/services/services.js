App.service(
    "apiRequest",
    function($http) {

        return {
            send: send
        };

      function send (httpVerb,path,params){

          var response = {};

              $.ajax({
                  type: httpVerb,
                  async: false,
                  url: "http://apps.edm.quantiam.com:2000" + path,
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
                      //Do Something to handle error
                      response = e;
                  }
              });

          return response;


        }


    }

);

App.service(

    "rtoService",
    function($http, apiRequest) {


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
          //  console.log(response);
           // console.log(settings);
        }

    }
);
