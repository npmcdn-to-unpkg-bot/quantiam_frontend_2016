App.controller('SlipcastAnalyticController', function($scope, $location, apiRequest) {

// State params = 'slipcastID': '###'
	var vm = this;
	vm.showCharts = false;

	apiRequest.send('get', '/slipcast/controlcharts/slipweight/campaign/12', null).success(function(r) {

	
			vm.xmr =r;
			console.log(vm.xmr);
			vm.buildCharts();

	}).error(function(e) {

		toastr.error('Could not locate humidity data');

	});


vm.buildCharts = function() {

	vm.showCharts = true;
	vm.xChartConfig = {
	
			title:{
			text:"X Control Chart - "+vm.xmr.title,
			},
		 legend: {
            enabled: false
        },
			xAxis:{
				
				 title:{
						text: vm.xmr.x_name+' ('+vm.xmr.x_unit+')',
					},
				},
			yAxis: {
			 title:{
						text: vm.xmr.y_name+' ('+vm.xmr.y_unit+')',
					},
				
				max: (vm.xmr.xSeries.UCL + parseFloat((vm.xmr.xSeries.UCL*0.010).toFixed(2))),
				min: (vm.xmr.xSeries.LCL - parseFloat((vm.xmr.xSeries.LCL*0.010).toFixed(2))),
			
				plotLines:[
								{
										value: vm.xmr.xSeries.UCL,
										color: '#ff0000',
										width:2,
										zIndex:4,
										label:{text:'UCL'}
								},	
								{
										value: vm.xmr.xSeries.LCL,
										color: '#ff0000',
										width:2,
										zIndex:4,
										label:{text:'LCL'}
								},
								{
										value: vm.xmr.xSeries.avg,
										color: '#05305d',
										width:1,
										zIndex:2,
										dashStyle: 'Dot',
										label:{text:'Average'}
								},
						]
				},
				series:[{
					name:vm.xmr.y_name,
					type:'spline',
					data: vm.xmr.xSeries.data
					
					}]
				
				
			
	};
	
	vm.mrChartConfig = {
			title:{
			text:"MR Control Chart - "+vm.xmr.title,
			},
			 legend: {
            enabled: false
        },
			xAxis:{
				
				 title:{
						text: vm.xmr.x_name+' ('+vm.xmr.x_unit+')',
					},
				},
			yAxis: {
        title:{
						text: vm.xmr.y_name+' ('+vm.xmr.y_unit+')',
					},
			
				plotLines:[
								{
										value: vm.xmr.mrSeries.UCL,
										color: '#ff0000',
										width:2,
										zIndex:4,
										label:{text:'UCL'}
								},	
					
								{
										value: vm.xmr.mrSeries.avg,
										color: '#05305d',
										dashStyle: 'Dot',
										width:1,
										zIndex:2,
										label:{text:'Average'}
								},
						]
				},
				series:[{

				name:vm.xmr.y_name,
				type:'spline',
				data: vm.xmr.mrSeries.data,
		
				}],
				
	};

}

	




});

