/**
 * 
 */
package org.sdrc.dga.service;

import java.util.List;

import org.sdrc.dga.model.ProgramModel;
import org.sdrc.dga.model.UserProgramXFormModel;
import org.sdrc.dga.model.ValueObject;
import org.sdrc.dga.model.XFormWithProgramModel;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 *
 */
@Service
@Scope(proxyMode=ScopedProxyMode.TARGET_CLASS)
public class UserServiceManagementImpl implements UserServiceManagement {

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#editProgram(org.sdrc.dga.model.ProgramModel)
	 */
	@Override
	public boolean editProgram(ProgramModel programModel) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#isProgramXformMappingAvail(java.lang.Integer)
	 */
	@Override
	public ValueObject isProgramXformMappingAvail(Integer programId) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#archiveProgramAfterConfirmation(java.lang.Integer)
	 */
	@Override
	public boolean archiveProgramAfterConfirmation(Integer programId) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#editXForm(org.sdrc.dga.model.XFormWithProgramModel, org.springframework.web.multipart.MultipartFile)
	 */
	@Override
	public boolean editXForm(XFormWithProgramModel xFormWithProgramModel,
			MultipartFile file) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#isUserAssignedToXForm(java.lang.Integer, java.lang.String)
	 */
	@Override
	public ValueObject isUserAssignedToXForm(Integer xFormId, String actionType) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#archiveXFormAfterConfirmation(java.lang.Integer)
	 */
	@Override
	public boolean archiveXFormAfterConfirmation(Integer xFormId) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#editUser(org.sdrc.dga.model.UserProgramXFormModel)
	 */
	@Override
	public boolean editUser(UserProgramXFormModel userProgramXFormModel) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#getAllUsers()
	 */
	@Override
	public List<UserProgramXFormModel> getAllUsers() {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#archiveUser(java.lang.Integer)
	 */
	@Override
	public boolean archiveUser(Integer userId) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#editUserXformMappingData(org.sdrc.dga.model.UserProgramXFormModel)
	 */
	@Override
	public boolean editUserXformMappingData(
			UserProgramXFormModel userProgramXFormModel) {
		// TODO Auto-generated method stub
		return false;
	}

	/* (non-Javadoc)
	 * @see org.sdrc.dga.service.UserServiceManagement#archiveUpxm(java.lang.Integer)
	 */
	@Override
	public boolean archiveUpxm(Integer upxmId) {
		// TODO Auto-generated method stub
		return false;
	}

}
