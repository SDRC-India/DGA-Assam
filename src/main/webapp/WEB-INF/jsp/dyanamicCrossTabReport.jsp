<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page import="org.sdrc.dga.util.Constants"%>
<!DOCTYPE html>

<html ng-app="crossTabReportApp">


<!-- end  header row -->
<%
if(request.getSession().getAttribute(
		Constants.USER_PRINCIPAL)==null)
{
	response.sendRedirect("");
}
%>
<head>
<title>DGA-Cross-tab</title>
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
	<link href="${pageContext.request.contextPath}/webjars/jquery-ui/1.10.3/themes/base/jquery-ui.css" rel="stylesheet"></link>
<script src="${bootstrapjs}"></script>
<script src="resources/js/bootstrap-dropdownhover.min.js"></script>
<!-- <script src="resources/js/angular.min.js"></script> -->
<style type="text/css">
/* 	#dataTable.table-bordered{
		border: none;
	} */
	#dataTable th{
		border-top: 1px solid #ddd;
		border-bottom: none;
		background-color: #f4f4f4;
		min-width:100px;
	}
	#dataTable.table-no-total td:first-child{
		background-color: #f4f4f4;
		font-weight: bold;
		color: #000;
	}
		#dataTable.table-no-total td{
		text-align:center;
		min-width:100px;
	}
	#dataTable.table-no-total td:first-child{
		background-color: #f4f4f4;
		color: #000;
		text-align:left;
		min-width:100px;
	}
</style>

</head>

<body ng-controller="CrossTabReportController" ng-cloak>
	<!-- spinner -->
	<div id="spinner" class="loader" style="display: none;"></div>
	<div id="loader-mask" class="loader" style="display: none;"></div>
	<!-- /spinner -->

	<jsp:include page="fragments/header.jsp"></jsp:include>
<%-- 	<div id="errMsg" class="text-center">
		<serror:Error id="msgBox" errorList="${formError}"
			cssInfClass="${className}">
		</serror:Error>
	</div> --%>
	<div  class="container-fluid min-height-wrap">
	<form class="selection" name="selctionForm">
		
			<div class="select-container text-center col-md-4">
				<div class="text-left">Facility Type *</div>
				<div class="input-group">
					<input type="text" placeholder="Facility Type *" id="facilityType"
						class="form-control not-visible-input" name="facilityType"
						readonly="" ng-model="selectedFacility.label" 
						oninvalid="this.setCustomValidity('Please select Facility Type')">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="facility in allFacilities"
								ng-click="selectFacility(facility)"><a href="">{{facility.label}}</a></li>
						</ul>
					</div>
				</div>
			</div>
			
			<div class="select-container text-center col-md-4">
				<div class="text-left">State/District *</div>
				<div class="input-group ">
					<input type="text" placeholder="State/District *" id="district"
						class="form-control not-visible-input" readonly=""
						ng-model="selectedDistrict.areaName">
					<div class="input-group-btn" style="position: relative;">
						<button data-toggle="dropdown"
							class="btn btn-color dropdown-toggle" type="button">
							<i class="fa fa-list"></i>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li ng-repeat="district in allDistricts"
								ng-click="selectDistrict(district)" ng-class="{'allDistDropdown': $index == 0}"><a href="">{{district.areaName}}</a></li>
						</ul>
					</div>
				</div>
			</div> 
			<div class="select-container text-center col-md-4">
				<div class="text-left">Time Period *</div>
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
			<div style="margin-top: 68px;">
			
		<div class="select-container text-center col-md-5">
			<div class="text-left">Row Indicator *</div>
				<div class="input-group ">
					<input type="text" placeholder="Type to search row indicator"
													id="searchColoumnIndicator" class="form-control not-visible-input"
													name="searchFacility" ng-model="colIndicator"
													ng-disabled="!selectedFacility"
													ng-keyup="searchColoumnIndicator()"
													ng-click="searchColoumnIndicator()"
													title="{{colIndicator}}"
													>
												<div class="input-group-btn" style="position: relative;">
													<button data-toggle="dropdown" class="btn btn-color"
														type="button" ng-click="searchColoumnIndicator()">
														<i class="fa fa-search"></i>
													</button>
												</div>
				</div>
			</div> 
			
							<div class="select-container text-center col-md-5 ">
					<div class="text-left">Column Indicator *</div>
				<div class="input-group ">
					<input type="text" placeholder="Type to search column indicator"
													id="searchRowIndicator" class="form-control not-visible-input"
													name="searchFacility" ng-model="rowIndicator" ng-disabled="!selectedFacility"
													ng-keyup="searchRowIndicator()"
													ng-click="searchRowIndicator()"
													ng-click="searchRowIndicator()"
													title="{{rowIndicator}}"
													>
												<div class="input-group-btn" style="position: relative;">
													<button data-toggle="dropdown" class="btn btn-color"
														type="button">
														<i class="fa fa-search"></i>
													</button>
												</div>
				</div>
			</div> 
			
		<div class="col-md-2 text-right " style="margin-top: 18px;" >
				<button type="submit" class="submit-selection submit-crossTab"
					ng-click="getTableData()">Submit</button>
			</div>
			
			</div>
				
		</form>
		<div id="main-content" ng-show="tableValue['data']">
			<button class="submit-selection" ng-if="tableData.length"
				style="float: right; background-color: #37393d;"
				ng-click="exportTableData('dataTable')">
				<i class="fa fa-download" aria-hidden="true"></i> Download Excel
			</button>
			<div class=" table-responsive" style="width: 100%  ;overflow-y:auto ; margin-bottom: 41px;">
				<table items="tableData" show-filter="true" cellpadding="0"
					cellspacing="0" border="0" class="dataTable table-no-total table table-bordered"
					id="dataTable">
					<thead>
					
						<tr>
								<th
							 style="position: relative;" colspan="1" rowspan="{{selectedTimepriodResult.timePeriod_Nid!=0 ? 1:2}}">
							</th>
							<th ng-repeat="column in upperHead"
								ng-click="selectedTimepriodResult.timePeriod_Nid!=0 ?order(tableHeader[column][0].description) :''" style="position: relative;" colspan="{{selectedTimepriodResult.timePeriod_Nid==0 ?tableHeader[column].length : 1}}" rowspan="1">{{column}}
									<div  class="sorting1" ng-show="selectedTimepriodResult.timePeriod_Nid!=0 ">
									<i class="fa fa-caret-up asc" aria-hidden="true"
										ng-class="{'hiding': !(sortType != tableHeader[column][0].description || sortReverse == true)}"></i>
									<i class="fa fa-caret-down dsc" aria-hidden="true"
										ng-class="{'hiding': !(sortType != tableHeader[column][0].description || sortReverse == false)}"></i>
								</div>
							</th>
						</tr>
						<tr ng-if="selectedTimepriodResult.timePeriod_Nid==0">
						<th ng-repeat="head in lowHeader"
								ng-click="order(head.description)" style="position: relative;">{{head.key}}
								<div  class="sorting1">
									<i class="fa fa-caret-up asc" aria-hidden="true"
										ng-class="{'hiding': !(sortType != head.description || sortReverse == true)}"></i>
									<i class="fa fa-caret-down dsc" aria-hidden="true"
										ng-class="{'hiding': !(sortType != head.description || sortReverse == false)}"></i>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							ng-repeat="rowData in tableData | orderBy:filterType:sortReverse">
							<td ng-repeat="column in columns"
								sortable="'{{rowData.column}}'"
								>{{rowData[column]}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	
	<!-- Modal for error message -->
	<!-- <div id="errorMessage" class="modal fade" role="dialog">
		<div class="modal-dialog">
			Modal content
			<div class="modal-content ">
				<div class="modal-body text-center">
					<h3>Please select the <span>'{{errorMsg}}'</span></h3>
					<button type="button" class="btn errorOk" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>	
	 -->
	
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
											class="btn btn-default btn-view text-center"
											data-dismiss="modal">Ok</button>
									</div>
								</div>

							</div>
						</div>
	<jsp:include page="fragments/footer.jsp"></jsp:include>	
	<script src="resources/js/jquery-ui.js"></script>
	<spring:url value="/webjars/angularjs/1.2.16/angular.min.js"
		var="angularmin" />
	<script src="${angularmin}" type="text/javascript"></script>
	<spring:url value="/webjars/angularjs/1.2.16/angular-animate.min.js"
		var="angularaAnimatemin" />
	<script src="${angularaAnimatemin}" type="text/javascript"></script>
	<script>
		var app = angular.module("crossTabReportApp", [ 'ngAnimate']);
		var myAppConstructor = angular.module('crossTabReportApp');
	</script>
	<script src="resources/js/angularservices/services.js"
		type="text/javascript"></script>
	<script src="resources/js/angularcontrollers/crossTabController.js"
		type="text/javascript"></script>
	<!-- <script src="resources/js/angularController/loginController.js"></script> -->
	<script type="text/javascript">
		$("#msgBox").show().delay(2000).fadeOut(400);
		$(".min-height-wrap").css("min-height", $(window).height())
	</script>
</body>
</html>