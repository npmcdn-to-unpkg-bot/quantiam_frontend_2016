App.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'HomeController as HC'
      })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'HomeController as HC'
        })
        .when('/rto', {
            templateUrl: 'views/rto/rto_dashboard.html',
            controller: 'RtoController as RC'
        })

});
