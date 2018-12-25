<!DOCTYPE html>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page import="org.sdrc.dga.util.Constants"%>


<html lang="en">
<head>
<title>DGA-Contact</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png"
	type="image/x-icon">
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
<link rel="stylesheet" href="resources/css/bootstrap-dropdownhover.min.css">
<link rel="stylesheet" href="resources/css/customLoader.css">
<link href='http://fonts.googleapis.com/css?family=Ubuntu:400,300'
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

<style type="text/css">
.node {
	cursor: pointer;
}

.node circle {
	fill: #fff;
	stroke: steelblue;
	stroke-width: 1.5px;
}

.node text {
	cursor: pointer;
	font: 10px sans-serif;
}

.link {
	fill: none;
	stroke: #ccc;
	stroke-width: 1.5px;
}
</style>
<body>
	<jsp:include page="fragments/header.jsp"></jsp:include>
	<div class="container-fluid content-section">
		<div class="col-md-12 heading-contact"><h3>Contact</h3></div>
		<div class="col-md-6" style="margin-bottom: 50px;">

			<h5>UNICEF Office for Chhattisgarh </h5>
			Katora Talab, Civil Lines,<br>
			 Raipur, Chhattisgarh 492001, India <br><br>
			 <b>Dr Ajay Trakroo</b><br>
			<b>Mail to: </b> <a href="mailto:atrakroo@unicef.org">atrakroo@unicef.org </a><br>
		</div>
		<div class="col-md-6 text-center">
			<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14875.381216149184!2d81.6499434!3d21.2379821!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xd8662716da34f504!2sUNICEF!5e0!3m2!1sen!2sin!4v1491405989522" width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>
		</div>
	</div>
</body>
<jsp:include page="fragments/footer.jsp"></jsp:include>
</html>
