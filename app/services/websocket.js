
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
			
	
				if( haystack.indexOf(needle) > -1)
				{return true;}else{return false;}
			}
			
			vm.dataStream.onMessage(function(message) {
			 
			 if(vm.enableActions)
			 {
			 var message = JSON.parse(message.data); 
																									/// Map events to state
																									
																										switch($state.current.name){
																																							 case 'slipcastview':
																																													
																																													var allowed_machines_name = ['QAQC'];
																																													if(vm.checkAllowedMachine(message.machine.name, allowed_machines_name)){
																																															if(vm.checkSubstring('QMIS',message.data))
																																															{
																																																$rootScope.$broadcast('steel',message);
																																															}
																																														}
																																											
																																		 
																																								case 'slipcast':
																																								}
			 }		
		
      });

		
			return {
				
				
				turnOn: vm.turnOn,
				turnOff: vm.turnOff
				
				}
				 
				 
	
    });