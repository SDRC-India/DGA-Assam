<!DOCTYPE html> 

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%@ page import="org.slf4j.Logger"%>
<%@ page import="org.slf4j.LoggerFactory"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page import="java.io.StringWriter"%>

<html lang="en">
<head>
<title>DGA</title>
<link rel="shortcut icon" href="resources/images/DGA.png"
	type="image/x-icon">
<link rel="icon" href="resources/images/DGA.png"
	type="image/x-icon">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<link rel="stylesheet" href="resources/css/bootstrap.min.css">
<link rel="stylesheet" href="resources/css/font-awesome.min.css">
<link rel="stylesheet" href="resources/css/style.css">
<style type="text/css">
.bottomfooter {
   margin-top: 39px;
}
</style>
</head>
<body>
<div id="wrapper">
		<jsp:include page="fragments/header.jsp" />
		<div class="content">
			<div class="container-fluid text-center" style="margin: 133px auto;">
    <spring:url value="resources/images/exception.png" var="petsImage"/>
    <img src="${petsImage}"/>

    <h2>Oops !!! Looks like you are caught in a wrong place ...</h2>
    <h4>Please try again in sometime, while we are fixing this up.</h4>

    <p>${exception.message}</p>

	<%Logger logger = LoggerFactory.getLogger(Exception.class);
	
	RuntimeException rte = (RuntimeException)(request.getAttribute("exception"));
	StackTraceElement[] stes = rte != null ? rte.getStackTrace() : null;
	
	if(stes != null && stes.length >0){
		
		 StringWriter stringWritter = new StringWriter();
	     PrintWriter printWritter = new PrintWriter(stringWritter, true);
	     ((RuntimeException)(request.getAttribute("exception"))).printStackTrace(printWritter);
	     printWritter.flush();
	     stringWritter.flush(); 
		
	     logger.error("An exception occourred , Stack Trace :" + stringWritter.toString());
	     
// 		logger.error(((RuntimeException)(request.getAttribute("exception"))).printStackTrace(logger));
// 		for(StackTraceElement ste : stes)
// 		logger.error(ste);
	}%>
    <!-- Exception: ${exception.message}.
		  	<c:forEach items="${exception.stackTrace}" var="stackTrace"> 
				${stackTrace} 
			</c:forEach>
	  	-->
</div>

</div></div>
<jsp:include page="fragments/footer.jsp"/>
<spring:url value="/webjars/jquery/2.0.3/jquery.min.js" var="jQuery" />
<script src="${jQuery}"></script>
<spring:url value="/webjars/bootstrap/3.1.1/js/bootstrap.min.js"
	var="bootstrapjs" />
<script src="${bootstrapjs}"></script>
</body>

</html>
