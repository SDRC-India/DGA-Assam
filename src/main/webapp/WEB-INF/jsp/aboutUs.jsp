<!-- 
@author Devikrushna 
 -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>

<html>
<head>

<title>DGA-About Us</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png" type="image/x-icon">
<meta name="viewport" content="width=device-width, initial-scale=1">
<spring:url value="/webjars/jquery/2.0.3/jquery.min.js" var="jQuery" />
<script src="${jQuery}"></script>
<spring:url value="/webjars/bootstrap/3.1.1/js/bootstrap.min.js"
	var="bootstrapjs" />
<script src="${bootstrapjs}"></script>
<script src="resources/js/bootstrap-dropdownhover.min.js"></script>
<spring:url value="/webjars/bootstrap/3.1.1/css/bootstrap.min.css"
	var="bootstrapCss" />
<link href="${bootstrapCss}" rel="stylesheet" />
<link rel="stylesheet"
	href="resources/css/bootstrap-dropdownhover.min.css">
<link rel="stylesheet" href="resources/css/customLoader.css">
<link href='https://fonts.googleapis.com/css?family=Ubuntu:400,300'
	rel='stylesheet' type='text/css'>
<spring:url value="resources/css/style.css" var="styleCss" />
<link href="${styleCss}" rel="stylesheet" />
<script
	src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
<spring:url value="/webjars/jquery-ui/1.10.3/themes/base/jquery-ui.css"
	var="jQueryUiCss" />
<link href="${jQueryUiCss}" rel="stylesheet"></link>
<spring:url value="/webjars/font-awesome/4.6.1/css/font-awesome.min.css"
	var="fontawesomeCss" />
<link href="${fontawesomeCss}" rel="stylesheet" />


</head>

<body>
	<jsp:include page="fragments/header.jsp"></jsp:include>

	<div id="mymain" class="container report-height">




		<form class="sitesection" name="siteForm">
			<div class="col-md-12 col-sm-12 col-xs-12">

				<div class="">
					<h3>About DGA</h3>
				</div>
				<p class="termsdata">District Gap Analysis is a process which
					will largely focus on the assessment of the gaps of facilities in
					terms of availability, accessibility, utilization and quality of
					the Public health system. DGA can strengthen the primary level,
					community level and District level facilities to address the state
					its specific needs. DGA is proposed to understand the current
					scenario of the health system in terms of service availability and
					accessibility. The gap analysis enhances the coordination between
					state and the district and block level. It was carried out in
					Collaboration with National Health Mission, Assam with technical
					and design support from UNICEF, Assam and powered by SDRC,
					Bhubaneswar.</p>


				<div class="blank-45"></div>

				<div class="terms-margin">
					<h3>Goal/Aim of DGA</h3>
				</div>
				<p class="termsdata">DGA can strengthen the primary level,
					community level and District level facilities to address the state
					its specific needs. DGA is proposed to understand the current
					scenario of the health system in terms of service availability and
					accessibility. The gap analysis enhances the coordination between
					state and the district and block level.</p>
				<div class="blank-45"></div>

				<div class="terms-margin">
					<h3>Purpose of DGA</h3>
				</div>
				<p class="termsdata">An effective gap analysis looks deeply at
					the standards, making sure to identify any changes in the intent,
					goals, and implications. This gap analysis mainly focuses on
					Delivery point and aspects or indicator which is related to labor
					room to improve maternal health and child survival. DGA provides a
					common understanding on the procedure and levels of assessment that
					state needs to undertake for better planning. A detailed gap
					analysis that is translated into local plans and budgets, there is
					a far greater likelihood of successfully implementing a resource
					re-allocation process to achieve the desired goal.</p>

			</div>
		</form>
	</div>




	<jsp:include page="fragments/footer.jsp"></jsp:include>


	<script type="text/javascript">
		$("#msgBox").show().delay(2000).fadeOut(400);
	</script>

</body>

</html>