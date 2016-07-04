/**
 * Created by cpetrone on 23/06/2016.
 */
 
 

App.controller('SlipcastController', function($scope,$location,  dtRequest,apiRequest,DTColumnBuilder) {
	
	var vm = this;
	
 vm.rowClickHandler = function (info) {
     
			$location.path('/slipcastview/' + info.manu_slipcasting_id);
			
     
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

 

App.controller('SlipcastViewController',  function($scope, $stateParams, apiRequest,userInfoService) {

	var vm = this;
	
	vm.slipcastID = $stateParams.slipcastid;
	vm.slipCastObj = {};
	vm.selectedOperator = '';
	

	
	vm.getSlipcastObj = function ()
	{
	
		apiRequest.send('get','/slipcast/'+vm.slipcastID, null).success(function(r){
			console.log(r);
			vm.slipCastObj = r;
			
			});
		
		
	}
	
	
	vm.addOperator = function ()
	{
	
	
			console.log(vm.selectedOperator);
		
			
			
			apiRequest.send('post', '/slipcast/'+vm.slipcastID+'/operator/'+vm.selectedOperator, null).success(function(r){
				
					vm.getSlipcastObj();
					 toastr.success('Operator added.');
				console.log(r);
				});
	
			vm.selectedOperator = null;
			//$('.chosen-select').trigger('chosen:updated');
		
		
	}
		
	vm.removeOperator = function (operatorID)
	{
			apiRequest.send('delete', '/slipcast/'+vm.slipcastID+'/operator/'+operatorID, null).success(function(r){
				
					vm.getSlipcastObj();
					toastr.success('Operator removed.');
			
				});
		
	}
	

   vm.positions = [1, 2, 3, 4, 5];



   
		
		
		// initialization
		
		vm.getSlipcastObj(vm.slipcastID);
		 userInfoService.getUsers().then(function(r) {
		 console.log(r.data);
			$scope.userData = r.data;

	});
		
});