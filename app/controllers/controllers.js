
App.controller('IndexController', ['$scope', function($scope) {
  var vm = this;

  vm.AppName = "Index";

  vm.body = {};

  vm.body.title = "Thing";




}]);


App.controller('HomeController', ['$scope', function($scope) {
  var vm = this;


  vm.title = 'Dashboard';

}]);



App.controller('RtoController', ['$scope', function($scope) {
  var vm = this;

  vm.title="www";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://apps.edm.quantiam.com:2000/rto",
    "method": "POST",
    "headers": {
      "authorization": "Bearer " + localStorage.getItem('token'),
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "page": [
        "",
        ""
      ],
      "status": "",
      "employeeID": "",
      "firstDate": "",
      "lastDate": "",
      "perPage": ""
    }
  };

  var result = ($.ajax(settings).done(function (response) {
  }));

  console.log(result.responseJSON.);

}]);
