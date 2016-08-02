App.controller('SteelInventoryController', function($scope, $location, apiRequest, DTColumnBuilder, dtRequest) {

var vm = this;
	
	
	 vm.rowClickHandler = function (info) {
     
			//$location.path('/furnacerun/' + info.furnace_run_id);
			
     
			$scope.$apply(); //must be used when being called outside of the angualr scope, does nothign otherwise. 

    }

	vm.updateTable = function() {
	
			vm.getdtTable();
		
		}
  	
		
	vm.getdtTable = function () {
		
		var customOptions = {
							 
								'campaign_id' : vm.campaignID,
							
							 
							 };

							//what columns do we want to show?
		var dtColumns = [
								

										DTColumnBuilder.newColumn('datamatrix').withTitle('Code').renderWith(function(data, type, full) {
									//	console.log(full);
										
																		return '<img width=40px src="'+full.datamatrix+'"</img>';
																}).notSortable(),
																
										DTColumnBuilder.newColumn('ID').withTitle('ID').renderWith(function(data, type, full) {
																			return '<b>QMIS-'+full.manu_inventory_id+'</b>';
																	}).notSortable(),
								
										DTColumnBuilder.newColumn('heat_id', 'Name').notSortable(),
										DTColumnBuilder.newColumn('rework', 'Rework').notSortable(),
										DTColumnBuilder.newColumn('part_type', 'Type').notSortable(),
										DTColumnBuilder.newColumn('metallurgy_id', 'Metallurgy').notSortable(),
										DTColumnBuilder.newColumn('manufacturer', 'Manufacturer').notSortable(),
										DTColumnBuilder.newColumn('campaign_shortname', 'Campaign').notSortable(),
								
									
									
		
														
									DTColumnBuilder.newColumn('date_created', 'Created').notSortable(),
									
									DTColumnBuilder.newColumn('root_manu_inventory_id').withTitle('Parent').renderWith(function(data, type, full) {
																			
																			console.log(full);
																			if(full.root_manu_inventory_id)
																			{
																				return '<b>QMIS-'+full.root_manu_inventory_id+'</b>';
																			}
																			else
																			{
																			return '';
																			}
																			
																	}).notSortable(),
								
									
								
							];
							

		vm.dtTable = dtRequest.build_dtOptions('steel/list/datatable', dtColumns, customOptions, vm, 'rowClickHandler'); //query endpoint for datables response 
	
		console.log(vm.dtTable);
	}
	
	
			
	
	vm.getdtTable();


});
