<%@ page import="org.sdrc.dga.util.Constants"%>
<%@ page import="org.sdrc.dga.model.CollectUserModel"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="org.sdrc.dga.model.FeatureModel"%>
<%@page
	import="org.sdrc.dga.model.UserRoleFeaturePermissionMappingModel"%>

<%
	CollectUserModel user = null;
	List<String> features = new ArrayList<String>();
	List<String> permissions = new ArrayList<String>();
	List<FeatureModel> featureModels = new ArrayList<FeatureModel>();
	Integer roleId = 0;
	if (request.getSession().getAttribute(Constants.USER_PRINCIPAL) == null) {
	} else if (request.getSession().getAttribute(Constants.USER_PRINCIPAL) != null) {
		user = (CollectUserModel) request.getSession().getAttribute(Constants.USER_PRINCIPAL);

		List<UserRoleFeaturePermissionMappingModel> ursMappings = new ArrayList<UserRoleFeaturePermissionMappingModel>();
		ursMappings = user != null ? user.getUserRoleFeaturePermissionMappings() : null;
		if (ursMappings != null && !ursMappings.isEmpty()) {
			for (UserRoleFeaturePermissionMappingModel ursm : ursMappings) {
				FeatureModel featureModel = new FeatureModel();

				features.add(ursm.getRoleFeaturePermissionSchemeModel().getFeaturePermissionMapping()
						.getFeature().getFeatureName());

				featureModel.setFeatureName(ursm.getRoleFeaturePermissionSchemeModel()
						.getFeaturePermissionMapping().getFeature().getFeatureName());
				featureModel.setDescription(ursm.getRoleFeaturePermissionSchemeModel()
						.getFeaturePermissionMapping().getFeature().getDescription());
				permissions.add(ursm.getRoleFeaturePermissionSchemeModel().getFeaturePermissionMapping()
						.getPermission().getPermissionName());

				featureModels.add(featureModel);

			}
		}

		roleId = user.getUserRoleFeaturePermissionMappings().get(0).getRoleFeaturePermissionSchemeModel()
				.getRole().getRoleId();
	}
%>
<script>
	var roleId =
<%=roleId%>
	
</script>
<link href='https://fonts.googleapis.com/css?family=Ubuntu:400,300'
	rel='stylesheet' type='text/css'>
<style>
.navHeaderCollapse2 {
	width: 41.66666667%;
}

.container-fluid {
	width: 95%;
}
</style>
<div class="container-fluid header-nav">
	<!-- <div class="col-md-6 logoresize">
		<div class="heading_partDesktop heading_part">
			<h2 class="headerinfo">District Gap Analysis<span style="font-size: 12px; color: #22b369;">&nbsp; 1.0.1</span></h2>
		</div>
	</div> -->

</div>
<!--logo part end-->
<nav class="navbar nav-menu-container">
	<button class="navbar-toggle custom-navbar-mobile" style="z-index: 777"
		data-toggle="collapse" data-target=".navHeaderCollapse2">
		<span class="icon-bar"></span> <span class="icon-bar"></span> <span
			class="icon-bar"></span>
	</button>
	<div class="container-fluid">
		<div class="">
			<div class="col-md-4 navbar-header">
				<div class="logoresize">
					<div class="heading_partDesktop heading_part">
						<h2 class="headerinfo">
							District Gap Analysis<span
								style="font-size: 12px; color: #79bdf8;">&nbsp; 2.1.0</span>
						</h2>
					</div>
				</div>
			</div>
			<div class="col-md-2 user-welcome text-right">
				<%
					if (user != null) {
				%>

				<h5>
					Welcome<span>&nbsp; <%=user.getName() + "(" + user.getUserRoleFeaturePermissionMappings().get(0)
						.getRoleFeaturePermissionSchemeModel().getSchemeName() + ")"%></span>
				</h5>

				<%
					}
				%>
			</div>
			<div class="col-md-6 collapse navbar-collapse navHeaderCollapse2">
				<ul class="nav navbar-nav navbar-right nav-submenu nav-place-right">

					<li class="active"><a href="home">Home</a></li>

					<%
						if (features.contains("dashboard")) {
					%>
					<li><a href="dashboard">Dashboard</a></li>
					<%
						}
					%>
					<%
						if (features.contains("dataTree")) {
					%>
					<li><a href="dataTree">DataTree</a></li>
					<%
						}
					%>
					<%
						if (features.contains("report") || features.contains("CrossTab") || features.contains("RawData")) {
					%>
					<li class="dropdown"><a class="dropdown-toggle"
						data-toggle="dropdown" href="#">Report&nbsp;<span
							class="caret"></span></a>
						<ul class="dropdown-menu nav-menu-dropdown"
							style="overflow: inherit;">
							<%
								if (features.contains("report")) {
							%>
							<li><a href="report">Summary Report</a></li>
							<%
								}
									if (features.contains("CrossTab")) {
							%>
							<li><a href="crossTabReport">Cross-tab Report</a></li>
							<%
								}
									if (features.contains("RawData")) {
							%>
							<li class="dropdown rawReport"><a class="dropdown-toggle"
								type="button" data-toggle="dropdown" data-hover="dropdown"
								href="#">Raw Report <span class="caret"
									style="border-left-color: #FFF"></span>
							</a>
								<ul class="dropdown-menu" style="padding: 0">
									<li><a
										href="resources/rawData/DGA_Assam_PHC_Raw_Data.xlsx">
											Download PHC Report Phase 1</a></li>
									<li><a
										href="resources/rawData/DGA_Assam_CHC_Raw_Data.xlsx">
											Download CHC Report Phase 1</a></li>
									<li><a href="resources/rawData/DGA_Assam_DH_Raw_Data.xlsx">
											Download DH Report Phase 1</a></li>
									<li><a
										href="resources/rawData/DGA Assam_Combine_Report.xlsx">
											Download Combined Report Phase 1</a></li>
								</ul></li>
							<%
								}
							%>
						</ul></li>

					<%
						}
						if (features.contains("FIP")) {
					%>
					<li><a href="facilityImprovementPlan">FIP</a></li>

					<%
						}
					%>
					<li><a href="aboutUs">About Us</a></li>
					<!-- <li><a href="contactUS">Contact</a></li> -->
					<%
						if (user == null) {
					%>
					<li><a data-toggle="modal" data-target="#loginModal" href="#">Login</a></li>
					<%
						} else {
					%>
					<li><a href="logout">Logout</a></li>
					<%
						}
					%>
				</ul>
			</div>
		</div>
	</div>
</nav>
