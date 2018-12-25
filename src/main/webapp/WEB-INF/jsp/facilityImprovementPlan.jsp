<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page import="org.sdrc.dga.util.Constants"%>
<!DOCTYPE html>

<html ng-app="reportApp">


<!-- end  header row -->
<%
	if (request.getSession().getAttribute(Constants.USER_PRINCIPAL) == null) {
		response.sendRedirect("");
	}
%>
<head>
<title>DGA-FIP</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png"
	type="image/x-icon">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<link rel="stylesheet" href="resources/css/bootstrap.min.css">
<link rel="stylesheet"
	href="resources/css/bootstrap-dropdownhover.min.css">
<link rel="stylesheet" href="resources/css/font-awesome.min.css">
<link rel="stylesheet"
	href="resources/css/customLoader.css">
<link rel="stylesheet" href="resources/css/style.css">
<spring:url value="/webjars/jquery/2.0.3/jquery.min.js" var="jQuery" />
<script src="${jQuery}"></script>
<spring:url value="/webjars/bootstrap/3.1.1/js/bootstrap.min.js"
	var="bootstrapjs" />
<script src="${bootstrapjs}"></script>
<script src="resources/js/bootstrap-dropdownhover.min.js"></script>
<!-- <script src="resources/js/angular.min.js"></script> -->
<style>
	.select-container{
		width: 250px;
		display: inline-block; 
	}
	li.allDistDropdown a, li.allDistDropdown a:hover {
    color: #262626;
}
</style>
</head>

<body ng-controller="ReportController" ng-cloak>
	<!-- spinner -->
	<div id="spinner" class="loader" style="display: none;"></div>
	<div id="loader-mask" class="loader" style="display: none;"></div>
	<!-- /spinner -->

	<jsp:include page="fragments/header.jsp"></jsp:include>
	<div id="mymain" class="container-fluid min-height-wrap">
		<form class="selection" name="selctionForm" style="width: 100%; text-align: center;">
			<div class="select-container text-center">
				<div class="input-group">
					<input type="text" placeholder="Facility Type *" id="facilityType"
						class="form-control not-visible-input" name="facilityType"
						readonly="" ng-model="selectedFacilityType.facilityType"
						oninvalid="this.setCustomValidity('Please select Facility Type')">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="facilityType in facilitiesImprovementList"
								ng-click="selectFacilityType(facilityType)"><a href="">{{facilityType.facilityType}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="select-container dist-list text-center">
				<div class="input-group">
					<input type="text"
						placeholder="Districts *" id="Dist"
						class="form-control not-visible-input" name="Dist" readonly=""
						ng-model="selectedDistrict.district">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="district in selectedFacilityType.districts"
								ng-click="selectDistrict(district)"><a
								href="">{{district.district}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="select-container text-center">
				<div class="input-group">
					<input type="text" placeholder="Facility Name *" id="facilityName"
						class="form-control not-visible-input" name="facilityName"
						readonly="" ng-model="selectedFacility.Name"
						oninvalid="this.setCustomValidity('Please select Facility Type')">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="facility in selectedDistrict.facility"
								ng-click="selectFacility(facility)"><a href="">{{facility.Name}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="text-right" style="margin: 0 10px 15px; display: inline-block;vertical-align: top;">
				<button type="submit" ng-click="downloadReport()" class="submit-selection" style="margin-top: 0"
					>Download FIP</button>
			</div>
		</form>
	</div>
<!-- 	<div id="errorMessage" class="modal fade" role="dialog">
		<div class="modal-dialog">
			Modal content
			<div class="modal-content">
				<div class="modal-body text-center">
					<h3>
						Please select the <span>'{{errorMsg}}'</span>
					</h3>
					<button type="button" class="btn errorOk" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div> -->
		<div class="modal fade" id="errorMessage" role="dialog"
							style="margin-top: 12%;">
							<div class="modal-dialog">

								<!-- Modal content-->
								<div class="modal-content modal-info">
									<div class="modal-header"
										style="background-color: #2f515b; color: #fff;">
										<button type="button" class="close" data-dismiss="modal">&times;</button>
										<h4 class="modal-title" style="text-align: center;">Error</h4>
									</div>
									<div class="modal-body">
									<p
											style="text-align: center; font-size: 20px; margin-bottom: -10px;">
											Please select the {{errorMsg}}</p>
									</div>
									<div class="modal-footer" style="text-align: center;">
										<button type="button"
											class="btn btn-default btn-view text-center"
											data-dismiss="modal">Ok</button>
									</div>
								</div>

							</div>
						</div>
	<div id="fileNotFound" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content -->
			<div class="modal-content">
				<div class="modal-body text-center">
					<h3>
						Data is not available for selected facility
					</h3>
					<button type="button" class="btn errorOk" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="noDataModall" role="dialog"
							style="margin-top: 12%;">
							<div class="modal-dialog">

								<!-- Modal content-->
								<div class="modal-content modal-info">
									<div class="modal-header"
										style="background-color: #2f515b; color: #fff;">
										<button type="button" class="close" data-dismiss="modal">&times;</button>
										<h4 class="modal-title" style="text-align: center;">Info</h4>
									</div>
									<div class="modal-body">
										<p
											style="text-align: center; font-size: 20px; margin-bottom: -10px;">NO
											DATA AVAILABLE</p>
									</div>
									<div class="modal-footer" style="text-align: center;">
										<button type="button"
											class="btn btn-default btn-view text-center "
											data-dismiss="modal">Ok</button>
									</div>
								</div>

							</div>
						</div>
	
	<jsp:include page="fragments/footer.jsp"></jsp:include>
	<spring:url value="/webjars/angularjs/1.2.16/angular.min.js"
		var="angularmin" />
	<script src="${angularmin}" type="text/javascript"></script>
	<spring:url value="/webjars/angularjs/1.2.16/angular-animate.min.js"
		var="angularaAnimatemin" />
	<script src="${angularaAnimatemin}" type="text/javascript"></script>
	<script>
		var app = angular.module("reportApp", [ 'ngAnimate' ]);
		var myAppConstructor = angular.module('reportApp');
	</script>
	<script src="resources/js/angularservices/services.js"
		type="text/javascript"></script>
	<script src="resources/js/angularcontrollers/facilityImprovementPlanCtrl.js"
		type="text/javascript"></script>
	<!-- <script src="resources/js/angularController/loginController.js"></script> -->
	<script type="text/javascript">
		$("#msgBox").show().delay(2000).fadeOut(400);
		$(".min-height-wrap").css("min-height", $(window).height())
	</script>
</body>
</html>