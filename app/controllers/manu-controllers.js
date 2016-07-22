/**
 * Created by cpetrone on 23/06/2016.
 */
 
 

App.controller('SlipcastController', function($scope,$location,  dtRequest,apiRequest,DTColumnBuilder) {
	
	var vm = this;
	
	
	
 vm.rowClickHandler = function (info) {
     
			$location.path('/slipcast/' + info.manu_slipcasting_id);
			
     
			$scope.$apply(); //must be used when being called outside of the angualr scope, does nothign otherwise. 

    }

	vm.updateTable = function() {
	
		vm.getdtTable();
		
		}
  	
		
	vm.getdtTable = function () {
	
	
					 var customOptions = {
						 
						 'campaign_id' : vm.campaign_id,
						 
						 };

						//what columns do we want to show?
						var dtColumns = [
							

									DTColumnBuilder.newColumn('datamatrix').withTitle('Code').renderWith(function(data, type, full) {
																	return '<img width=50px src="'+full.datamatrix+'"</img>';
															}),
									DTColumnBuilder.newColumn('ID').withTitle('ID').renderWith(function(data, type, full) {
																		return '<b>QMSC-'+full.manu_slipcasting_id+'</b>';
																}),
				
									DTColumnBuilder.newColumn('campaign_name', 'Campaign').notSortable(),
									DTColumnBuilder.newColumn('profile_name', 'Profile').notSortable(),
									DTColumnBuilder.newColumn('steel').withTitle('Casted').renderWith(function(data, type, full) {
									
												var string = '';
												full.steel.forEach( function (arrayItem)
																				{
																						 string = string+'<li style="font-size:11px;">QMIS-'+arrayItem.id + ',' + arrayItem.heat_id+'</li>';
																				///		alert(x);
																				});
																	
																	return string;
																	
																	
															}).notSortable(),
									DTColumnBuilder.newColumn('datetime', 'Created'),
								
								
							];
							

			vm.dtTable = dtRequest.build_dtOptions('slipcasting/list', dtColumns, customOptions, vm, 'rowClickHandler'); //query endpoint for datables response 
							
	vm.createSlipcastRun = function (){
				
				
				console.log('things');
				
				apiRequest.send('post','/slipcast', null).success(function(r){
					
					
								$location.path('/slipcast/' + r.id);
					
					})
				
				
				}				
							
	
		
	}
	
	
	
	
	vm.getdtTable();
		
	
	
});

 

App.controller('SlipcastViewController',  function($scope, $stateParams, $uibModal, apiRequest,userService, userInfoService,webSocket,select2request) {

	var vm = this;
	
	
	vm.slipcastID = $stateParams.slipcastid;
	vm.slipCastObj = {};
	vm.editable = 0; //default can't edit
	vm.editableDays = -1;
	vm.admin = 0;
	vm.admin_edit_notice = false;
	vm.selectedOperator = '';
	vm.slipObj;
	vm.slipCastObjLoaded = false;
	vm.slipcastingRampProfiles;
	vm.slipcastingTables;
	vm.slipcastingProfiles;
	vm.slipcastProfileFilter = ['created_by','created_datetime','last_updated_datetime','active','campaign_id','slipcast_profile_comments','manu_slipcasting_profile_id','ramp_profile'];
	vm.slipProfileFilter = [''];
	vm.steelSelection;
	vm.scaleValue;
	vm.scaleValuePrevious;
	vm.scaleStatus;
	vm.previousContainerWeightData = {};
	vm.completedTasks = [];
	vm.operatorList = select2request;

	
	vm.init = function (){
		
			
		vm.getSlipcastObj(vm.slipcastID);
		
		userInfoService.getUsers().then(function(r) {
		
					$scope.userData = r.data;
				

			});
			

		
		}
		
		
		vm.enableAmindEditing = function ()
		{
			vm.admin_edit_notice = false;
			vm.editable = 1;
			
		}

		
	vm.getSlip = function (){
		
		
		apiRequest.send('get', '/slip/'+vm.slipCastObj.manu_slip_id).success(function(r){
			
			vm.slipObj = r;
			console.log(vm.slipObj);
			
			});
		
		
		}
		
	vm.checkEditable = function (){
		
		var created = moment(vm.slipCastObj.datetime)
		var now = moment();
		
		var diff = created.diff(now,'days');
		
		if(diff >= vm.editableDays )
		{
				vm.editable = 1;
				vm.admin_edit_notice = false;
		}
		
		
		if((userService.checkIfUserGroupMember(41) || userService.checkIfUserGroupMember(5)))
		{
			vm.admin = 1;
			if( vm.editable == 0)
			{
				vm.admin_edit_notice = true;
			}
		}
		
	
		}	

	
	vm.getSlipcastObj = function ()
	{
	
		apiRequest.send('get','/slipcast/'+vm.slipcastID, null).success(function(r){
			console.log(r);
				vm.slipCastObj = r;
				
				vm.slipCastObjLoaded = true;
					
					vm.getSlip();
				vm.checkEditable();
				vm.checkStepCompletion();
			});
		
		
	}
	
	vm.editSlipcastObj = function (key,value)
	{

		var param = {};
		
		
		param[key] = ''+value+'';
		
		
		apiRequest.send('put','/slipcast/'+vm.slipcastID, param).success(function(r){
		
				vm.slipCastObj[key] = value;
				
				
				 if(key == 'manu_slipcasting_profile_id')
				 {
					 		vm.getSlipcastObj();
				}
				
				if(key == 'manu_slip_id')
				{
							vm.getSlip();
					
				}
				 toastr.success(r.success);
		//console.log(r);
			});
		
		
	}
	
	vm.addOperator = function ()
	{
	
	
			console.log(vm.selectedOperator);
		
			
			
			apiRequest.send('post', '/slipcast/'+vm.slipcastID+'/operator/'+vm.selectedOperator, null).success(function(r){
				
					vm.getSlipcastObj();
					 toastr.success('Operator added.');
			
				});
	
			vm.selectedOperator = 'none';
		
		
		
	}
		
	vm.removeOperator = function (operatorID)
	{
			apiRequest.send('delete', '/slipcast/'+vm.slipcastID+'/operator/'+operatorID, null).success(function(r){
				
					vm.getSlipcastObj();
					toastr.success('Operator removed.');
			
				});
		
	}
	


	vm.addSteel = function (steel)
	{
	
		if(vm.editable)
		{

			if(!steel)
			{
				steel = vm.selectedSteel;
			}

			apiRequest.send('post', '/slipcast/'+vm.slipcastID+'/steel/'+steel,null).success(function(r){

			vm.slipCastObj.steel.push(r);
			toastr.success('Successfully added QMSI-'+steel);

			}).error(function(e){

			toastr.error('Already exists');

			});

		}
		else
		{
			toastr.error("You cannot edit this.");

		}
	}
	
	vm.removeSteel = function(steelID, index){
		
		
		
		
		
		apiRequest.send('delete', '/slipcast/'+vm.slipcastID+'/steel/'+steelID,null).success(function(r){
			
			
				
			  vm.slipCastObj.steel.splice(index, 1);
					toastr.success('Successfully deleted QMSI-'+steelID);
		});
		
		}

		vm.editSteel = function (steel,index,key,value){
			
			
				var param = {};
				param[key] = value;
			
				apiRequest.send('put','/slipcast/'+vm.slipcastID+'/steel/'+steel, param).success(function(r){
		
				vm.slipCastObj.steel[index][key] = value;
				
			
				 toastr.success('Successfully Edited');
	
			});
			
		}
   
	 vm.recordContainerWeightData = function (steel, steelIndex, container, key)
	 {
				
				console.log(steelIndex);
		
					var param = {};
					param[key] = vm.scaleValue;
				
					apiRequest.send('put','/slipcast/'+vm.slipcastID+'/steel/'+steel+'/container/'+container, param).success(function(r){
			
					vm.slipCastObj.steel[steelIndex].container_weights[container-1] = r;
					
					vm.previousContainerWeightData = {'steelIndex' : steelIndex, 'container': container-1};
					console.log(r);
				
					 toastr.success('Successfully Saved');
		
				});
		
		 
		} 
		
		vm.undoSlipWeigh = function () {
			
			if(vm.previousContainerWeightData.steelIndex)
			{
				vm.slipCastObj.steel[vm.previousContainerWeightData.steelIndex].container_weights.splice(vm.previousContainerWeightData.container, 1);
				toastr.success("Removed");
			}
			else
			{
				
			toastr.error("Nothing to undo");	
			}
			
		}
	 
	 
   
		$scope.$on('steel', function(event,obj) {
			
			
					vm.addSteel($scope.getID(obj.data));
					toastr.success('Scanned',obj.data);
		
			});
			
			
			$scope.$on('slip', function(event,obj) {
			
				console.log(obj);
					vm.editSlipcastObj('manu_slip_id',$scope.getID(obj.data));
					toastr.success('Scanned',obj.data);
		
			});

		
		
		$scope.$on('slipcastview_scalevalue', function(event,obj)
		{
			
			
			if(obj.data.value != vm.scaleValue)
			{
			//		console.log(obj);
			
					vm.scaleValue = obj.data.value;
				
			}
			
			
			
				
				
				
				if(typeof obj.status.stable != 'undefined')
				{
					vm.scaleStatus = true;	
				}
				else
				{
					vm.scaleStatus = false;
				}
			
		});
	
		vm.translateToLetter = function ( var1,var2,var3 )
		{
					var total = var1 + (var2 * var3); 
					return String.fromCharCode(64  + total); 
			
			
		}
	
	
		vm.init();

		vm.checkStepCompletion = function(slipcastID)
		{
			angular.forEach(vm.slipCastObj.tasks, function (stepID, key) {
				vm.completedTasks[stepID] = true;
			})
		};
		
		
		vm.checkStep = function (stepid)
		{
			var httpVerb;

			if (vm.completedTasks[stepid])
			{
				httpVerb = 'post';
			}
			else {
				httpVerb = 'delete';
			}

			apiRequest.send(httpVerb, '/slipcast/' + vm.slipcastID + '/task/' + stepid, null).success(function(r) {

				if (httpVerb == 'post')
				{
					toastr.success('Task Complete', 'Success');
				}
				else
				{
					toastr.info('Task Undone', 'Success');
				}
			}).error(function(e) {
				toastr.error('Could not change task');
			})
		}
		
		
});

App.controller('SlipcastViewGraphsController', function($scope, $stateParams, $window, apiRequest) {
	// State params = 'slipcastID': '###'
	var vm = this;


	apiRequest.send('get', '/slipcast/' + $stateParams.slipcastid + '/humidity', null).success(function(r) {

		vm.humidityData = r;

		vm.buildHumidityGraphs();


	}).error(function(e) {

		toastr.error('Could not locate humidity data');

	});

	apiRequest.send('get', '/slipcast/' + $stateParams.slipcastid + '/toluene', null).then(function(r) {

		vm.tolueneData=r;
		console.log(vm.tolueneData);

		vm.buildTolueneGraph();

	}, function(e) {

		toastr.error('Could not locate toluene data');

	});



	vm.humidityChartConfig = {
		options: {

			tooltip: {
				style: {
					padding:10,
					fontWeight: 'bold'
				},
				crosshairs: true,
				shared: true
			},
			chart: {
				zoomType: 'x'
			}
		},


		xAxis: {
			type: 'datetime',
			labels:{
				formatter: function() {
					return Highcharts.dateFormat('%H %M', this.value);
				}
			}
		},


		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}°C',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			title: {
				text: 'Temperature',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			}

		}, { // Secondary yAxis
			gridLineWidth: 0,
			title: {
				text: 'Humidity',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}% RH',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			opposite: true

		}, { // Tertiary yAxis
			gridLineWidth: 0,
			title: {
				text: 'Dew Point',
				style: {
					color: Highcharts.getOptions().colors[2]
				}
			},
			labels: {
				format: '{value}°C',
				style: {
					color: Highcharts.getOptions().colors[2]
				}
			},
			opposite: true
		}],


		series: [],

		title: {
			text: 'Temp / Humidity Data for '
		},
	};

	vm.tolueneChartConfig = {
		chart: {
			zoomType: 'xy'
		},

		tooltip: {
			crosshair: true,
			shared: true
		},

		options: {

			tooltip: {
				style: {
					padding:10,
					fontWeight: 'bold'
				},
				crosshairs: true,
				shared: true,
			},
			chart: {
				zoomType: 'x'
			}
		},
		xAxis: {
			type: 'datetime',

			labels:{
				formatter: function() {
					return Highcharts.dateFormat('%H %M', this.value);
				}
			},
			minRange: 1000*3600
		},

		yAxis: { // Primary yAxis

		labels: {
			format: '{value} ppm',
			style: {
				color: Highcharts.getOptions().colors[3]
			}
		},
		title: {
			text: 'PPM Toluene',
			style: {
				color: Highcharts.getOptions().colors[3]
			}
		},
		tickInterval: 1500,
		min: 0,

	},

		series : [],
		title: {
			text: 'Toluene Evaporation'
		},
		subtitle: {
			text: ''
		},

	};


	vm.buildHumidityGraphs = function () {
		// Temp/Humidity Tables
				vm.humidityChartConfig.title.text += 'QMSC-' + vm.humidityData.title;

				vm.humiditySeries = {

					name: vm.humidityData.dataset[1].title,
					type: 'spline',
					data: vm.humidityData.dataset[1].data,
					yAxis:1,
					tooltip: {
						valueSuffix: '% RH'
					}

				};

				vm.dewpointSeries = {

					name: vm.humidityData.dataset[2].title,
					type: 'spline',
					data: vm.humidityData.dataset[2].data,
					yAxis:2,
					tooltip: {
						valueSuffix: ' °C'
					}
				};
				vm.tempSeries = {

					name: vm.humidityData.dataset[0].title,
					//pointStart: vm.humidityData.dataset[0].data[0][0],
					type: 'spline',
					data: vm.humidityData.dataset[0].data,
					tooltip: {
						valueSuffix: ' °C'
					}

				};

				vm.humidityChartConfig.series.push(vm.humiditySeries);
				vm.humidityChartConfig.series.push(vm.tempSeries);
				vm.humidityChartConfig.series.push(vm.dewpointSeries);



	}

	vm.buildTolueneGraph = function() {
		// Toluene Data Tables

		vm.tolueneChartConfig.subtitle.text += vm.tolueneData.data.title;

		angular.forEach(vm.tolueneData.data.dataset, function(value, key)
		{

			console.log(key);
			vm.tolueneSeries =
			{
				name: value.title,
				type: 'spline',
				data: vm.tolueneData.data.dataset[key].data,
				tooltip: {
					valueSuffix: ' ppm'
				}
			};


			vm.tolueneChartConfig.series.push(vm.tolueneSeries);





		});

	}



});


App.controller('SlipcastAnalyticalController', function($scope, $stateParams, $window, apiRequest) {
	
	
});

App.controller('FurnaceRunController', function($scope, $stateParams, $location, apiRequest, DTColumnBuilder, dtRequest) {
	
	
	var vm = this;
	
	
	 vm.rowClickHandler = function (info) {
     
			$location.path('/furnacerun/' + info.furnace_run_id);
			
     
			$scope.$apply(); //must be used when being called outside of the angualr scope, does nothign otherwise. 

    }

	vm.updateTable = function() {
	
		vm.getdtTable();
		
		}
  	
		
	vm.getdtTable = function () {
		
		var customOptions = {
							 
							 'campaign_id' : vm.campaignID,
							 'furnace_profile_id' : vm.furnaceprofileID,
							 'furnace_id' : vm.furnaceID,
							 'furnace_run_type_id' : vm.furnaceruntypeID,
							 
							 };

							//what columns do we want to show?
		var dtColumns = [
								

										DTColumnBuilder.newColumn('datamatrix').withTitle('Code').renderWith(function(data, type, full) {
									//	console.log(full);
										
																		return '<img width=40px src="'+full.datamatrix+'"</img>';
																}).notSortable(),
										DTColumnBuilder.newColumn('ID').withTitle('ID').renderWith(function(data, type, full) {
																			return '<b>QMFR-'+full.furnace_run_id+'</b>';
																	}).notSortable(),
																	
										DTColumnBuilder.newColumn('furnace_run_name', 'Name').notSortable(),
										DTColumnBuilder.newColumn('furnace_run_type_name', 'Type').notSortable(),
										DTColumnBuilder.newColumn('profile_name', 'Profile').notSortable(),
										DTColumnBuilder.newColumn('campaign_name', 'Campaign').notSortable(),
								
									
									
		
														
									DTColumnBuilder.newColumn('created_date', 'Created').notSortable(),
								
								
							];
							

		vm.dtTable = dtRequest.build_dtOptions('furnacerun/list/datatable', dtColumns, customOptions, vm, 'rowClickHandler'); //query endpoint for datables response 
	
		console.log(vm.dtTable);
	}
	
	vm.getdtTable();
	
});

App.controller('SlipcastProfileListController', function($scope, apiRequest, $location) {


	var vm = this;
	vm.offset = 1;

	vm.init = function(){

		apiRequest.send('get', '/slipcast/profile/list', null).success(function(r) {

			vm.profileList = r;
			console.log(vm.profileList);

		}).error(function(e) {

			toastr.error('Could not fetch Profile data');
		})

	};

	vm.viewProfile = function(profile_id){
		vm.offset = 0;
		$location.path('/slipcast/profile/list/' + profile_id);

	};

	vm.init();


});

App.controller('SlipcastProfileViewController', function($stateParams, apiRequest) {

	var vm = this;
	vm.isArray = angular.isArray;
	vm.profile_id = $stateParams.profile_id;
	vm.editableData = {};

	vm.init = function() {

		apiRequest.send('get', '/slipcast/profile/' + vm.profile_id, null).success(function(r) {

			vm.profile_data = r;
			vm.editable_data = r;

		}).error(function(e) {

			toastr.error('Could not load profile information.');
		});


		vm.offset = 0;
	};

	vm.editRow = function (toEdit, newvalue){

		console.log(toEdit);
		console.log(newvalue);
		console.log(vm.profile_data);
	}

	vm.init();

})


App.controller('FurnaceRunViewController', function($scope, $stateParams, $window, apiRequest, DTColumnBuilder) {

var vm = this;
vm.editable = true;
vm.furnacerunID = $stateParams.furnacerunid;
vm.furnacerunObj;


vm.init = function ()
{
	
	
	
}

vm.checkEditable = function (){
	
	
	
	
}


vm.init();// run initialization functions

});


App.controller('SlipcastProfileController', function() {




});
