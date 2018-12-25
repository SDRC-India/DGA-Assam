<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page import="org.sdrc.dga.util.Constants"%>
<!DOCTYPE html>

<html ng-app="reportApp">


<!-- end  header row -->
<%
if(request.getSession().getAttribute(
		Constants.USER_PRINCIPAL)==null)
{
	response.sendRedirect("");
}
%>
<head>
<title>DGA-Raw</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png"
	type="image/x-icon">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<link rel="stylesheet" href="resources/css/bootstrap.min.css">
<link rel="stylesheet" href="resources/css/bootstrap-dropdownhover.min.css">
<link rel="stylesheet" href="resources/css/font-awesome.min.css">
<link rel="stylesheet" href="resources/css/customLoader.css">
<link rel="stylesheet" href="resources/css/style.css">
<spring:url value="/webjars/jquery/2.0.3/jquery.min.js" var="jQuery" />
<script src="${jQuery}"></script>
<spring:url value="/webjars/bootstrap/3.1.1/js/bootstrap.min.js"
	var="bootstrapjs" />
<script src="${bootstrapjs}"></script>
<script src="resources/js/bootstrap-dropdownhover.min.js"></script>
<!-- <script src="resources/js/angular.min.js"></script> -->

</head>

<body ng-controller="ReportController" ng-cloak>
	<!-- spinner -->
	<div id="spinner" class="loader" style="display: none;"></div>
	<div id="loader-mask" class="loader" style="display: none;"></div>
	<!-- /spinner -->

	<jsp:include page="fragments/header.jsp"></jsp:include>

	<div id="mymain" class="container-fluid min-height-wrap">
		<form class="selection" name="selctionForm">
			<div class="select-container text-center col-md-3">
				<div class="input-group">
					<input type="text" placeholder="Facility Type *" id="facilityType"
						class="form-control not-visible-input" name="facilityType"
						readonly="" ng-model="selectedFacility.iC_Name"
						oninvalid="this.setCustomValidity('Please select Facility Type')">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="facility in allFacilities"
								ng-click="selectFacility(facility)"><a href="">{{facility.iC_Name}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="select-container text-center col-md-3">
				<div class="input-group ">
					<input type="text" placeholder="Section *" id="section"
						class="form-control not-visible-input" readonly=""
						ng-model="selectedSection.iC_Name" required>
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="section in selectedFacility.children"
								ng-click="selectSection(section)"><a href="">{{section.iC_Name}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="select-container text-center col-md-3">
				<div class="input-group ">
					<input type="text" placeholder="Subsection" id="subsection"
						class="form-control not-visible-input" readonly=""
						ng-model="selectedSubsection.iC_Name">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button" ng-disabled="!selectedSection.children.length">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="subsection in selectedSection.children"
								ng-click="selectSubsection(subsection)"><a href="">{{subsection.iC_Name}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="select-container text-center col-md-3">
				<div class="input-group ">
					<input type="text" placeholder="Time Period *" id="timePeriod"
						class="form-control not-visible-input" readonly=""
						ng-model="selectedTimepriod.timePeriod">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="timeperiod in allTimeperiods"
								ng-click="selectTimeperiod(timeperiod)"><a href="">{{timeperiod.timePeriod}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="col-md-12 text-right" style="margin: 10px 0;">
				<button type="submit" class="submit-selection"
					ng-click="getTableData()">Submit</button>
			</div>
		</form>
		<div id="main-content">
			<button class="submit-selection" ng-if="tableData.length"
				style="float: right; background-color: #37393d;"
				ng-click="exportTableData('dataTable')">
				<i class="fa fa-download" aria-hidden="true"></i> Download Excel
			</button>
			<div class=" table-responsive" style="width: 100%">
				<table items="tableData" show-filter="true" cellpadding="0"
					cellspacing="0" border="0" class="dataTable table table-bordered"
					id="dataTable" ng-class="{'dhSelected':selectedFacility.iC_NId==17}">
					<thead>
						<tr>
							<th ng-repeat="column in columns | filter:removeRowId"
								ng-click="order(column)" style="position: relative;">{{column}}
								<div class="sorting1">
									<i class="fa fa-caret-up asc" aria-hidden="true"
										ng-class="{'hiding': !(sortType != column || sortReverse == true)}"></i>
									<i class="fa fa-caret-down dsc" aria-hidden="true"
										ng-class="{'hiding': !(sortType != column || sortReverse == false)}"></i>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							ng-repeat="rowData in tableData | orderBy:filterType:sortReverse">
							<td ng-repeat="column in columns | filter:removeRowId"
								ng-class="{'total':$parent.$last}"
								sortable="'{{rowData.column}}'"
								ng-click="$first && selectedFacility.iC_NId != 17 && !$parent.$last?getBlockTable(rowData):''">{{filterFloat(rowData[column])}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<!-- Modal for division table -->
	<div id="divisionTable" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content -->
			<div class="modal-content">
				<div class="modal-body">
					<button class="submit-selection" ng-if="tableData.length"
				style="background-color: #37393d;"
				ng-click="exportTableData('divisionalDataTable')">
				<i class="fa fa-download" aria-hidden="true"></i> Download Excel
			</button>
			<button type="button" class="close" data-dismiss="modal">×</button>
					<div class=" table-responsive" style="width: 100%">
						<table items="tableData" show-filter="true" cellpadding="0"
							cellspacing="0" border="0" class="dataTable table table-bordered"
							id="divisionalDataTable">
							<thead>
								<tr>
									<th ng-repeat="column in divisionalTableColumns"
										ng-click="order(column)" style="position: relative;">{{column}}
										<div class="sorting1">
											<i class="fa fa-caret-up asc" aria-hidden="true"
												ng-class="{'hiding': !(sortType != column || sortReverse == true)}"></i>
											<i class="fa fa-caret-down dsc" aria-hidden="true"
												ng-class="{'hiding': !(sortType != column || sortReverse == false)}"></i>
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									ng-repeat="rowData in divisionalTableData | orderBy:filterType:sortReverse">
									<td ng-repeat="column in divisionalTableColumns"
										sortable="'{{rowData.column}}'">{{filterFloat(rowData[column])}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Modal for error message -->
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
	<script src="resources/js/angularcontrollers/reportCtrl.js"
		type="text/javascript"></script>
	<!-- <script src="resources/js/angularController/loginController.js"></script> -->
	<script type="text/javascript">
		$("#msgBox").show().delay(2000).fadeOut(400);
		$(".min-height-wrap").css("min-height", $(window).height())
	</script>
</body>
</html>