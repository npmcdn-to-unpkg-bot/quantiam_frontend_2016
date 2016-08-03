App.controller('SlipcastAnalyticController', function($scope, $location, apiRequest) {

// State params = 'slipcastID': '###'
	var vm = this;


	apiRequest.send('get', '/slipcast/analytic/slipweight/campaign/12', null).success(function(r) {

		vm.slipWeight = r;
			vm.xmr =	calculate_XMR(r,'inventoryID','slipCasted','inventoryID');
		
			vm.buildCharts();
	
		
		
		//	console.log(vm.slipWeight);
		//vm.buildHumidityGraphs();


	}).error(function(e) {

		toastr.error('Could not locate humidity data');

	});


vm.buildCharts = function() {

	vm.xChartConfig = {
	
			title:{
			text:"X - Control Chart  - Slip Weight",
			},
			yAxis: {
			
				
				max: vm.xmr.xUCL + parseFloat((vm.xmr.xUCL*0.005).toFixed(2)),
				min: vm.xmr.xLCL - parseFloat((vm.xmr.xLCL*0.005).toFixed(2)),
				plotLines:[
								{
										value: vm.xmr.xUCL,
										color: '#ff0000',
										width:2,
										zIndex:4,
										label:{text:'UCL'}
								},	
								{
										value: vm.xmr.xLCL,
										color: '#ff0000',
										width:2,
										zIndex:4,
										label:{text:'LCL'}
								},
								{
										value: vm.xmr.xBar,
										color: '#05305d',
										width:1,
										zIndex:2,
										dashStyle: 'Dot',
										label:{text:'Average'}
								},
						]
				},
				series:[{
					
					
					type:'spline',
					data: vm.xmr.xArray
					
					}]
				
				
			
	};
	
	vm.mrChartConfig = {
			title:{
			text:"Moving Range - Control Chart - Slip Weight",
			},
			yAxis: {
				plotLines:[
								{
										value: vm.xmr.mrUCL,
										color: '#ff0000',
										width:2,
										zIndex:4,
										label:{text:'UCL'}
								},	
					
								{
										value: vm.xmr.mrBar,
										color: '#05305d',
										dashStyle: 'Dot',
										width:1,
										zIndex:2,
										label:{text:'Average'}
								},
						]
				},
				series:[{
				
				
				type:'spline',
				data: vm.xmr.mrArray
				
				}],
				
	};

}

	




});


function calculate_XMR (ObjOfArrays,xValue,yValue, orderBy)
{
	
	var returnObj = {};
	returnObj.xArray = [];
	returnObj.xArrayRaw = [];
	returnObj.xBar;
	returnObj.mrArray = [];
	returnObj.mrArrayRaw = [];
	returnObj.mrBar;
	


	
					ObjOfArrays.sort(orderByInventoryID);

					var previous_value;
					
					ObjOfArrays.forEach( function (dataPoint){
							
							var tempObj = {};
						
							
					
							console.log(dataPoint);
							returnObj.xArray.push(dataPoint);
							returnObj.xArrayRaw.push(dataPoint['y']);
							
							
							if(previous_value) {
								 var mr = parseFloat(Math.abs(previous_value - dataPoint['y']).toFixed(2));
									returnObj.mrArrayRaw.push(mr);
									returnObj.mrArray.push({'y':mr,'x':dataPoint['x']});
							}
							
									
							
							
							previous_value = dataPoint['y'];
							console.log(previous_value);
						
					});
					
					
						returnObj.xBar =  parseFloat(arrayAverage(returnObj.xArrayRaw).toFixed(2));
						returnObj.mrBar =  parseFloat(arrayAverage(returnObj.mrArrayRaw).toFixed(2));
						returnObj.xLCL =  parseFloat((returnObj.xBar - (2.66 * returnObj.mrBar)).toFixed(2));
						returnObj.xUCL = parseFloat((returnObj.xBar + (2.66 * returnObj.mrBar)).toFixed(2));
						
						returnObj.mrUCL = parseFloat((3.267 * returnObj.mrBar).toFixed(2));
						returnObj.mrLCL = (0 * returnObj.mrBar);
	
	
	
	console.log(returnObj);
	return returnObj;
}


function orderByInventoryID(a,b) {

  if (a.x < b.x)
    return -1;
  if (a.x > b.x)
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