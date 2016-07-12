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




App.directive('dropzone', function(){
	

 return {
					restrict: 'E',
					templateUrl: 'views/dropzone.html',
					replace: true,
					scope:{
						
							identifier: '@identifier',
					},
					link: function(scope, el, attrs){
					
		
						scope.$watch(attrs.identifier, function (v) {
         
            });
				
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