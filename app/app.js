var App = angular.module('App', ['ui.router', 'datatables', 'ui.bootstrap', 'ui.calendar',
								 'highcharts-ng','angularTrix','rt.select2','ui.bootstrap.datetimepicker','ngWebSocket','ngDropzone',
								  'bootstrapLightbox', 'ngHandsontable', 'ng-sortable']).run(function(select2Config){

	select2Config.dropdownAutoWidth = true;

	
}).config(['$urlRouterProvider', function ($urlRouterProvider) {
   // $urlRouterProvider.deferIntercept();
  }]);

