var App = angular.module('App', ['ui.router', 'datatables', 'ui.bootstrap', 'ui.calendar', 'highcharts-ng','angularTrix','rt.select2','ui.bootstrap.datetimepicker','ngWebSocket','ngDropzone']).run(function(select2Config){

	select2Config.dropdownAutoWidth = true;

	
});

