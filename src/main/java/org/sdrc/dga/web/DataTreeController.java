package org.sdrc.dga.web;
/**
 * 
 * @author Harsh (harsh@sdrc.co.in)
 *
 */
import java.util.List;
import java.util.Map;

import org.sdrc.dga.core.Authorize;
import org.sdrc.dga.model.BubbleDataModel;
import org.sdrc.dga.service.DataTreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
@Controller
public class DataTreeController {
	
	@Autowired 
	private DataTreeService dataTreeService;
	
	@Authorize(feature="dataTree",permission="View")
	@RequestMapping("/bubbleChartData")
	@ResponseBody
	public List<BubbleDataModel> getBubbleChartData(@RequestParam("sectorId")Integer sectorId,@RequestParam("areaId") int areaId,@RequestParam("timeperiodId") int timeperiodId)
	{
		return dataTreeService.getBubbleChartData(sectorId,areaId,timeperiodId);
	}
	
	@Authorize(feature="dataTree",permission="View")
	@RequestMapping("/treeData")
	@ResponseBody
	public Map<String, Object> fetchTreeData()
	{
		return dataTreeService.fetchTreeData();
	}
	
	@Authorize(feature="dataTree",permission="View")
	@RequestMapping("/forceLayoutData")
	@ResponseBody
	public Map<String, Object> forceLayoutData(@RequestParam("sectorId")Integer sectorId,@RequestParam("areaId")Integer areaId,@RequestParam("timeperiodId") int timeperiodId)
	{
		return dataTreeService.forceLayoutData(sectorId,areaId,timeperiodId);
	}
	@Authorize(feature="dataTree",permission="View")
	@RequestMapping("dataTree")
	public String dataTreePage()
	{
		return "dataTree";
	}
	

}
