<!-- Modal -->
	<div id="loginModal" class="modal fade" role="dialog">
		<div class="modal-dialog" style="width: 550px;">

			<!-- Modal content-->
					<div class="modern-p-form" style="background-color: #FFF;">
						<div class="login-container">
							<div id="login" class="p-shadowed">

								<div class="form-container">
									<h3>Login</h3>
									<form action="login" method="post"
										class="modern-p-form p-form-modern-purple">
										<div class="">
											<div class="form-group">
												<label for="email1">Username</label>
												<div class="input-group p-has-icon">
													<input type=text id="username" name="username"
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
												<button class="btn loginbtn" type="submit"
													style="width: 150px;">Submit</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>

		</div>
	</div>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<footer id="foot">
	
	<section class="bottomfooter">
		<div class="row footer-section">
			<div class="col-md-6 col-xs-12 col-sm-12 footer-left">
			<span style="    font-size: 14px; font-weight: bolder;">© 2018 DGA</span> 
<!-- 			District Facility Gap analysis was done in collaboration with Directorate of Health Services,
			<br>CG/National Health Mission, CG with Technical and design support from UNICEF. -->
			</div>
		
			<div class="col-md-3 col-xs-12 col-sm-12 disclamer-section">
			<a href="termsofUse" >Terms of Use</a> | <a class="copyright1"
						href="disclaimer" >Disclaimer</a> | <a href="privacyPolicy" >Privacy
						Policy</a> | <a href="sitemap" >Sitemap</a>
			</div>
			
			<div class="col-md-2 col-xs-12 col-sm-12 footer-right">
				<span class="footerfont">Powered by </span><a
					href="http://sdrc.co.in/" target="_blank" class="text_deco_none"><span
					class="poweredbysdrc">SDRC</span></a>
			</div>
		</div>

	</section>

</footer>


