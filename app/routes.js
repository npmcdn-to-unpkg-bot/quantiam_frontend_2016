App.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('home', {
            url:'/',
            templateUrl: 'views/dashboard.html',
            controller: 'HomeController as HC'
        })
        .state('dashboard', {
            url:'/dashboard',
            templateUrl: 'views/dashboard.html',
            controller: 'HomeController as HC'
        })
        .state('login', {
            url:'/login',
            templateUrl: 'views/auth/login.html',
				})
        .state('rto', {
            url:'/rto',
            templateUrl: 'views/rto/rto_dashboard.html',
            controller: 'RtoController as RC'
        })
        .state('rtoView', {
            url:'/rto/:rtoid',
            templateUrl: 'views/rto/rto_view.html',
            controller: 'RtoViewController as RVC'
        })

        .state('newRto', {
            url:'/rto/{rtoid}/new',
            templateUrl: 'views/rto/rto_view.html',
            controller: 'NewRtoController as NRC'
      });
				
				
				

}]);
