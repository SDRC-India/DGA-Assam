/**
 * 
 */
package org.sdrc.dga.web;

import org.sdrc.dga.model.CollectUserModel;
import org.sdrc.dga.service.MasterRawDataService;
import org.sdrc.dga.service.ODKService;
import org.sdrc.dga.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 * This controller is not meant for the use in production enviroment .
 * All database update will be donw using this controller
 */

@Controller
@RequestMapping("database")
public class DatabaseManagementController {

	@Autowired
	private MasterRawDataService masterRawDataService;
	
	
	@Autowired
	private ODKService odkService;
	
	@Autowired
	private ResourceBundleMessageSource messages;
	
	@Autowired
	private UserService userService;
	
	
	@RequestMapping("insertXpathsUptoQuestionLevel")
	@ResponseBody
	String insertXpaths() throws Exception
	{
		return masterRawDataService.getAllFormXpathScoreMappingUptoQuestionLevel();
	}
	
	
	
	@RequestMapping("generateXpath")
	@ResponseBody
	boolean generateXpath() throws Exception
	{
		return masterRawDataService.generateXpath();
	}
	
	
	@RequestMapping("updateRawData")
	@ResponseBody
	boolean updateRawData() throws Exception
	{
		return masterRawDataService.persistRawData();
		
	}
	
	@RequestMapping("/updateFacilityScore")
	@ResponseBody
	public boolean updateFacilityScore() throws Exception
	{
		return odkService.updateFacilityScore();
	}
	
	@RequestMapping("updateRawDataOfDataTree")
	@ResponseBody
	boolean updateRawDataOfDataTree() throws Exception
	{
		
		return odkService.updateDataTreeData();
	}
	
	@RequestMapping("updateXformMapping")
	@ResponseBody
	boolean updateXformMapping() throws Exception
	{
		
		return odkService.updateXformMapping();
	}
	
	
	@RequestMapping("/insertCrossTabIndicator")
	@ResponseBody
	public boolean insertCrossTabIndicator() throws Exception
	{
		return masterRawDataService.insertCrossTabIndicatorXpath();
	}
	
	
	@RequestMapping("/folderStructure")
	@ResponseBody
	public boolean folderStructure() throws Exception
	{
		return masterRawDataService.createFoldersOfImages();
	}
	
	@RequestMapping("/updateLatLong")
	@ResponseBody
	public boolean updateLatLong() throws Exception
	{
		return masterRawDataService.updateLatitudeLogitudeOfSubmission();
	}
	
	@RequestMapping(value="updatePassword",method=RequestMethod.POST)
	@ResponseBody
	boolean updatePassword(@RequestBody CollectUserModel collectUserModel,@RequestHeader("secret") String secret)throws Exception
	{
		if(secret!=null && secret.equalsIgnoreCase(messages.getMessage("secret.code", null,null)))
		return userService.updatePassword(collectUserModel);
		else
		return false;
	}
	
	@RequestMapping(value="updateArea",method=RequestMethod.GET)
	@ResponseBody
	boolean updateArea()
	{
		try {
		return masterRawDataService.updateArea();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
		}
	
	@RequestMapping("insertUserTable")
	@ResponseBody
	boolean insertUserTable()
	{
		return userService.insertUserTable();
	}
	
	
	@RequestMapping("configureUserDatabase")
	@ResponseBody
	boolean configureUserDatabase()
	{
		return userService.configureUserDatabase();
	}
}
