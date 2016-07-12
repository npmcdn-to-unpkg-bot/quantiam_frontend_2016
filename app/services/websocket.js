
App.service('webSocket', function($rootScope, $websocket,$state) {
      // Open a WebSocket connection
			var vm = this;
			
			vm.enableActions = 1;
			
			vm.turnOff = function (){
				
				vm.enableActions = 0;
				
				}
				
			vm.turnOn = function () {
				
					vm.enableActions =1;
			}

			vm.dataStream = $websocket('ws://192.168.1.179:8081'); // connect to websocket server;
		
			vm.checkAllowedMachine = function (string,array){
				
			 if($.inArray(string, array) > -1){
				
				return true;
				}else
				{
			    return false;
				};
				
				
			}
			
			vm.checkSubstring = function (needle, haystack)
			{
			
			}
			
			vm.dataStream.onMessage(function(message) {
			 
			 if(vm.enableActions)
			 {
			 var message = JSON.parse(message.data); 
			 
		///	 console.log(message);
																									/// Map events to state
																									
																										switch($state.current.name){
																																							 case 'slipcastview':
																																													
																																													var allowed_scanners = ['QAQC','Slipcasting'];
																																													if(vm.checkAllowedMachine(message.machine.name, allowed_scanners) && message.machine.type == 'Scanner'){
																																															if(vm.checkSubstring('QMIS',message.data))
																																															{
																																																$rootScope.$broadcast('steel',message);
																																															}
																																														}
																																														
																																													var allowed_scales = ["Slipcasting Scale"];			
																																													
																																													if(vm.checkAllowedMachine(message.machine.name, allowed_scales) && message.machine.type == 'Balance'){
																																														
																																																$rootScope.$broadcast('slipcastview_scalevalue',message);
																																															
																																														}
																																											
																																		 
																																								case 'slipcast':
																																								
																																								
																																								
																																								case 'prefinish':
																																								}
			 }		
		
      });

		
			return {
				
				
				turnOn: vm.turnOn,
				turnOff: vm.turnOff
				
				}
				 
				 
	
    });