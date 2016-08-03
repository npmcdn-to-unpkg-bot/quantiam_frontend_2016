App.controller('SlipcastAnalyticController', function($scope, $location, apiRequest) {

// State params = 'slipcastID': '###'
	var vm = this;


	apiRequest.send('get', '/slipcast/analytic/slipweight/campaign/12', null).success(function(r) {

		vm.slipWeight = r;
				calculate_XMR(r,'inventoryID','slipCasted','inventoryID');
		
		
		//	console.log(vm.slipWeight);
		//vm.buildHumidityGraphs();


	}).error(function(e) {

		toastr.error('Could not locate humidity data');

	});



	vm.ChartConfig = {
		
	};



	




});


function calculate_XMR (ObjOfArrays,xValue,yValue, orderBy)
{
	
	var returnObj = {};
	returnObj.xArray = [];
	returnObj.xBar;
	returnObj.mrArray = [];
	returnObj.mrBar;
	


	
					ObjOfArrays.sort(orderByInventoryID);

					var previous_value;
					
					ObjOfArrays.forEach( function (dataPoint){
							
							if(previous_value) {
								
								 var mr = parseFloat(Math.abs(previous_value - dataPoint[yValue]).toFixed(2));
									returnObj.mrArray.push(mr);
							}
							
							returnObj.xArray.push(dataPoint[yValue]);
							
							
							previous_value = dataPoint[yValue];
						
					});
					
					
						returnObj.xBar =  parseFloat(arrayAverage(returnObj.xArray).toFixed(2));
						returnObj.mrBar =  parseFloat(arrayAverage(returnObj.mrArray).toFixed(2));
						returnObj.xLCL =  parseFloat((returnObj.xBar - (2.66 * returnObj.mrBar)).toFixed(2));
						returnObj.xUCL = parseFloat((returnObj.xBar + (2.66 * returnObj.mrBar)).toFixed(2));
						
						returnObj.mrUCL = parseFloat((3.267 * returnObj.mrBar).toFixed(2));
						returnObj.mrUCL = (0 * returnObj.mrBar);
	
	console.log(returnObj);
}


function orderByInventoryID(a,b) {

  if (a.inventoryID < b.inventoryID)
    return -1;
  if (a.inventoryID > b.inventoryID)
    return 1;
  return 0;
}

function arrayAverage (array){
	
		var total = 0;
							for(var i = 0; i < array.length; i++) {
									total += array[i];
							}
							var avg = total / array.length;
	return avg;
	
	
}