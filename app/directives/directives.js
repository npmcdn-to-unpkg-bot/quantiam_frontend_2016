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
							getSlip: '&'
					},
					link: function(scope, element, attrs) {
					
			
						attrs.$observe('slipid',function(newValue,oldValue) {
								//This gets called when data changes.
								if(attrs.slipid != '')
								{
									scope.VC.getSlip();
								}	
						});
					},
					controller:function($scope,$attrs,  $element, apiRequest){
					
					var vm = this;
					vm.slipObj;
					
					vm.getSlip = function ()
					{
						if(this.slipid != '')
						{
					   apiRequest.send('get','/slip/'+this.slipid,null).success(function(r){
							 	vm.slipObj = r;
							
					
							 })	;
						}
					}	
					
					vm.editSlipcastObj = function (key,value)
					{
						var param = {};
						
						
						param[key] = ''+value+'';
						
						
						apiRequest.send('put','/slip/'+vm.slipObj.slip_id, param).success(function(r){
						
							console.log(r);
								vm.slipObj = r;
								
								 toastr.success('Edited');
						//console.log(r);
							});
						
						
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
					link: function(scope, element, attrs) {
					
							attrs.$observe('identifier',function(newValue,oldValue) {
								//This gets called when data changes.
								if(attrs.identifier != '')
								{
									scope.DC.getImages();
								}	
						});
					
					},
					controller:function($scope,$attrs,  $element, apiRequest, Lightbox){
										
												var vm = this;
												vm.hash;
												vm.url = apiRequest.apiUrl+'/dropzone';

												vm.isOpen = true;								
												
												vm.dzError = function( file, errorMessage ) {
													toastr.error('An error occured while uploading ');
												};	
												vm.dzAddedFile = function( file ) {
												
												};
												
												vm.dzSuccess = function (file, r)
												{
													vm.getImages();
													console.log(r);
												}
												
												vm.dzSending = function (file, xhr, formData) {
	
																		formData.append('hash',$attrs.identifier);
																		console.log(formData);
																	};

												vm.dropzoneConfig = {
													parallelUploads: 3,
													maxFileSize: 30,
													url: vm.url,
													headers: {
													
														"Authorization": "Bearer " + localStorage.getItem('token')
														
														},
												
												};
												
												vm.getImages = function (){
													
													
													apiRequest.send('get','/dropzone/'+vm.identifier,null).success(function(r){
														
														vm.images = r;
													
														
														});
													
													}
												
												vm.deleteImage = function (index){
													
													var filename = vm.images[index].filename;
													
														apiRequest.send('delete','/dropzone/'+vm.identifier+'/'+filename,null).success(function(r){
														
														  vm.images.splice(index, 1);
															
															toastr.success('Deleted Image');
														
											
													
														
														});
													
													}
												
												vm.images = [
											
												];

												vm.openLightboxModal = function (index) {
												
												//console.log(Lightbox);
													Lightbox.openModal(vm.images, index);
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