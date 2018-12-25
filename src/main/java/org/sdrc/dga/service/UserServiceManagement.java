/**
 * 
 */
package org.sdrc.dga.service;

import java.util.List;

import org.sdrc.dga.model.ProgramModel;
import org.sdrc.dga.model.UserProgramXFormModel;
import org.sdrc.dga.model.ValueObject;
import org.sdrc.dga.model.XFormWithProgramModel;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 *
 */
public interface UserServiceManagement {

	boolean editProgram(ProgramModel programModel);

	ValueObject isProgramXformMappingAvail(Integer programId);

	boolean archiveProgramAfterConfirmation(Integer programId);

	boolean editXForm(XFormWithProgramModel xFormWithProgramModel,
			MultipartFile file);

	ValueObject isUserAssignedToXForm(Integer xFormId, String actionType);

	boolean archiveXFormAfterConfirmation(Integer xFormId);

	boolean editUser(UserProgramXFormModel userProgramXFormModel);

	List<UserProgramXFormModel> getAllUsers();

	boolean archiveUser(Integer userId);

	boolean editUserXformMappingData(UserProgramXFormModel userProgramXFormModel);

	boolean archiveUpxm(Integer upxmId);

}
