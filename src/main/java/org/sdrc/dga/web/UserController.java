/**
 * 
 */
package org.sdrc.dga.web;

import java.util.List;

import org.sdrc.dga.model.ProgramModel;
import org.sdrc.dga.model.UserProgramXFormModel;
import org.sdrc.dga.model.ValueObject;
import org.sdrc.dga.model.XFormWithProgramModel;
import org.sdrc.dga.service.UserServiceManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 *
 */

@Controller
public class UserController {
	
	@Autowired
	UserServiceManagement userServiceManagement;

	
	@RequestMapping(value = "/editProgram", method = RequestMethod.POST)
	@ResponseBody
	public boolean editProgram(@RequestBody ProgramModel programModel)
			throws Exception {
		return userServiceManagement.editProgram(programModel);
	}

	
	@RequestMapping(value = "/deleteProgram", method = RequestMethod.POST)
	@ResponseBody
	public ValueObject deleteProgram(
			@RequestParam("programId") Integer programId) throws Exception {
		return userServiceManagement.isProgramXformMappingAvail(programId);
	}

	@RequestMapping(value = "/deleteProgramConf", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteProgramAfterConfirmation(
			@RequestParam("programId") Integer programId) throws Exception {
		return userServiceManagement.archiveProgramAfterConfirmation(programId);
	}

	@RequestMapping(value = "/editXForm", method = RequestMethod.POST, consumes = { "multipart/form-data" })
	@ResponseBody
	public boolean editXForm(
			@RequestPart(value = "model") XFormWithProgramModel xFormWithProgramModel,
			@RequestPart(value = "file", required = false) MultipartFile file)
			throws Exception {
		return userServiceManagement.editXForm(xFormWithProgramModel, file);
	}

	@RequestMapping(value = "/deleteXForm", method = RequestMethod.POST)
	@ResponseBody
	public ValueObject deleteXForm(@RequestParam("xFormId") Integer xFormId,
			@RequestParam("actionType") String actionType) throws Exception {
		return userServiceManagement.isUserAssignedToXForm(xFormId, actionType);
	}

	@RequestMapping(value = "/deleteXFormConf", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteXFormAfterConfirmation(
			@RequestParam("xFormId") Integer xFormId) throws Exception {
		return userServiceManagement.archiveXFormAfterConfirmation(xFormId);
	}

	
	@RequestMapping(value = "/editUser", method = RequestMethod.POST)
	@ResponseBody
	public boolean editUser(
			@RequestBody UserProgramXFormModel userProgramXFormModel)
			throws Exception {
		return userServiceManagement.editUser(userProgramXFormModel);
	}

	@RequestMapping(value = "/getAllUser")
	@ResponseBody
	public List<UserProgramXFormModel> getAllUser() throws Exception {
		return userServiceManagement.getAllUsers();
	}

	
	@RequestMapping(value = "/deleteUser", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteUser(@RequestParam("userId") Integer userId)
			throws Exception {
		return userServiceManagement.archiveUser(userId);
	}

	
	@RequestMapping(value = "/editUpxm", method = RequestMethod.POST)
	@ResponseBody
	public boolean editUpxm(
			@RequestBody UserProgramXFormModel userProgramXFormModel)
			throws Exception {
		return userServiceManagement.editUserXformMappingData(userProgramXFormModel);
	}

	
	@RequestMapping(value = "/deleteUPXM", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteUpxm(@RequestParam("upxmId") Integer upxmId)
			throws Exception {
		return userServiceManagement.archiveUpxm(upxmId);
	}
	
	
}
