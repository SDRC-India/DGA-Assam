package org.sdrc.dga.web;

import java.io.IOException;
import java.util.List;

import org.sdrc.dga.core.Authorize;
import org.sdrc.dga.model.AreaModel;
import org.sdrc.dga.model.CrossTabDataModel;
import org.sdrc.dga.model.CrossTabDropDownData;
import org.sdrc.dga.model.CrossTabModel;
import org.sdrc.dga.model.SectorModel;
import org.sdrc.dga.model.TimePeriodModel;
import org.sdrc.dga.service.FIPService;
import org.sdrc.dga.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Harsh
 * @since version 1.0.0.0
 *
 */

@Controller
public class ReportsController 
{
	
	@Autowired
	private ReportService reportService;
	
	
	@Autowired
	private FIPService fIPService;
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("/getAllSectors")
	@ResponseBody
	List<SectorModel> getAllSectors()
	{
		return reportService.getAllSectors();
	}
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("/getAllTimePeriods")
	@ResponseBody
	List<TimePeriodModel> getTimePeriods()
	{
		return reportService.getAllTimePeriod();
	}
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("/getSummary")
	@ResponseBody
	Object getSummaryData(@RequestParam("checklistId")Integer checklistId,@RequestParam("sectionId")Integer sectionId,@RequestParam("timperiodNid")
	Integer timperiodNid)
	{
		return reportService.fetchSummaryforSectorAndTimePeriod(
				 checklistId, sectionId, timperiodNid);
	}
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("/getRawData")
	@ResponseBody
	Object getRawData(@RequestParam("division")Integer division,@RequestParam("checklistId")Integer checklistId,@RequestParam("sectionId")Integer sectionId,@RequestParam("timperiodNid")
	Integer timperiodNid)
	{
		return reportService.fetchRawDataforSectorAndTimePeriodAndDivsion(division,
				 checklistId, sectionId, timperiodNid);
	}
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("report")
	String reportPage()
	{
		return "report";
	}
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("/getFacilitiesForCrossTab")
	@ResponseBody
	List<CrossTabModel> getFacilitiesForCrossTab()
	{
		return reportService.getFacilitiesForCrossTab();
	}
	
	@Authorize(feature="report",permission="View")
	@RequestMapping("/getAllDistricts")
	@ResponseBody
	List<AreaModel> getAllDistricts()
	{
		return reportService.getAllDistricts();
	}
	
	@Authorize(feature="CrossTab",permission="View")
	@RequestMapping("/getCrossTabData")
	@ResponseBody
	Object getCrossTabData(@RequestParam("id")int facilityId,@RequestParam("colid")int colId,@RequestParam("rowid")int rowid,@RequestParam("areaId")int areaid)
	{
		return reportService.getCrossTabData(facilityId,colId,rowid,areaid);
	}
	
	// crossTabReport page
	
	@Authorize(feature="CrossTab",permission="View")
	@RequestMapping("crossTabReport")
	String crossTabReportPage()
	{
		return "dyanamicCrossTabReport";
	}
	
	@Authorize(feature="FIP",permission="View")
	@RequestMapping("getAllFacilityList")
	@ResponseBody
	Object getAllFacilityList()
	{
		return reportService.getAlFacilitiesList();
	}
	
	@Authorize(feature="FIP",permission="View")
	@RequestMapping("getFIPReport")
	@ResponseBody
	String getFIPReport(@RequestParam("areaCode")String areaCode) throws IOException
	{
		return fIPService.generateFIP(areaCode);
	}
	
	
	@Authorize(feature="FIP",permission="View")
	@RequestMapping("facilityImprovementPlan")
	String facilityImprovementPlanPage()
	{
		return "facilityImprovementPlan";
	}
	
	
	@Authorize(feature="CrossTab",permission="View")
	@RequestMapping("crossTabDropDownData")
	@ResponseBody
	CrossTabDropDownData crossTabDropDownData()
	{
		return reportService.getCrossTabDropDown();
	}
	
	@Authorize(feature="CrossTab",permission="View")
	@RequestMapping("/getCrossTabTableData")
	@ResponseBody
	Object getCrossTabTableData(@RequestBody CrossTabDataModel crossTabDataModel)
	{
		return reportService.getCrossTabTableData(crossTabDataModel);
	}
	
}
