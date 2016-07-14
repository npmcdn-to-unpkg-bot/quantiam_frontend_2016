App.directive(
    'dateInput',
    function(dateFilter) {
        return {
            require: 'ngModel',
            template: '<input class="form-control" type="date" id="datePicker" required>',
            replace: true,
            link: function(scope, elm, attrs, ngModelCtrl) {
							ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    return new Date(viewValue);
                });
            },
        };
    });

		
App.directive('slipSearch', function(){
	
	
	return{
		
		restrict: 'E',
        templateUrl: 'views/select/slip.html',
				replace: true,
		}
	
	
});
		
App.directive('comments', function(){
	
	
 return {
        restrict: 'E',
        templateUrl: 'views/comment_section.html',
				replace: true,
 }
	
	
});


App.directive('slipcastViscosity', function(){
	

 return {
					restrict: 'E',
					templateUrl: 'views/manu/slip/viscosity.html',
					replace: true,
					scope:{
							slipid: '@slipid',
					},
					controller:function($scope,$attrs,  $element, apiRequest){
					
					var vm = this;
					vm.slipObj;
					
					vm.getSlip = function ()
					{
					   apiRequest.send('get','/slip/'+this.slipid,null).success(function(r){
							 	vm.slipObj = r;
					
							 })	;
					}	
					vm.createViscosity = function(){
					
						apiRequest.send('post','/slip/'+this.slipid+'/viscosity',null).success(function(r){
							
															vm.getSlip();
							 })	;
						}
						
					vm.handsOnTableSettings = {
					
					
								
								};

								
					
					vm.onAfterChange = function(row) {
										
										if(vm.slipObj && vm.slipObj.viscosity && row)
												{														
											
													var param = vm.slipObj.viscosity;
													apiRequest.send('put','/slip/'+this.slipid+'/viscosity',param).success(function(r){
														 
																					
																						vm.slipObj.viscosity = r;
																						toastr.success('Success');
																					 
														 })	;	
										
											}
									};
					
														
					setTimeout(function(){ 	
							vm.getSlip(); 			
						}, 500);	
	
						
					
					},
					controllerAs: 'VC',
					bindToController: true,
					
 };
					
					
});

App.directive('dropzone', function(){
	

 return {
					restrict: 'E',
					templateUrl: 'views/dropzone.html',
					replace: true,
					scope:{
						
							identifier: '@identifier',
					},
					controller:function($scope,$attrs,  $element, apiRequest){
										
											
												this.hash;
												this.url = apiRequest.apiUrl+'/dropzone';

												this.isOpen = true;								
												
												this.dzError = function( file, errorMessage ) {
													toastr.error('An error occured while uploading ');
												};	
												this.dzAddedFile = function( file ) {
												
												};
												
												this.dzSuccess = function (file, r)
												{
													
													console.log(r);
													}
												
												this.dzSending = function (file, xhr, formData) {
	
																		formData.append('hash',$attrs.identifier);
																		console.log(formData);
																	};

												this.dropzoneConfig = {
													parallelUploads: 3,
													maxFileSize: 30,
													url: this.url,
													headers: {
													
														"Authorization": "Bearer " + localStorage.getItem('token')
														
														},
												
												};
											
											},
						controllerAs: 'DC',
						bindToController: true,
					}
					
 });
	


App.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

App.directive('ngBlurDelay',['$timeout',function($timeout){
return {
    scope:{
        ngBlurDelay:'&'
    },
    link:function(scope, element, attr){
    element.bind('blur',function(){
       $timeout(scope.ngBlurDelay,200);
    });
    }
};
}])