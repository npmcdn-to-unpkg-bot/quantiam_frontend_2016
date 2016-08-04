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

        .state('rtotest', {
            url: '/rtotest',
            templateUrl: 'views/rto/rtodashtest.html',
            controller: 'RtoTestController as RTC'
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
			.state('slipcast-analytics', {
									url:'/slipcast/analytics/',
										templateUrl: 'views/manu/slipcast/analytics.html',
										controller: 'SlipcastAnalyticController as SCAC'

							})

        .state('slipcastview', {
            url:'/slipcast/:slipcastid',
              templateUrl: 'views/manu/slipcast/slipcasting-run.html',
              controller: 'SlipcastViewController as SVC'
              })
				.state('slipcastviewGraphs', {
            url:'/slipcast/:slipcastid/graphs',
              templateUrl: 'views/manu/slipcast/slipcasting-graphs.html',
              controller: 'SlipcastViewGraphsController as SVGC'
              })

				 .state('slipcast', {
            url:'/slipcast',
              templateUrl: 'views/manu/slipcast/slipcast.html',
              controller: 'SlipcastController as SC'

        })
				 .state('slipcast-profile-list', {
            url:'/slipcast/profile/list',
              templateUrl: 'views/manu/slipcast/slipcastprofile.html',
              controller: 'SlipcastProfileListController as SC'

				 }) 
			
				 .state('slipcast-profile-view', {
					 url:'/slipcast/profile/:profile_id',
              templateUrl: 'views/manu/slipcast/slipcastprofileview.html',
              controller: 'SlipcastProfileViewController as SVC'

        })
				 .state('furnacerun', {
            url:'/furnacerun',
              templateUrl: 'views/manu/furnace/furnacerun.html',
              controller: 'FurnaceRunController as FRC'

        })
				 .state('furnacerunview', {
            url:'/furnacerun/:furnacerunid',
              templateUrl: 'views/manu/furnace/furnacerunview.html',
              controller: 'FurnaceRunViewController as FRV'

        }) 
			 .state('steel', {
            url:'/steel',
              templateUrl: 'views/inventory/steel/steel.html',
              controller: 'SteelInventoryController as SIC'

        })
}]);
