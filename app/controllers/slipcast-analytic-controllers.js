App.controller('SlipcastAnalyticsController', function($scope, $location, apiRequest) {
	var vm = this;
	vm.campaignID;
	
	
});

App.controller('SlipcastScatterPlotViewController', function($scope, $location,$stateParams, apiRequest) {
	
	var vm = this;
	vm.showCharts = false;
		vm.campaignID = $stateParams.campaignID;
		vm.variablePairMonitored = $stateParams.variablePairMonitored;

	
	
	vm.hotOptions = {
		
	stretchH: 'all',		
		
		}
		
	apiRequest.send('get', '/slipcast/scatterplot/'+vm.variablePairMonitored+'/campaign/'+vm.campaignID, null).success(function(r) {


			vm.scatterplot =r;
			console.log(vm.scatterplot);
			vm.buildCharts();

	}).error(function(e) {

		toastr.error('Could not locate humidity data');

	});
	
	
	
	vm.loadSlipcastRun = function (slipcastID)
	{
			console.log('triggered');
			$location.path('/slipcast/' + slipcastID);
		
		
	}
	
	
	
vm.buildCharts = function() {

	vm.showCharts = true;
	vm.ChartConfig = {
	chart: {
		 backgroundColor:'rgba(255, 255, 255, 0.0)'
		},
			title:{
			text:"Scatter Plot - "+vm.scatterplot.title,
			},
			subtitle:
			{
				text:vm.scatterplot.sub_title
				},
		 legend: {
            enabled: false
        },
			xAxis:{
				
				 title:{
							text: vm.scatterplot.x_name+' ('+vm.scatterplot.x_unit+')',
					},
				//	type:'category',
				//	tickInterval:5,
				},
			yAxis: {
			gridLineWidth: 0,
			 title:{
						text: vm.scatterplot.y_name+' ('+vm.scatterplot.y_unit+')',
					},
			},
		

			series:[{
					name:vm.scatterplot.y_name,
					type:'scatter',
					data: vm.scatterplot.data,
					tooltip:{
						pointFormatter: function () {
            return ('<b>ID</b>: '+this.identifier ||  '') + ' <b>Name</b>: ' + (this.inventoryName || '<br/>')+
						'<br/><b>Date</b>: '+this.readableDate+'<br/> <span style="color:'+this.color+'">\u25CF</span> '+vm.scatterplot.y_name+': <b>'+this.y+'</b> '+vm.scatterplot.y_unit+' <br/>'+
						'<span style="color:'+this.color+'">\u25CF</span> '+vm.scatterplot.x_name+': <b>'+this.x+'</b> '+vm.scatterplot.x_unit+' <br/>'+(this.comment || '')+'<br/>';
								
						},
						headerFormat: '',
					
						
						},
						marker:{
							
							enabled:true,
							
							},
						point: {
				
						events: {
						
								click: function (){
									
											vm.loadSlipcastRun(this.slipcastID);
									}
						
						
								}
				
						}
					
					}]
				
				
			
		}
	}
	console.log(vm.ChartConfig);
});
	
	

App.controller('SlipcastControlChartViewController', function($scope, $location,$stateParams, apiRequest) {

// State params = 'slipcastID': '###'
	var vm = this;
	vm.showCharts = false;
		vm.campaignID = $stateParams.campaignID;
		vm.variableMonitored = $stateParams.variableMonitored;
	
	vm.loadSlipcastRun = function (slipcastID)
	{
			console.log('triggered');
			$location.path('/slipcast/' + slipcastID);
		
		
	}

	apiRequest.send('get', '/slipcast/controlcharts/'+vm.variableMonitored+'/campaign/'+vm.campaignID, null).success(function(r) {

	
			vm.xmr =r;
			console.log(vm.xmr);
			vm.buildCharts();

	}).error(function(e) {

		toastr.error('Could not locate humidity data');

	});

	
	vm.hotOptions = {
		
	stretchH: 'all',		
		
		}

vm.buildCharts = function() {

	vm.showCharts = true;
	vm.xChartConfig = {
	chart: {
		 backgroundColor:'rgba(255, 255, 255, 0.0)'
		},
			title:{
			text:"X Control Chart - "+vm.xmr.title,
			},
			subtitle:
			{
				text:vm.xmr.sub_title
				},
		 legend: {
            enabled: false
        },
			xAxis:{
				
				 title:{
							text: vm.xmr.x_name+' ('+vm.xmr.x_unit+')',
					},
					type:'category',
					tickInterval:5,
				},
			yAxis: {
			 title:{
						text: vm.xmr.y_name+' ('+vm.xmr.y_unit+')',
					},
				
				max: (vm.xmr.xSeries.UCL + parseFloat((vm.xmr.xSeries.UCL*0.015).toFixed(2))),
				min: (vm.xmr.xSeries.LCL - parseFloat((vm.xmr.xSeries.LCL*0.015).toFixed(2))),
			
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
					data: vm.xmr.xSeries.data,
				tooltip:{
						pointFormatter: function () {
            return ('<b>ID</b>: '+this.identifier ||  '') + ' <b>Name</b>: ' + (this.inventoryName || '<br/>')+
						'<br/><b>Date</b>: '+this.readableDate+'<br/> <span style="color:'+this.color+'">\u25CF</span> '+this.series.name+': <b>'+this.y+'</b> '+vm.xmr.y_unit+' <br/>'+(this.comment || '')+'<br/>';
								
						},
						headerFormat: '',
					
						
						},
						marker:{
							
							enabled:true,
							
							},
						point: {
				
						events: {
						
								click: function (){
										//	console.log(this);
											vm.loadSlipcastRun(this.slipcastID);
									}
						
						
								}
				
						}
					
					}]
				
				
			
	};
	
	vm.mrChartConfig = {
		chart: {
		  backgroundColor:'rgba(255, 255, 255, 0.0)'
		},
			title:{
			text:"Moving Range Control Chart - "+vm.xmr.title,
			},
			subtitle:
			{
				text:vm.xmr.sub_title
				},
			 legend: {
            enabled: false
        },
			xAxis:{
				
				 title:{
						text: vm.xmr.x_name+' ('+vm.xmr.x_unit+')',
					},
					tickInterval:5,
				},
			yAxis: {
        title:{
						text: vm.xmr.y_name+' ('+vm.xmr.y_unit+')',
					},
					
						
				//max: (vm.xmr.mrSeries.UCL + parseFloat((vm.xmr.mrSeries.UCL*0.2).toFixed(2))),
			
			
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

				name:vm.xmr.y_name+' Difference',
				type:'spline',
				data: vm.xmr.mrSeries.data,
				tooltip:{
						pointFormatter: function () {
             return ('<b>ID</b>: '+this.identifier ||  '') + ' <b>Name</b>: ' + (this.inventoryName || '<br/>')+
						'<br/><b>Date</b>: '+this.readableDate+'<br/> <span style="color:'+this.color+'">\u25CF</span> '+this.series.name+': <b>'+this.y+'</b> '+vm.xmr.y_unit+' <br/>'+(this.comment || '')+'<br/>';
								
						},
							headerFormat: '',
					},
					point: {
			
						events: {
						
								click: function (){
											
											vm.loadSlipcastRun(this.slipcastID);
									}
						
						
								}
				
						}
				}],
				
	};

}

	




});

