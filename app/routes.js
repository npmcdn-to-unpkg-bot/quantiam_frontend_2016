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
            templateUrl: 'views/auth/login.html'
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

        .state('users', {
            url:'/users',
            templateUrl: 'views/users/users_dashboard.html',
            controller: 'usersController as UC'
        })

        .state('user', {
          url:'/user/:employeeID',
            templateUrl: 'views/users/user_info.html',
            controller: 'usersController as UC'
        })

    
        .state('slipcastview', {
            url:'/slipcast/:slipcastid',
              templateUrl: 'views/manu/slipcast/slipcasting-run.html',
              controller: 'SlipcastViewController as SVC'
              })
				.state('slipcastview.graphs', {
            url:'/graphs',
              templateUrl: 'views/manu/slipcast/slipcasting-graphs.html',
              controller: 'SlipcastViewGraphsController as SVGC'
              })

				 .state('slipcast', {
            url:'/slipcast',
              templateUrl: 'views/manu/slipcast/slipcast.html',
              controller: 'SlipcastController as SC'

        }) 
				 .state('slipcast/profile/list', {
            url:'/slipcast/profile/list',
              templateUrl: 'views/manu/slipcast/profile_list.html',
              controller: 'SlipcastProfileListController as SC'

        }) 
				 .state('slipcast/profile', {
            url:'/slipcast/profile',
              templateUrl: 'views/manu/slipcast/profile.html',
              controller: 'SlipcastProfileController as SC'

        })
}]);
