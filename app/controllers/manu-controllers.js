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
							
							
							
	
		
	}
	
	
	
	
	vm.getdtTable();
		
	
	
});

 

App.controller('SlipcastViewController',  function($scope, $stateParams, apiRequest,userInfoService,webSocket) {

	var vm = this;
	
	
	vm.slipcastID = $stateParams.slipcastid;
	vm.slipCastObj = {};
	vm.editable = 0; //default can't edit
	vm.editableDays = 0;
	vm.selectedOperator = '';
	vm.slipcastingRampProfiles;
	vm.slipcastingTables;
	vm.slipcastingProfiles;
	vm.slipcastProfileFilter = ['created_by','created_datetime','last_updated_datetime','active','campaign_id','slipcast_profile_comments','manu_slipcasting_profile_id','ramp_profile'];
	vm.steelSelection;

	
	vm.init = function (){
		
			
		vm.getSlipcastObj(vm.slipcastID);
		
	//	vm.getRampProfileList();
		vm.getSlipTableList();
		userInfoService.getUsers().then(function(r) {
		
					$scope.userData = r.data;

			});
			

		
		}
		
	vm.checkEditable = function (){
		
		var created = moment(vm.slipCastObj.datetime)
		var now = moment();
		
		var diff = created.diff(now,'days');
		
		if(diff >= vm.editableDays )
		{
				vm.editable = 1;
		}
		
	
		}	

	
	vm.getSlipcastObj = function ()
	{
	
		apiRequest.send('get','/slipcast/'+vm.slipcastID, null).success(function(r){
			console.log(r);
				vm.slipCastObj = r;
				
				vm.getSlipProfileList();
				vm.checkEditable();
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
			//$('.chosen-select').trigger('chosen:updated');
		
		
	}
		
	vm.removeOperator = function (operatorID)
	{
			apiRequest.send('delete', '/slipcast/'+vm.slipcastID+'/operator/'+operatorID, null).success(function(r){
				
					vm.getSlipcastObj();
					toastr.success('Operator removed.');
			
				});
		
	}
	
	vm.getRampProfileList = function ()
	{
			if(!vm.slipcastingRampProfiles)
			{
			apiRequest.send('get','/ramp/profile/list/slipcasting/1', null).success(function(r){
				
				
				console.log(r);
				vm.slipcastingRampProfiles = r; 
				
				});
			}
	}
	
		vm.getSlipProfileList = function ()
	{
		
			if(!vm.slipcastingProfiles)
			{
		
		var params = { } ;
			apiRequest.send('get','/slipcast/profile/list', params).success(function(r){
				
				
				console.log(r);
				vm.slipcastingProfiles = r; 
				
				});
			}
	}
	
	vm.getSlipTableList = function ()
	{
		
			if(!vm.slipcastingProfiles)
			{
			apiRequest.send('get','/slipcast/table/list', null).success(function(r){
				
				
				console.log(r);
				vm.slipcastingTables = r; 
				
				});
			}
	}
	
	vm.addSteel = function (steel)
	{
		 if(!steel)
		 {
		 steel = vm.selectedSteel;
		 }
			
			//console.log(vm.selectedSteel);
			
		apiRequest.send('post', '/slipcast/'+vm.slipcastID+'/steel/'+steel,null).success(function(r){
			
			
			vm.slipCastObj.steel.push(r);
			toastr.success('Successfully added QMSI-'+vm.selectedSteel);
			//vm.selectedSteel = null;
			
		}).error(function(e){
			
			toastr.error('Already exists');
			
			});
		
		
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
   
   
		$scope.$on('steel', function(event,obj) {
			
					if(vm.editable)
					{
					vm.addSteel($scope.getID(obj.data));
					}
					else
					{
						toastr.error("You cannot edit this.");
						
						}
			});

		
		
	
		// initialization
	
		vm.init();
	
		
});