<!-- 
@author Laxman (laxman@sdrc.co.in)
 -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>

<html>
<head>

<title>DGA-Home</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png" type="image/x-icon">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<link rel="stylesheet" href="resources/css/bootstrap.min.css">
<link rel="stylesheet"
	href="resources/css/bootstrap-dropdownhover.min.css">
<link rel="stylesheet" href="resources/css/font-awesome.min.css">
<link rel="stylesheet" href="resources/css/style.css">
<%@taglib prefix="serror" uri="/WEB-INF/ErrorDescripter.tld"%>
<spring:url value="/webjars/jquery/2.0.3/jquery.min.js" var="jQuery" />
<script src="${jQuery}"></script>
<spring:url value="/webjars/bootstrap/3.1.1/js/bootstrap.min.js"
	var="bootstrapjs" />
<script src="${bootstrapjs}"></script>
<!-- <script src="resources/js/angular.min.js"></script> -->
<script src="resources/js/bootstrap-dropdownhover.min.js"></script>
<style type="text/css">
</style>
</head>

<body>
	<jsp:include page="fragments/header.jsp"></jsp:include>
	<div id="errMsg" class="text-center">
		<serror:Error id="msgBox" errorList="${formError}"
			cssInfClass="${className}">
		</serror:Error>
	</div>
	<div id="mymain">
		<section id="homeslide">
			<div>
				<div>
					<div id="myCarousel" class="carousel slide" data-ride="carousel">
						<div class="carousel-inner" role="listbox">
							<div class="item img-height active">
								<img src="resources/images/DGAAssam1.jpg" alt="DGA Assam"
									width="100%;">
							</div>

							<div class="item img-height ">
								<img src="resources/images/DGAAssam2.jpg" alt="DGA Assam"
									width="100%;">
							</div>

							<div class="item img-height ">
								<img src="resources/images/DGAAssam3.jpg" alt="DGA Assam"
									width="100%;">
							</div>
							<div class="item img-height">
								<img src="resources/images/DGAAssam4.jpg" alt="DGA Assam"
									width="100%;">
							</div>
							<div class="item img-height">
								<img src="resources/images/DGAAssam5.jpg" alt="DGA Assam"
									width="100%;">
							</div>
						</div>
						<!-- Left and right controls -->
						<a class="left carousel-control" href="#myCarousel" role="button"
							data-slide="prev"> <span
							class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
							<span class="sr-only">Previous</span>
						</a> <a class="right carousel-control" href="#myCarousel"
							role="button" data-slide="next"> <span
							class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
							<span class="sr-only">Next</span>
						</a>
					</div>
				</div>
			</div>
		</section>
		<section class="important-logo" style="margin: 10px 0">
			<div class="container logos-container">
				<div class="row">
					<div class="col-md-4 text-center">
						<a href="https://assam.gov.in/" target="_blank"><img
							src="resources/images/Assam-Logo.png" alt="Assasm Logo"
							width="100%;" style="max-width: 120px;max-height: 104px;"></a>
					</div>
					<div class="col-md-4 text-center">
						<a href="http://unicef.in/" target="_blank"><img
							src="resources/images/unicef.png" alt="Unicef_logo" width="100%;"
							style="max-width: 120px;"></a>
					</div>
					<div class="col-md-4 text-center">
						<a href="http://nhm.gov.in/" target="_blank"><img
							src="resources/images/logo-nhm.png" alt="NHM Logo" width="100%;"
							style="max-width: 120px;"></a>
					</div>
				</div>
			</div>
		</section>
	</div>
	<jsp:include page="fragments/footer.jsp"></jsp:include>

</body>

</html>