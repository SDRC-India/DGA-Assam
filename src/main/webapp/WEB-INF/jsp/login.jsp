<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>

<html>
<head>

<title>DGA-Login</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png"
	type="image/x-icon">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<link rel="stylesheet" href="resources/css/bootstrap.min.css">
<link rel="stylesheet" href="resources/css/font-awesome.min.css">
<link rel="stylesheet"
	href="resources/css/customLoader.css">
<link rel="stylesheet" href="resources/css/style.css">
<spring:url value="/webjars/jquery/2.0.3/jquery.min.js" var="jQuery" />
<script src="${jQuery}"></script>
<spring:url value="/webjars/bootstrap/3.1.1/js/bootstrap.min.js"
	var="bootstrapjs" />
<script src="${bootstrapjs}"></script>
<!-- <script src="resources/js/angular.min.js"></script> -->

</head>

<body>
	<!-- spinner -->
	<div id="spinner" class="loader" style="display: none;"></div>
	<div id="loader-mask" class="loader" style="display: none;"></div>
	<!-- /spinner -->

	<%-- <jsp:include page="fragments/header.jsp"></jsp:include> --%>
<%-- 	<div id="errMsg" class="text-center">
		<serror:Error id="msgBox" errorList="${formError}"
			cssInfClass="${className}">
		</serror:Error>
	</div> --%>
	<div class="container modern-p-form">
		<div class="login-container">
			<div id="login" class="p-shadowed">

				<div class="form-container">
					<h3>Login</h3>
					<form action="login" method="post"
						class="modern-p-form p-form-modern-purple">
						<div class="">
							<div class="form-group">
								<label for="email1">User Name</label>
								<div class="input-group p-has-icon">
									<input type="text" id="username" name="username"
										placeholder="username" class="form-control" required
										oninvalid="this.setCustomValidity('Please input your username')"
										oninput="setCustomValidity('')">
								</div>
							</div>
						</div>
						<div class="">
							<div class="form-group">
								<label for="password">Password</label>
								<div class="input-group p-has-icon">
									<input type="password" id="password" name="password"
										placeholder="password" class="form-control" required
										oninvalid="this.setCustomValidity('Please input your password')"
										oninput="setCustomValidity('')">
									</div>
							</div>
						</div>
						<div class="form-group">
							<div class="input-group text-center">
								<button class="btn loginbtn" type="submit" style="width: 150px;">Login</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
