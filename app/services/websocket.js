
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
			
			vm.checkSubstring = function (str1, str2)
			{
								if(str2.indexOf(str1) != -1){
							return true;
					}
			}
			
			vm.dataStream.onMessage(function(message) {
			 
			 if(vm.enableActions)
			 {
			 var message = JSON.parse(message.data); 
			 
			 
																									/// Map events to state
																									
																										switch($state.current.name){
																																							 case 'slipcastview':
																																							 
																																											
																																													var allowed_scanners = ['QAQC','Slipcasting'];
																																													if(vm.checkAllowedMachine(message.machine.name, allowed_scanners) && message.machine.type == 'Scanner'){
																																													
																																															console.log(message);
																																															console.log(vm.checkSubstring('QMSB',message.data));
																																													
																																															if(vm.checkSubstring('QMIS',message.data))
																																															{
																																																$rootScope.$broadcast('steel',message);
																																															}
																																															
																																															if(vm.checkSubstring('QMSB',message.data))
																																															{
																																																$rootScope.$broadcast('slip',message);
																																															}
																																														}
																																														
																																												
																																													
																																													if(message.machine.name == 'Slipcasting Scale' && message.machine.type == 'Balance'){
																																													//			console.log(message);
																																															
																																																$rootScope.$broadcast('slipcastview_scalevalue',message);
																																															
																																														}
																																											
																																								case 'furnacerunview':
																																								
																																								var allowed_scanners = ['QAQC','Furnaces'];
																																								
																																													if(vm.checkAllowedMachine(message.machine.name, allowed_scanners) && message.machine.type == 'Scanner'){
																																													
																																															if(vm.checkSubstring('QMIS',message.data))
																																															{
																																																$rootScope.$broadcast('steel',message);
																																															}
																																															

																																														}
																																								
																																								
																																								case 'slipcast':
																																								
																																								
																																								
																																								case 'prefinish':
																																								}
																																								
	//				vm.previous_message	= message;																																				
			 }		
		
      });

		
			return {
				
				
				turnOn: vm.turnOn,
				turnOff: vm.turnOff
				
				}
				 
				 
	
    });