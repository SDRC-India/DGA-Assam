myAppConstructor.controller("ReportController", reportController);

function reportController($scope, $http, allServices) {
	$scope.selectedFacilityType = {};
	$scope.selectedDistrict = {};
	$scope.selectedFacility = {};
	
	allServices.getFacilityImprovementSelection().then(function(data) {
		$scope.facilitiesImprovementList = data;
		$(".loader").css("display", "none");
	}, function() {
	});
	
	$scope.selectFacilityType = function(facilityType){
		$scope.selectedFacilityType = facilityType;
		$scope.selectedDistrict = {};
		$scope.selectedFacility = {};
	};
	$scope.selectDistrict = function(district){
		$scope.selectedDistrict = district;
		$scope.selectedFacility = {};
	};
	$scope.selectFacility = function(facility){
		$scope.selectedFacility = facility;
	};
	$scope.downloadReport = function(){
		if(!Object.keys($scope.selectedFacilityType).length){
			$scope.errorMsg = "Facility type";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!Object.keys($scope.selectedDistrict).length){
			$scope.errorMsg = "District";
			$("#errorMessage").modal("show");
			return false;
		}
		else if(!Object.keys($scope.selectedFacility).length){
			$scope.errorMsg = "Facility";
			$("#errorMessage").modal("show");
			return false;
		}
		else{
//			if($scope.selectedFacilityType.facilityType == "Community Health Centre")
//				var url = "resources/facilityImprovementPlan/" + $scope.selectedFacilityType.facilityType + "/" + $scope.selectedDistrict.district + "/" + $scope.selectedFacility.Name + ".xlsx";
//			else if($scope.selectedFacilityType.facilityType == "District Hospital")
//				var url = "resources/facilityImprovementPlan/" + $scope.selectedFacilityType.facilityType + "/" + $scope.selectedFacility.Name + ".xlsx";
//			else 
//				var url = "resources/facilityImprovementPlan/" + $scope.selectedFacilityType.facilityType + "/" + $scope.selectedDistrict.district + "/" + $scope.selectedFacility.Name + ".xlsx";
//			$http.get(url).then(
//					function(response) {
//						if(response.status == 200){
//							window.location.href=url;
//							$scope.selectedFacilityType = {};
//							$scope.selectedDistrict = {};
//							$scope.selectedFacility = {};
//						}
//					},function(error){
//						if(error.status == 404){
//							$scope.selectedFacilityType = {};
//							$scope.selectedDistrict = {};
//							$scope.selectedFacility = {};
//							$("#fileNotFound").modal("show");
//						}
//			});
			
			$(".loader").show();
			$http.get('getFIPReport?areaCode='+$scope.selectedFacility.code).then(
				function(response) {
					if(typeof response.data == 'string' && response.data.indexOf("You are not authorized to view this page") != -1){
						$("body").append('<div id="sessionOutMessage" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body text-center"><h3>Session is expired</h3><a href="home" class="btn btn-default errorOk" type="submit">OK</a></div></div></div></div>');
						$("#sessionOutMessage").modal("show");
					}
					else
						{
					if(response.status == 200){
						if(response.data!='')
							{
					var fileName = {
							"fileName" : response.data
						};
						$.download("downloadFile/", fileName, 'POST');
					$scope.selectedFacilityType = {};
					$scope.selectedDistrict = {};
					$scope.selectedFacility = {};
					}
						else
							{
							$(".loader").css("display", "none");
							$("#noDataModall").modal("show");
							}
					}
						}
				}
		);
			
		}
	};
	
	$.download = function(url, data, method) {
		// url and data options required
		if (url && data) {
			// data can be string of parameters or array/object
			data = typeof data == 'string' ? data : jQuery.param(data);
			// split params into form inputs
			var inputs = '';
			jQuery.each(data.split('&'), function() {
				var pair = this.split('=');
				inputs += '<input type="hidden" name="' + pair[0] + '" value="'	+ pair[1] + '" />';
			});
			// send request
			jQuery(
					'<form action="' + url + '" method="' + (method || 'post')
							+ '">' + inputs + '</form>').appendTo('body')
					.submit().remove();
			$(".loader").css("display", "none");
		}
		;
	this.export_excel = function() {
		alert("excel exported");
	};
	};

	
}