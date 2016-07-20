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
				scope:{
							identifier: '@identifier',
						
					},
				link: function(scope, element, attrs) {
					
			
						attrs.$observe('identifier',function(newValue,oldValue) {
								//This gets called when data changes.
								if(attrs.identifier != '')
								{
									scope.CC.getComments();
								}	
						});
					},
					controller:function($scope,apiRequest, $location, $sce){ 
								
								var vm = this;
								vm.comments;
								vm.user_comment;
					
					vm.to_trusted = function(html_code) {
							return $sce.trustAsHtml(html_code);
					}
					
				
					vm.getComments = function () {
						
							
						var params = {
							'comment_hash': this.identifier,
							
							};
							
							
						apiRequest.send('get', '/comment', params).success(function(r){
							
							
							vm.comments = r;
							console.log(r);
							
							}).error(function(e){
							
						
									toastr.error('Comments could not be loaded');
							
							});
						
					
					
						}
				
						vm.addComment = function (user_comment) {
								var params = {
								'comment_text': user_comment,
								'comment_hash': this.identifier,
								
								};
							
						
							apiRequest.send('post', '/comment', params).success(function(r){
								
								 vm.user_comment = null;
								vm.comments.unshift(r[0]);
								
								}).error(function(e){
								

								toastr.error('Comments failed to create.');
								
								});

						
						}
						
								
							vm.removeComment = function (commentID, commentArrayIndex){
							
						
						
								
								apiRequest.send('delete', '/comment/'+commentID, null).success(function(r){
									
									
								vm.comments.splice(commentArrayIndex, 1);
									
									toastr.success('Comment removed.');
									
									}).error(function(e){
									
									
									toastr.error('Comment failed to remove.');
									
									});
								
								
							}
						

					//vm.getComments();
								
								
								
								
							},
							controllerAs: 'CC',
							bindToController: true,
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
}]);

App.directive('weatherIcon', function() {
	return {
		restrict: 'E', replace: true,
		scope: {
			cloudiness: '@'
		},
		controller: function($scope) {
			$scope.imgurl = function() {
				var baseUrl = 'https://ssl.gstatic.com/onebox/weather/128/';
				if ($scope.cloudiness < 20) {
					return baseUrl + 'sunny.png';
				} else if ($scope.cloudiness < 90) {
					return baseUrl + 'partly_cloudy.png';
				} else {
					return baseUrl + 'cloudy.png';
				}
			};
		},
		template: '<div style="float:left"><img ng-src="{{ imgurl() }}"></div>'
	};
});