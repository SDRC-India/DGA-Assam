package org.sdrc.dga.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.sdrc.devinfo.domain.UtAreaEn;
import org.sdrc.devinfo.domain.UtIndicatorClassificationsEn;
import org.sdrc.devinfo.domain.UtTimeperiod;
import org.sdrc.devinfo.repository.IndicatorClassificationRepository;
import org.sdrc.devinfo.repository.TimeperiodRepository;
import org.sdrc.devinfo.repository.UtAreaEnRepository;
import org.sdrc.devinfo.repository.Ut_Data_Repository;
import org.sdrc.dga.domain.Area;
import org.sdrc.dga.domain.FormXpathScoreMapping;
import org.sdrc.dga.domain.TimePeriod;
import org.sdrc.dga.model.AreaModel;
import org.sdrc.dga.model.CollectUserModel;
import org.sdrc.dga.model.CrossTabDataModel;
import org.sdrc.dga.model.CrossTabDropDownData;
import org.sdrc.dga.model.CrossTabModel;
import org.sdrc.dga.model.FormXpathScoreMappingModel;
import org.sdrc.dga.model.IndicatorFormXpathMappingModel;
import org.sdrc.dga.model.SectorModel;
import org.sdrc.dga.model.TimePeriodModel;
import org.sdrc.dga.model.ValueObject;
import org.sdrc.dga.repository.AreaRepository;
import org.sdrc.dga.repository.ChoiceDetailsRepository;
import org.sdrc.dga.repository.FormXpathScoreMappingRepository;
import org.sdrc.dga.repository.IndicatorFormXpathMappingRepository;
import org.sdrc.dga.repository.RawDataScoreRepository;
import org.sdrc.dga.repository.TimePeriodRepository;
import org.sdrc.dga.util.Constants;
import org.sdrc.dga.util.StateManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ReportServiceImpl implements ReportService {

	@Autowired
	private IndicatorClassificationRepository indicatorClassificationRepository;

	// devinfo timeperiod
	@Autowired
	private TimeperiodRepository timeperiodRepository;

	@Autowired
	private UtAreaEnRepository utAreaEnRepository;

	@Autowired
	private Ut_Data_Repository ut_Data_Repository;

	@Autowired
	private ResourceBundleMessageSource messages;

	@Autowired
	private StateManager stateManager;

	@Autowired
	private IndicatorFormXpathMappingRepository indicatorFormXpathMappingRepository;

	// web timeperiod
	@Autowired
	private TimePeriodRepository timePeriodRepository;

	@Autowired
	private AreaRepository areaRepository;

	@Autowired
	private FormXpathScoreMappingRepository formXpathScoreMappingRepository;

	@Autowired
	private RawDataScoreRepository rawDataScoreRepository;

	@Autowired
	private ChoiceDetailsRepository choiceDetailsRepository;

	@Override
	@Transactional(readOnly = true)
	public List<SectorModel> getAllSectors() {

		List<UtIndicatorClassificationsEn> utIndicatorClassificationsEns = indicatorClassificationRepository
				.getAllSectors();
		List<Object[]> timeperiodIusList = ut_Data_Repository.findTimePeriodAndIus();
		List<SectorModel> sectorsAndTimePeriods = new ArrayList<SectorModel>();
		List<Integer> timePeriodIds = new ArrayList<Integer>();
		for (UtIndicatorClassificationsEn utIndicatorClassificationsEn : utIndicatorClassificationsEns) {
			timePeriodIds = new ArrayList<Integer>();
			SectorModel sectorModel = new SectorModel();
			sectorModel.setiC_Name(utIndicatorClassificationsEn.getIC_Name());
			sectorModel.setiC_NId(utIndicatorClassificationsEn.getIC_NId());
			sectorModel.setiC_Parent_NId(utIndicatorClassificationsEn.getIC_Parent_NId());

			for (Object[] timeperiodIus : timeperiodIusList) {
				if (utIndicatorClassificationsEn.getIC_NId() == Integer.parseInt(timeperiodIus[1].toString())) {
					timePeriodIds.add(Integer.parseInt(timeperiodIus[0].toString()));

				}

			}

			sectorModel.setUtTimeperiods(timePeriodIds);
			sectorsAndTimePeriods.add(sectorModel);
		}
		// TODO Auto-generated method stub
		return sectorsAndTimePeriods;
	}

	@Override
	@Transactional(readOnly = true)
	public List<TimePeriodModel> getAllTimePeriod() {
		List<TimePeriodModel> timePeriodModels = new ArrayList<TimePeriodModel>();
		List<UtTimeperiod> utTimeperiods = timeperiodRepository.getAllTimePeriod();
		for (UtTimeperiod timeperiod : utTimeperiods) {
			TimePeriodModel periodModel = new TimePeriodModel();
			periodModel.setTimePeriod(timeperiod.getTimePeriod());
			periodModel.setTimePeriod_Nid(timeperiod.getTimePeriod_NId());

			timePeriodModels.add(periodModel);
		}
		// TODO Auto-generated method stub
		return timePeriodModels;
	}

	@Override
	@Transactional(readOnly = true)
	public Object fetchSummaryforSectorAndTimePeriod(Integer checklistId, Integer sectionId, Integer timperiodNid) {
		UtIndicatorClassificationsEn utIndicatorClassificationsEn = indicatorClassificationRepository
				.findOne(checklistId);
		Integer checkListId = utIndicatorClassificationsEn.getIC_NId();
		Integer sourceNid = 0;
		sourceNid = Integer.parseInt(messages.getMessage("source_" + checkListId.toString(), null, null));

		List<Map<String, String>> gridTableDataLists = new ArrayList<>();
		Map<String, String> indicatorNameValueMap = null;
		List<UtAreaEn> utAreaEns = utAreaEnRepository.getAllAreaByLevel(3);
		String area = null;
		switch (checkListId) {
		case 1: {
			area = "PHC";
		}
			;
			break;

		case 35: {
			area = "CHC";
		}
			;
			break;

		case 17: {
			area = "DH";
		}
			;
			break;

		case 111:
			area = "Facilities";

			break;
		}

		for (UtAreaEn areaEn : utAreaEns) {

			List<Object[]> dataSubmissionaggregate;

			
			dataSubmissionaggregate = ut_Data_Repository.getSubmissionSummary(sectionId, timperiodNid, sourceNid,
					areaEn.getArea_NId());

			indicatorNameValueMap = new LinkedHashMap<String, String>();

			if (dataSubmissionaggregate.isEmpty())
				continue;
			/*
			 * header name according to arealevel
			 */

			indicatorNameValueMap.put("rowId", String.valueOf(areaEn.getArea_NId()));// area Id

			indicatorNameValueMap.put("District", areaEn.getArea_Name());// areaName

			if ((!(sectionId == Integer.parseInt(messages.getMessage(area + "_Man_Power", null, null))
					|| sectionId == Integer.parseInt(messages.getMessage(area + "_Human_Resource", null, null))
					|| sectionId == Integer.parseInt(messages.getMessage(area + "_Training", null, null))))
					&& checklistId == Integer.parseInt(messages.getMessage("District_Hospital", null, null)))

			{
				for (Object[] utData : dataSubmissionaggregate) {
					/*
					 * indicator name ( sub group)
					 */
					indicatorNameValueMap.put(
							utData[0] == null ? "NA" : utData[0].toString() + "(" + utData[3].toString() + ")",
							utData[1] == null ? "NA" : utData[1].toString().equals("1.0") ? "Yes" : "No");
				}

			}

			else {
				for (Object[] utData : dataSubmissionaggregate) {
					/*
					 * indicator name ( sub group)
					 */
					indicatorNameValueMap.put(
							utData[0] == null ? "NA" : utData[0].toString() + "(" + utData[3].toString() + ")",
							utData[1] == null ? "NA" : utData[1].toString());
				}
			}
			gridTableDataLists.add(indicatorNameValueMap);
		}
		if (gridTableDataLists.isEmpty())
			return "No Data Available"; // for no data modal in view

		List<Object[]> dataSubmissionaggregate;


		dataSubmissionaggregate = ut_Data_Repository.getSubmissionSummary(sectionId, timperiodNid, sourceNid,
				Integer.parseInt(messages.getMessage("Area_Id", null, null)));

		indicatorNameValueMap = new LinkedHashMap<String, String>();
		/*
		 * header name according to arealevel
		 * 
		 */

		if (checklistId != Integer.parseInt(messages.getMessage("District_Hospital", null, null))) {
			indicatorNameValueMap.put("District", "Assam");// areaName

			for (Object[] utData : dataSubmissionaggregate) {
				/*
				 * indicator name ( sub group)
				 */
				indicatorNameValueMap.put(
						utData[0] == null ? "NA" : utData[0].toString() + "(" + utData[3].toString() + ")",
						utData[1] == null ? "NA" : utData[1].toString());
			}
			gridTableDataLists.add(indicatorNameValueMap);
		}

		return gridTableDataLists;

	}

	@Override
	@Transactional(readOnly = true)
	public Object fetchRawDataforSectorAndTimePeriodAndDivsion(Integer division, Integer checklistId, Integer sectionId,
			Integer timperiodNid) {
		UtIndicatorClassificationsEn utIndicatorClassificationsEn = indicatorClassificationRepository
				.findOne(checklistId);
		Integer checkListId = utIndicatorClassificationsEn.getIC_NId();
		Integer sourceNid = 0;
		String area = null;
		switch (checkListId) {
		case 1: {
			area = "PHC";
		}
			;
			break;

		case 35: {
			area = "CHC";
		}
			;
			break;

		case 17: {
			area = "DH";
		}
			;
			break;

		case 111:
			area = "Facilities";

			break;
		}
		sourceNid = Integer.parseInt(messages.getMessage("source_" + checkListId.toString(), null, null));

		List<Map<String, String>> gridTableDataLists = new ArrayList<>();
		Map<String, String> indicatorNameValueMap = null;
		List<UtAreaEn> utAreaEns = utAreaEnRepository.findByArea_Parent_NId(division);
		for (UtAreaEn areaEn : utAreaEns) {

			List<Object[]> dataSubmissionaggregate = ut_Data_Repository.getSubmissionSummary(sectionId, timperiodNid,
					sourceNid, areaEn.getArea_NId());
			indicatorNameValueMap = new LinkedHashMap<String, String>();

			if (dataSubmissionaggregate.isEmpty())
				continue;
			/*
			 * header name according to arealevel
			 */

			indicatorNameValueMap.put(area, areaEn.getArea_Name());// areaName

			if (sectionId == Integer.parseInt(messages.getMessage(area + "_Man_Power", null, null))
					|| sectionId == Integer.parseInt(messages.getMessage(area + "_Human_Resource", null, null))
					|| sectionId == Integer.parseInt(messages.getMessage(area + "_Training", null, null))) {
				for (Object[] utData : dataSubmissionaggregate) {
					/*
					 * indicator name ( sub group)
					 */
					indicatorNameValueMap.put(
							utData[0] == null ? "NA" : utData[0].toString() + "(" + utData[3].toString() + ")",
							utData[1] == null ? "NA" : utData[1].toString());
				}
				gridTableDataLists.add(indicatorNameValueMap);
			} else {
				for (Object[] utData : dataSubmissionaggregate) {
					/*
					 * indicator name ( sub group)
					 */
					// indicatorNameValueMap.put(utData[0]==null?"NA":utData[0].toString() ,
					// utData[1]==null?"NA":utData[1].toString());

					indicatorNameValueMap.put(
							utData[0] == null ? "NA" : utData[0].toString() + "(" + utData[3].toString() + ")",
							utData[1] == null ? "NA" : utData[1].toString().equals("1.0") ? "Yes" : "No");
				}
				gridTableDataLists.add(indicatorNameValueMap);
			}
		}
		if (gridTableDataLists.isEmpty())
			return "No Data Available";
		// TODO Auto-generated method stub
		return gridTableDataLists;
	}

	@Override
	@Transactional(readOnly = true)
	public List<CrossTabModel> getFacilitiesForCrossTab() {
		List<CrossTabModel> crossTabModels = new ArrayList<CrossTabModel>();
		CrossTabModel crossTabModel = new CrossTabModel();
		crossTabModel.setName("DH");
		crossTabModel.setParentid(-1);
		crossTabModel.setId(17);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("CHC");
		crossTabModel.setParentid(-1);
		crossTabModel.setId(35);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("PHC");
		crossTabModel.setParentid(-1);
		crossTabModel.setId(1);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("MO and SN");
		crossTabModel.setParentid(1);
		crossTabModel.setColid(87);
		crossTabModel.setRowid(92);
		crossTabModel.setId(-2);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("MO and SN");
		crossTabModel.setParentid(35);
		crossTabModel.setColid(712);
		crossTabModel.setRowid(713);
		crossTabModel.setId(-3);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("MO and SN");
		crossTabModel.setParentid(17);
		crossTabModel.setColid(625);
		crossTabModel.setRowid(634);
		crossTabModel.setId(-4);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("OBG And Paediatrician");
		crossTabModel.setParentid(35);
		crossTabModel.setColid(709);
		crossTabModel.setRowid(707);
		crossTabModel.setId(-5);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("OBG And Paediatrician");
		crossTabModel.setParentid(17);
		crossTabModel.setColid(617);
		crossTabModel.setRowid(618);
		crossTabModel.setId(-6);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("OBG And Anaesthetist ");
		crossTabModel.setParentid(35);
		crossTabModel.setColid(708);
		crossTabModel.setRowid(707);
		crossTabModel.setId(-7);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("OBG And Anaesthetist ");
		crossTabModel.setParentid(17);
		crossTabModel.setColid(618);
		crossTabModel.setRowid(616);
		crossTabModel.setId(-8);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("SNs trained in SBA and NSSK");
		crossTabModel.setParentid(35);// doubtfull
		crossTabModel.setColid(111);
		crossTabModel.setRowid(108);
		crossTabModel.setId(-9);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("SNs trained in SBA and NSSK");
		crossTabModel.setParentid(1);// doubtfull
		crossTabModel.setColid(111);
		crossTabModel.setRowid(108);
		crossTabModel.setId(-10);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("SNs trained in SBA and NSSK");
		crossTabModel.setParentid(17);
		crossTabModel.setColid(675);
		crossTabModel.setRowid(669);
		crossTabModel.setId(-11);
		crossTabModels.add(crossTabModel);

		// MOs trained in EmOC and LSAS

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("MOs trained in EmOC and LSAS");
		crossTabModel.setParentid(35);// doubt
		crossTabModel.setColid(725);
		crossTabModel.setRowid(106);
		crossTabModel.setId(-12);
		crossTabModels.add(crossTabModel);

		crossTabModel = new CrossTabModel();
		crossTabModel.setName("MOs trained in EmOC and LSAS");
		crossTabModel.setParentid(17);
		crossTabModel.setColid(667);
		crossTabModel.setRowid(666);
		crossTabModel.setId(-13);
		crossTabModels.add(crossTabModel);

		// TODO Auto-generated method stub
		return crossTabModels;
	}

	@Override
	@Transactional(readOnly = true)
	public List<AreaModel> getAllDistricts() {
		List<UtAreaEn> utAreaEns = utAreaEnRepository.getAllAreaByLevel(3);
		List<AreaModel> districtModels = new ArrayList<AreaModel>();

		AreaModel areaModel = new AreaModel();

		areaModel.setAreaId(0);
		areaModel.setAreaName("Assam");

		districtModels.add(areaModel);

		for (UtAreaEn district : utAreaEns) {
			areaModel = new AreaModel();
			areaModel.setAreaId(district.getArea_NId());
			areaModel.setAreaName(district.getArea_Name());
			areaModel.setAreaLevelId(district.getArea_Level());
			areaModel.setParentAreaId(district.getArea_Parent_NId());

			districtModels.add(areaModel);
		}
		// TODO Auto-generated method stub
		return districtModels;
	}

	@Override
	@Transactional(readOnly = true)
	public Object getCrossTabData(int facilityId, int colId, int rowid, int areaid) {
		List<Object[]> columnDatas;
		List<Object[]> rowDatas;
		List<Map<String, String>> gridTableDataLists = new ArrayList<>();

		Map<String, String> indicatorNameValueMap = new LinkedHashMap<String, String>();
		int sourceNid = Integer.parseInt(messages.getMessage(Integer.toString(facilityId), null, null));

		List<Object[]> maxMinTimePeriodId = new ArrayList<Object[]>();

		List<Integer> maxMinTime = new ArrayList<Integer>();
		if (areaid == 0) {
			maxMinTimePeriodId = ut_Data_Repository.findMaxMinTimePeriodForState();
			if (maxMinTimePeriodId.size() > 0) {
				if (maxMinTimePeriodId.get(0)[0] != null) {
					maxMinTime.add(Integer.parseInt(maxMinTimePeriodId.get(0)[0].toString()));
				}

				if (maxMinTimePeriodId.get(0)[1] != null
						&& !maxMinTime.contains(Integer.parseInt(maxMinTimePeriodId.get(0)[1].toString()))) {
					maxMinTime.add(Integer.parseInt(maxMinTimePeriodId.get(0)[1].toString()));
				}

			}
			columnDatas = ut_Data_Repository.getCrossTabData(facilityId, colId, sourceNid, maxMinTime);
			if (columnDatas.size() == 0) {
				return gridTableDataLists;
			}
			rowDatas = ut_Data_Repository.getCrossTabData(facilityId, rowid, sourceNid, maxMinTime);
		} else {
			maxMinTimePeriodId = ut_Data_Repository.findMaxMinTimePeriodForDistrict(areaid);
			if (maxMinTimePeriodId.size() > 0) {
				if (maxMinTimePeriodId.get(0)[0] != null) {
					maxMinTime.add(Integer.parseInt(maxMinTimePeriodId.get(0)[0].toString()));
				}

				if (maxMinTimePeriodId.get(0)[1] != null
						&& !maxMinTime.contains(Integer.parseInt(maxMinTimePeriodId.get(0)[1].toString()))) {
					maxMinTime.add(Integer.parseInt(maxMinTimePeriodId.get(0)[1].toString()));
				}
			}
			columnDatas = ut_Data_Repository.getCrossTabDataForDistrict(facilityId, colId, sourceNid, areaid,
					maxMinTime);
			if (columnDatas.size() == 0) {
				return gridTableDataLists;
			}
			rowDatas = ut_Data_Repository.getCrossTabDataForDistrict(facilityId, rowid, sourceNid, areaid, maxMinTime);
		}
		int i = 1;
		String subgroupName = null;
		String rowSubgroupName = null;
		Map<String, List<String>> timeIndicatorMap = new LinkedHashMap<String, List<String>>();
		while (i <= 3) {
			for (Object[] columnData : columnDatas) {
				if (i == 1 || i == 2) {
					subgroupName = "Atleast " + i;
				} else {
					subgroupName = "More Than " + (i - 1);
				}

				if (indicatorNameValueMap.isEmpty() || !indicatorNameValueMap.get(" ")
						.equalsIgnoreCase(columnData[0].toString() + "( " + subgroupName + " )"))

				{
					if (!indicatorNameValueMap.isEmpty()) {
						gridTableDataLists.add(indicatorNameValueMap);
					}
					indicatorNameValueMap = new LinkedHashMap<String, String>();
					indicatorNameValueMap.put(" ",
							columnData[0] == null ? "NA" : columnData[0].toString() + "( " + subgroupName + " )");
				}
				int j = 1;
				while (j <= 3) {
					if (j == 1 || j == 2) {
						rowSubgroupName = "Atleast " + j;
					} else {
						rowSubgroupName = "More Than " + (j - 1);
					}

					for (Object[] rowData : rowDatas) {
						if (columnData[1] != null && rowData[1] != null) {

							if (timeIndicatorMap.containsKey(rowData[0].toString() + "( " + rowSubgroupName + " )")) {
								if (!timeIndicatorMap.get(rowData[0].toString() + "( " + rowSubgroupName + " )")
										.contains(rowData[4].toString()))
									timeIndicatorMap.get(rowData[0].toString() + "( " + rowSubgroupName + " )")
											.add(rowData[4].toString());
							}

							else {
								List<String> timeList = new ArrayList<String>();
								timeList.add(rowData[4].toString());
								timeIndicatorMap.put(rowData[0].toString() + "( " + rowSubgroupName + " )", timeList);
							}

							if (Integer.parseInt(rowData[6].toString()) == Integer.parseInt(columnData[6].toString())
									&& Integer.parseInt(rowData[5].toString()) == Integer
											.parseInt(columnData[5].toString())
									&& Double.parseDouble((columnData[1].toString())) >= i
									&& Double.parseDouble(rowData[1].toString()) >= j) {
								if (indicatorNameValueMap.containsKey(rowData[0].toString() + "( " + rowSubgroupName
										+ " )" + rowData[4].toString())) {
									String value = indicatorNameValueMap.get(rowData[0].toString() + "( "
											+ rowSubgroupName + " )" + rowData[4].toString());

									Double val = Double.parseDouble(value) + 1;

									value = val.toString();

									indicatorNameValueMap.put(rowData[0].toString() + "( " + rowSubgroupName + " )"
											+ rowData[4].toString(), value);
								}

								else {

									indicatorNameValueMap.put(rowData[0].toString() + "( " + rowSubgroupName + " )"
											+ rowData[4].toString(), "1");
								}

							}

							else {
								if (!indicatorNameValueMap.containsKey(rowData[0].toString() + "( " + rowSubgroupName
										+ " )" + rowData[4].toString())) {

									indicatorNameValueMap.put(rowData[0].toString() + "( " + rowSubgroupName + " )"
											+ rowData[4].toString(), "0");
								}
							}
						}

					}
					j++;
				}
			}
			i++;
		}
		gridTableDataLists.add(indicatorNameValueMap);
		Map<String, Object> tableDatas = new LinkedHashMap<String, Object>();
		tableDatas.put("data", gridTableDataLists);
		tableDatas.put("header", timeIndicatorMap);
		List<ValueObject> valueObjects = new ArrayList<ValueObject>();
		timeIndicatorMap.forEach((k, v) -> {
			for (String s : v) {
				ValueObject valueObject = new ValueObject();
				valueObject.setKey(s);
				valueObject.setDescription(k + s);
				valueObjects.add(valueObject);
			}

		});
		tableDatas.put("lowHeader", valueObjects);
		return tableDatas;
	}

	@Override
	@Transactional(readOnly = true)
	public Object getAlFacilitiesList() {
		List<Area> areas = areaRepository.findAll();
		List<Area> utAreaEns = areas.stream().filter(d -> d.getAreaLevel().getAreaLevel() <= 5)
				.collect(Collectors.toList());
		List<Area> childAreaEns = areas.stream().filter(d -> d.getAreaLevel().getAreaLevel() > 5)
				.collect(Collectors.toList());

		String areaCode = ((CollectUserModel) stateManager.getValue(Constants.USER_PRINCIPAL))
				.getUserRoleFeaturePermissionMappings().get(0).getRoleFeaturePermissionSchemeModel().getAreaModel()
				.getAreaCode();

		Integer areaLevel = ((CollectUserModel) stateManager.getValue(Constants.USER_PRINCIPAL))
				.getUserRoleFeaturePermissionMappings().get(0).getRoleFeaturePermissionSchemeModel().getAreaModel()
				.getAreaLevelId();

		Map<Integer, Area> areaMap = new HashMap<Integer, Area>();

		for (Area areaEn : areas) {
			areaMap.put(areaEn.getAreaId(), areaEn);
		}
		List<String> facilities = new ArrayList<String>();

		facilities.add("DH");
		facilities.add("CHC");
		facilities.add("PHC");

		List<Map<String, Object>> mapList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> areamapList = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		for (String facility : facilities) {
			map = new HashMap<String, Object>();
			map.put("facilityType", facility);
			Map<String, Object> areaMaps = new HashMap<String, Object>();
			mapList = new ArrayList<Map<String, Object>>();
			if (areaLevel < 4) {
				for (Area utAreaEn : utAreaEns.stream().filter(d -> d.getAreaLevel().getAreaLevelId() == 4)
						.collect(Collectors.toList())) {
					areaMaps = new HashMap<String, Object>();

					{
						areaMaps.put("district", utAreaEn.getAreaName());
						List<Map<String, Object>> facilitiesList = new ArrayList<Map<String, Object>>();
						Map<String, Object> mapFacility = new HashMap<String, Object>();

						for (Area childArea : childAreaEns) {
							mapFacility = new HashMap<String, Object>();

							if (facility.equalsIgnoreCase("DH")) {
								if (areaMap.get((childArea.getParentAreaId())).getAreaId() == utAreaEn.getAreaId()
										&& childArea.getAreaLevel().getAreaLevelId() == 6) {

									mapFacility.put("Name", childArea.getAreaName());
									mapFacility.put("code", childArea.getAreaCode());
									{
										mapFacility.put("dataAvailable", true);
									}
									facilitiesList.add(mapFacility);
								}

							} else if (facility.equalsIgnoreCase("CHC")) {

								if (areaMap.get(areaMap.get(childArea.getParentAreaId()).getParentAreaId())
										.getAreaId() == utAreaEn.getAreaId()
										&& childArea.getAreaLevel().getAreaLevelId() == 7) {

									mapFacility.put("Name", childArea.getAreaName());
									mapFacility.put("code", childArea.getAreaCode());
									{
										mapFacility.put("dataAvailable", true);
									}
									facilitiesList.add(mapFacility);
								}
							}

							else {
								if (areaMap.get(areaMap.get(childArea.getParentAreaId()).getParentAreaId())
										.getAreaId() == utAreaEn.getAreaId()
										&& childArea.getAreaLevel().getAreaLevelId() == 8) {

									mapFacility.put("Name", childArea.getAreaName());
									mapFacility.put("code", childArea.getAreaCode());
									{
										mapFacility.put("dataAvailable", true);
									}
									facilitiesList.add(mapFacility);
								}

							}

						}
						areaMaps.put("facility", facilitiesList);

						mapList.add(areaMaps);
					}
				}

				map.put("districts", mapList);
				areamapList.add(map);
			} else if (areaLevel >= 4) {

				for (Area utAreaEn : utAreaEns.stream().filter(d -> d.getAreaCode().equalsIgnoreCase(areaCode))
						.collect(Collectors.toList())) {
					areaMaps = new HashMap<String, Object>();

					{
						areaMaps.put("district", utAreaEn.getAreaName());
						List<Map<String, Object>> facilitiesList = new ArrayList<Map<String, Object>>();
						Map<String, Object> mapFacility = new HashMap<String, Object>();

						for (Area childArea : childAreaEns) {
							mapFacility = new HashMap<String, Object>();

							if (facility.equalsIgnoreCase("DH")) {
								if (areaMap.get((childArea.getParentAreaId())).getAreaId() == utAreaEn.getAreaId()
										&& childArea.getAreaLevel().getAreaLevelId() == 6) {

									mapFacility.put("Name", childArea.getAreaName());
									mapFacility.put("code", childArea.getAreaCode());
									{
										mapFacility.put("dataAvailable", true);
									}
									facilitiesList.add(mapFacility);
								}

							} else if (facility.equalsIgnoreCase("CHC")) {

								if (areaMap.get(areaMap.get(childArea.getParentAreaId()).getParentAreaId())
										.getAreaId() == utAreaEn.getAreaId()
										&& childArea.getAreaLevel().getAreaLevelId() == 7) {

									mapFacility.put("Name", childArea.getAreaName());
									mapFacility.put("code", childArea.getAreaCode());
									{
										mapFacility.put("dataAvailable", true);
									}
									facilitiesList.add(mapFacility);
								}
							}

							else {
								if (areaMap.get(areaMap.get(childArea.getParentAreaId()).getParentAreaId())
										.getAreaId() == utAreaEn.getAreaId()
										&& childArea.getAreaLevel().getAreaLevelId() == 8) {

									mapFacility.put("Name", childArea.getAreaName());
									mapFacility.put("code", childArea.getAreaCode());
									{
										mapFacility.put("dataAvailable", true);
									}

									facilitiesList.add(mapFacility);
								}

							}

						}
						areaMaps.put("facility", facilitiesList);

						mapList.add(areaMaps);
					}
				}

				map.put("districts", mapList);
				areamapList.add(map);

			}
		}
		return areamapList;

	}

	@Override
	@Transactional(readOnly = true)
	public CrossTabDropDownData getCrossTabDropDown() {
		List<Object[]> indicatorFormXpathMappingList = indicatorFormXpathMappingRepository.findDistinctLabels();
		List<IndicatorFormXpathMappingModel> indicatorFormXpathMappingModels = new ArrayList<IndicatorFormXpathMappingModel>();

		IndicatorFormXpathMappingModel formXpathMappingModel = new IndicatorFormXpathMappingModel();
		formXpathMappingModel.setIndicatorFormXpathMappingId(0);
		formXpathMappingModel.setLabel("Number of Facilities assessed");
		formXpathMappingModel.setChcXpath(0);
		formXpathMappingModel.setPhcXpath(0);
		formXpathMappingModel.setDhXpath(0);
		formXpathMappingModel.setType("Facility");
		indicatorFormXpathMappingModels.add(formXpathMappingModel);

		for (Object[] formXpathMapping : indicatorFormXpathMappingList) {
			formXpathMappingModel = new IndicatorFormXpathMappingModel();
			formXpathMappingModel.setIndicatorFormXpathMappingId(Integer.parseInt(formXpathMapping[0].toString()));
			formXpathMappingModel.setLabel(formXpathMapping[1].toString());
			formXpathMappingModel
					.setChcXpath(formXpathMapping[5] == null ? 0 : Integer.parseInt(formXpathMapping[5].toString()));
			formXpathMappingModel
					.setPhcXpath(formXpathMapping[6] == null ? 0 : Integer.parseInt(formXpathMapping[6].toString()));
			formXpathMappingModel
					.setDhXpath(formXpathMapping[4] == null ? 0 : Integer.parseInt(formXpathMapping[4].toString()));
			formXpathMappingModel.setType(formXpathMapping[2].toString());
			indicatorFormXpathMappingModels.add(formXpathMappingModel);
		}
		CollectUserModel collectUserModel = (CollectUserModel) stateManager.getValue(Constants.USER_PRINCIPAL);
		Integer areaLevelId = collectUserModel.getUserRoleFeaturePermissionMappings().get(0)
				.getRoleFeaturePermissionSchemeModel().getAreaModel().getAreaLevelId();
		Integer parentAreaId = collectUserModel.getUserRoleFeaturePermissionMappings().get(0)
				.getRoleFeaturePermissionSchemeModel().getAreaModel().getParentAreaId();

		// if Logged in user of District type then only its own District will be
		// displayed
		List<AreaModel> districtModels = new ArrayList<AreaModel>();
		if (areaLevelId > 3 && parentAreaId != -1) {
			districtModels.add(collectUserModel.getUserRoleFeaturePermissionMappings().get(0)
					.getRoleFeaturePermissionSchemeModel().getAreaModel());
		} else {
			// if of national or guest or admin type then all the areas
			List<Area> districts = areaRepository.findByAreaLevelAreaLevelId(4);

			AreaModel areaModel = new AreaModel();

			areaModel.setAreaId(0);
			areaModel.setAreaName("Assam");

			districtModels.add(areaModel);

			for (Area district : districts) {
				areaModel = new AreaModel();
				areaModel.setAreaId(district.getAreaId());
				areaModel.setAreaName(district.getAreaName());
				areaModel.setAreaLevelId(district.getAreaLevel().getAreaLevelId());
				areaModel.setParentAreaId(district.getParentAreaId());

				districtModels.add(areaModel);
			}
		}

		List<TimePeriodModel> timePeriodModels = new ArrayList<TimePeriodModel>();
		List<TimePeriod> timePeriods = timePeriodRepository.findAll();
		Collections.reverse(timePeriods);
		for (TimePeriod timeperiod : timePeriods) {
			TimePeriodModel periodModel = new TimePeriodModel();
			periodModel.setTimePeriod(timeperiod.getTimeperiod());
			periodModel.setTimePeriod_Nid(timeperiod.getTimePeriodId());

			timePeriodModels.add(periodModel);
		}

		TimePeriodModel periodModel = new TimePeriodModel();
		periodModel.setTimePeriod("All");
		periodModel.setTimePeriod_Nid(0);
		timePeriodModels.add(periodModel);

		List<FormXpathScoreMapping> formXpathScoreMappings = formXpathScoreMappingRepository.findByParentXpathId(-1);
		/* formXpathScoreMapping */
		List<FormXpathScoreMappingModel> formXpathScoreMappingModels = new ArrayList<FormXpathScoreMappingModel>();

		// Getting the parent Sectors
		for (FormXpathScoreMapping formXpathScoreMapping : formXpathScoreMappings) {
			FormXpathScoreMappingModel formXpathScoreMappingModel = new FormXpathScoreMappingModel();
			formXpathScoreMappingModel.setFormXpathScoreId(formXpathScoreMapping.getFormXpathScoreId());
			// Slicing the name as DB Consist the name as Total SCore OF DH for every Sector
			formXpathScoreMappingModel.setLabel(formXpathScoreMapping.getLabel().split("Total score for")[1]);
			formXpathScoreMappingModel.setFormId(formXpathScoreMapping.getForm().getFormId());

			formXpathScoreMappingModels.add(formXpathScoreMappingModel);
		}

		FormXpathScoreMappingModel formXpathScoreMappingModel = new FormXpathScoreMappingModel();
		formXpathScoreMappingModel.setFormXpathScoreId(0);
		// Slicing the name as DB Consist the name as Total SCore OF DH for every Sector
		formXpathScoreMappingModel.setLabel("All");
		formXpathScoreMappingModel.setFormId(0);
		formXpathScoreMappingModels.add(formXpathScoreMappingModel);

		CrossTabDropDownData crossTabDropDownData = new CrossTabDropDownData();

		crossTabDropDownData.setAreaList(districtModels);
		crossTabDropDownData.setFormXpathScoreMappingModels(formXpathScoreMappingModels);
		crossTabDropDownData.setIndicatorFormXpathMappingModels(indicatorFormXpathMappingModels);
		crossTabDropDownData.setTimePeriodModels(timePeriodModels);

		return crossTabDropDownData;
	}

	@Override
	@Transactional(readOnly = true)
	public Object getCrossTabTableData(CrossTabDataModel crossTabDataModel) {

		List<Integer> xPathsIdCol = new ArrayList<Integer>();
		xPathsIdCol.add(crossTabDataModel.getColChcXpath());
		xPathsIdCol.add(crossTabDataModel.getColPhcXpath());
		xPathsIdCol.add(crossTabDataModel.getColDhXpath());

		List<Integer> xPathsRow = new ArrayList<Integer>();
		xPathsRow.add(crossTabDataModel.getRowChcXpath());
		xPathsRow.add(crossTabDataModel.getRowPhcXpath());
		xPathsRow.add(crossTabDataModel.getRowDhXpath());

		CollectUserModel collectUserModel = (CollectUserModel) stateManager.getValue(Constants.USER_PRINCIPAL);
		Integer areaLevelId = collectUserModel.getUserRoleFeaturePermissionMappings().get(0)
				.getRoleFeaturePermissionSchemeModel().getAreaModel().getAreaLevelId();
		Integer parentAreaId = collectUserModel.getUserRoleFeaturePermissionMappings().get(0)
				.getRoleFeaturePermissionSchemeModel().getAreaModel().getParentAreaId();

		// if Logged in user of District type then only its own District will be
		// displayed
		if (areaLevelId > 3 && parentAreaId != -1) {
			crossTabDataModel.setDistrictId(collectUserModel.getUserRoleFeaturePermissionMappings().get(0)
					.getRoleFeaturePermissionSchemeModel().getAreaModel().getAreaId());
		}

		if (crossTabDataModel.getColIndicatorFormXpathMappingId() != 0) {
			if (!(crossTabDataModel.getColIndicatorFormXpathMappingType().equalsIgnoreCase("integer")
					|| crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))) {
				return getCrossTabForChoiceIndicators(crossTabDataModel, xPathsIdCol, xPathsRow);
			} else {
				return getCrossTabForAnyIntegerIndicator(crossTabDataModel, xPathsIdCol, xPathsRow);
			}
		}

		else {
			return getFacilityWiseCrossTabData(crossTabDataModel, xPathsIdCol, xPathsRow);
		}
	}

	private Object getCrossTabForChoiceIndicators(CrossTabDataModel crossTabDataModel, List<Integer> xPathsIdCol,
			List<Integer> xPathsRow) {
		List<Object[]> crossTabDatas = new ArrayList<Object[]>();
		if (crossTabDataModel.getDistrictId() != 0) {
			if (crossTabDataModel.getTimePeriodId() != 0)
				crossTabDatas = rawDataScoreRepository.findCrossTabReportForADistrictAndATimePeriod(xPathsRow,
						xPathsIdCol, crossTabDataModel.getTimePeriodId(), crossTabDataModel.getDistrictId());

			else
				crossTabDatas = rawDataScoreRepository.findCrossTabReportForADistrictAndAllTimePeriod(xPathsRow,
						xPathsIdCol, crossTabDataModel.getDistrictId());
		}

		else if (crossTabDataModel.getDistrictId() == 0) {
			if (crossTabDataModel.getTimePeriodId() != 0)
				crossTabDatas = rawDataScoreRepository.findCrossTabReportForATimePeriod(xPathsRow, xPathsIdCol,
						crossTabDataModel.getTimePeriodId());

			else
				crossTabDatas = rawDataScoreRepository.findCrossTabReportForAllTimePeriod(xPathsRow, xPathsIdCol);
		}

		Map<String, Object> tableDatas = new LinkedHashMap<String, Object>();

		Set<String> colSubGroups = choiceDetailsRepository.findByXpathIdAndType(xPathsIdCol);
		colSubGroups.add("Total");

		Set<String> rowSubGroups = choiceDetailsRepository.findByXpathIdAndType(xPathsRow);
		rowSubGroups.add("Total");

		Set<String> timePeriods = new LinkedHashSet<String>();
		if (crossTabDataModel.getTimePeriodId() != 0) {
			timePeriods
					.add(timePeriodRepository.findByTimePeriodId(crossTabDataModel.getTimePeriodId()).getTimeperiod());
		} else {
			timePeriods = timePeriodRepository.findTimePeriods();
		}
		Map<String, String> dataMap = new LinkedHashMap<String, String>();

		for (Object[] crossTabData : crossTabDatas) {
			dataMap.put(
					crossTabData[1].toString() + "_" + crossTabData[2].toString() + "_" + crossTabData[3].toString(),
					crossTabData[0].toString());
			if (dataMap.containsKey("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString())) {
				int sum = Integer.parseInt(
						dataMap.get("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString()));
				dataMap.put("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString(),
						String.valueOf(Integer.parseInt(crossTabData[0].toString()) + sum));
			} else {
				dataMap.put("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString(),
						crossTabData[0].toString());
			}

			if (dataMap.containsKey(crossTabData[1].toString() + "_Total_" + crossTabData[3].toString())) {
				int sum = Integer
						.parseInt(dataMap.get(crossTabData[1].toString() + "_Total_" + crossTabData[3].toString()));
				dataMap.put(crossTabData[1].toString() + "_Total_" + crossTabData[3].toString(),
						String.valueOf(Integer.parseInt(crossTabData[0].toString()) + sum));
			} else {
				dataMap.put(crossTabData[1].toString() + "_Total_" + crossTabData[3].toString(),
						crossTabData[0].toString());
			}

			if (dataMap.containsKey("Total_Total_" + crossTabData[3].toString())) {
				int sum = Integer.parseInt(dataMap.get("Total_Total_" + crossTabData[3].toString()));
				dataMap.put("Total_Total_" + crossTabData[3].toString(),
						String.valueOf(Integer.parseInt(crossTabData[0].toString()) + sum));
			} else {
				dataMap.put("Total_Total_" + crossTabData[3].toString(), crossTabData[0].toString());
			}

			// colSubGroups.add(crossTabData[2].toString());
			// rowSubGroups.add(crossTabData[1].toString());
			// timePeriods.add(crossTabData[3].toString());
		}

		List<Map<String, String>> tableDataMapList = new ArrayList<Map<String, String>>();
		Map<String, List<ValueObject>> valueObjectMap = new LinkedHashMap<String, List<ValueObject>>();
		List<ValueObject> timePeriodList = new ArrayList<ValueObject>();
		for (String colSubGroup : colSubGroups) {
			Map<String, String> tableDataMap = new LinkedHashMap<String, String>();

			tableDataMap.put("", crossTabDataModel.getCoLabel() + " (" + colSubGroup + ")");
			for (String rowSubGroup : rowSubGroups) {
				List<ValueObject> valueObjects = new ArrayList<ValueObject>();
				for (String timePeriod : timePeriods) {
					ValueObject valueObject = new ValueObject();
					valueObject.setKey(timePeriod);
					valueObject.setDescription(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")" + timePeriod);

					tableDataMap.put(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")" + timePeriod,
							dataMap.containsKey(rowSubGroup + "_" + colSubGroup + "_" + timePeriod)
									? dataMap.get(rowSubGroup + "_" + colSubGroup + "_" + timePeriod)
									: "-");

					valueObjects.add(valueObject);
				}

				if (!valueObjectMap.containsKey(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")")) {
					valueObjectMap.put(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")", valueObjects);
					timePeriodList.addAll(valueObjects);
				}
			}

			tableDataMapList.add(tableDataMap);
		}

		tableDatas.put("data", tableDataMapList);
		tableDatas.put("header", valueObjectMap);
		tableDatas.put("lowHeader", timePeriodList);
		return tableDatas;

	}

	private Object getCrossTabForAnyIntegerIndicator(CrossTabDataModel crossTabDataModel, List<Integer> xPathsIdCol,
			List<Integer> xPathsRow) {

		Map<String, Object> tableDatas = new LinkedHashMap<String, Object>();
		Map<String, String> dataMap = new LinkedHashMap<String, String>();

		List<Object[]> crossTabDatas = new ArrayList<Object[]>();

		Set<String> colSubGroups = new LinkedHashSet<String>();
		if (!(crossTabDataModel.getColIndicatorFormXpathMappingType().equalsIgnoreCase("integer")))
			colSubGroups = choiceDetailsRepository.findByXpathIdAndType(xPathsIdCol);
		else {
			colSubGroups.add("Atleast One");
			colSubGroups.add("Atleast Two");
			colSubGroups.add("More Than Two");
		}

		Set<String> rowSubGroups = new LinkedHashSet<String>();
		if (!crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))
			rowSubGroups = choiceDetailsRepository.findByXpathIdAndType(xPathsRow);
		else {
			rowSubGroups.add("Atleast One");
			rowSubGroups.add("Atleast Two");
			rowSubGroups.add("More Than Two");

		}

		Set<String> timePeriods = new LinkedHashSet<String>();
		Set<Integer> timePeriodIds = new LinkedHashSet<Integer>();
		if (crossTabDataModel.getTimePeriodId() != 0)

		{
			TimePeriod timePeriod = timePeriodRepository.findByTimePeriodId(crossTabDataModel.getTimePeriodId());
			timePeriods.add(timePeriod.getTimeperiod());
			timePeriodIds.add(timePeriod.getTimePeriodId());

		} else {
			List<TimePeriod> timPeriods = timePeriodRepository.findByOrderByTimePeriodIdDesc();

			for (TimePeriod timePeriod : timPeriods) {
				timePeriods.add(timePeriod.getTimeperiod());
				timePeriodIds.add(timePeriod.getTimePeriodId());
			}

		}

		if (crossTabDataModel.getDistrictId() == 0) {

			if (!(crossTabDataModel.getColIndicatorFormXpathMappingType().equalsIgnoreCase("integer")
					&& crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))) {

				if (crossTabDataModel.getColIndicatorFormXpathMappingType().equalsIgnoreCase("integer")) {
					crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyOneIntegerType(xPathsRow, xPathsIdCol,
							timePeriodIds);

					for (Object[] crossTabData : crossTabDatas) {
						dataMap.put(crossTabData[3].toString() + "_Atleast One_" + crossTabData[4].toString(),
								crossTabData[0].toString());
						dataMap.put(crossTabData[3].toString() + "_Atleast Two_" + crossTabData[4].toString(),
								crossTabData[1].toString());
						dataMap.put(crossTabData[3].toString() + "_More Than Two_" + crossTabData[4].toString(),
								crossTabData[2].toString());

					}
				}

				else if (crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer")) {

					crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyOneIntegerType(xPathsIdCol, xPathsRow,
							timePeriodIds);

					for (Object[] crossTabData : crossTabDatas) {
						dataMap.put("Atleast One_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
								crossTabData[0].toString());
						dataMap.put("Atleast Two_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
								crossTabData[1].toString());
						dataMap.put("More Than Two_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
								crossTabData[2].toString());

					}

				}
			} else {
				crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyIntegerType(xPathsRow, xPathsIdCol,
						timePeriodIds);

				for (Object[] crossTabData : crossTabDatas) {
					dataMap.put("Atleast One_Atleast One_" + crossTabData[9].toString(), crossTabData[0].toString());
					dataMap.put("Atleast One_Atleast Two_" + crossTabData[9].toString(), crossTabData[1].toString());
					dataMap.put("Atleast One_More Than Two_" + crossTabData[9].toString(), crossTabData[2].toString());

					dataMap.put("Atleast Two_Atleast One_" + crossTabData[9].toString(), crossTabData[3].toString());
					dataMap.put("Atleast Two_Atleast Two_" + crossTabData[9].toString(), crossTabData[4].toString());
					dataMap.put("Atleast Two_More Than Two_" + crossTabData[9].toString(), crossTabData[5].toString());

					dataMap.put("More Than Two_Atleast One_" + crossTabData[9].toString(), crossTabData[6].toString());
					dataMap.put("More Than Two_Atleast Two_" + crossTabData[9].toString(), crossTabData[7].toString());
					dataMap.put("More Than Two_More Than Two_" + crossTabData[9].toString(),
							crossTabData[8].toString());

				}

			}

		} else {

			if (!(crossTabDataModel.getColIndicatorFormXpathMappingType().equalsIgnoreCase("integer")
					&& crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))) {

				if (crossTabDataModel.getColIndicatorFormXpathMappingType().equalsIgnoreCase("integer")) {
					crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyOneIntegerTypeADistrict(xPathsRow,
							xPathsIdCol, timePeriodIds, crossTabDataModel.getDistrictId());

					for (Object[] crossTabData : crossTabDatas) {
						dataMap.put(crossTabData[3].toString() + "_Atleast One_" + crossTabData[4].toString(),
								crossTabData[0].toString());
						dataMap.put(crossTabData[3].toString() + "_Atleast Two_" + crossTabData[4].toString(),
								crossTabData[1].toString());
						dataMap.put(crossTabData[3].toString() + "_More Than Two_" + crossTabData[4].toString(),
								crossTabData[2].toString());

					}

				}

				else if (crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer")) {

					crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyOneIntegerTypeADistrict(xPathsIdCol,
							xPathsRow, timePeriodIds, crossTabDataModel.getDistrictId());

					for (Object[] crossTabData : crossTabDatas) {
						dataMap.put("Atleast One_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
								crossTabData[0].toString());
						dataMap.put("Atleast Two_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
								crossTabData[1].toString());
						dataMap.put("More Than Two_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
								crossTabData[2].toString());

					}

				}
			}

			else {

				crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyIntegerTypeForADistrict(xPathsRow,
						xPathsIdCol, timePeriodIds, crossTabDataModel.getDistrictId());

				for (Object[] crossTabData : crossTabDatas) {
					dataMap.put("Atleast One_Atleast One_" + crossTabData[9].toString(), crossTabData[0].toString());
					dataMap.put("Atleast One_Atleast Two_" + crossTabData[9].toString(), crossTabData[1].toString());
					dataMap.put("Atleast One_More Than Two_" + crossTabData[9].toString(), crossTabData[2].toString());

					dataMap.put("Atleast Two_Atleast One_" + crossTabData[9].toString(), crossTabData[3].toString());
					dataMap.put("Atleast Two_Atleast Two_" + crossTabData[9].toString(), crossTabData[4].toString());
					dataMap.put("Atleast Two_More Than Two_" + crossTabData[9].toString(), crossTabData[5].toString());

					dataMap.put("More Than Two_Atleast One_" + crossTabData[9].toString(), crossTabData[6].toString());
					dataMap.put("More Than Two_Atleast Two_" + crossTabData[9].toString(), crossTabData[7].toString());
					dataMap.put("More Than Two_More Than Two_" + crossTabData[9].toString(),
							crossTabData[8].toString());

				}

			}

		}

		List<Map<String, String>> tableDataMapList = new ArrayList<Map<String, String>>();
		Map<String, List<ValueObject>> valueObjectMap = new LinkedHashMap<String, List<ValueObject>>();
		List<ValueObject> timePeriodList = new ArrayList<ValueObject>();
		for (String colSubGroup : colSubGroups) {
			Map<String, String> tableDataMap = new LinkedHashMap<String, String>();

			tableDataMap.put("", crossTabDataModel.getCoLabel() + " (" + colSubGroup + ")");
			for (String rowSubGroup : rowSubGroups) {
				List<ValueObject> valueObjects = new ArrayList<ValueObject>();
				for (String timePeriod : timePeriods) {
					ValueObject valueObject = new ValueObject();
					valueObject.setKey(timePeriod);
					valueObject.setDescription(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")" + timePeriod);
					tableDataMap.put(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")" + timePeriod,
							dataMap.containsKey(rowSubGroup + "_" + colSubGroup + "_" + timePeriod)
									? dataMap.get(rowSubGroup + "_" + colSubGroup + "_" + timePeriod)
									: "-");
					valueObjects.add(valueObject);
				}

				if (!valueObjectMap.containsKey(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")")) {
					valueObjectMap.put(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")", valueObjects);
					timePeriodList.addAll(valueObjects);
				}
			}

			tableDataMapList.add(tableDataMap);
		}

		tableDatas.put("data", tableDataMapList);
		tableDatas.put("header", valueObjectMap);
		tableDatas.put("lowHeader", timePeriodList);
		return tableDatas;

	}

	private Object getFacilityWiseCrossTabData(CrossTabDataModel crossTabDataModel, List<Integer> xPathsIdCol,
			List<Integer> xPathsRow) {

		Set<String> rowSubGroups = new LinkedHashSet<String>();
		Map<String, Object> tableDatas = new LinkedHashMap<String, Object>();
		Map<String, String> dataMap = new LinkedHashMap<String, String>();
		List<Object[]> crossTabDatas = new ArrayList<Object[]>();
		if (!crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer")) {
			rowSubGroups = choiceDetailsRepository.findByXpathIdAndType(xPathsRow);
			rowSubGroups.add("Total");
		} else {
			rowSubGroups.add("Atleast One");
			rowSubGroups.add("Atleast Two");
			rowSubGroups.add("More Than Two");
		}

		Set<String> colSubGroups = new LinkedHashSet<String>();
		colSubGroups.add("DH");
		colSubGroups.add("CHC");
		colSubGroups.add("PHC");
		if (!crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))
			colSubGroups.add("Total");

		Set<String> timePeriods = new LinkedHashSet<String>();
		Set<Integer> timePeriodIds = new LinkedHashSet<Integer>();
		if (crossTabDataModel.getTimePeriodId() != 0)

		{
			TimePeriod timePeriod = timePeriodRepository.findByTimePeriodId(crossTabDataModel.getTimePeriodId());
			timePeriods.add(timePeriod.getTimeperiod());
			timePeriodIds.add(timePeriod.getTimePeriodId());

		} else {
			List<TimePeriod> timPeriods = timePeriodRepository.findByOrderByTimePeriodIdDesc();

			for (TimePeriod timePeriod : timPeriods) {
				timePeriods.add(timePeriod.getTimeperiod());
				timePeriodIds.add(timePeriod.getTimePeriodId());
			}

		}

		if (crossTabDataModel.getDistrictId() != 0) {
			if (crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))
				crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyOneIntegerTypeADistrictByFacilityWise(
						xPathsRow, timePeriodIds, crossTabDataModel.getDistrictId());

			else
				crossTabDatas = rawDataScoreRepository.findCrossTabForChoiceTypeADistrictByFacilityWise(xPathsRow,
						timePeriodIds, crossTabDataModel.getDistrictId());

		}

		else {
			if (crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer"))
				crossTabDatas = rawDataScoreRepository.findCrossTabForOnlyOneIntegerTypeByFacilityWise(xPathsRow,
						timePeriodIds);

			else
				crossTabDatas = rawDataScoreRepository.findCrossTabForChoiceTypetByFacilityWise(xPathsRow,
						timePeriodIds);

		}
		if (crossTabDataModel.getRowIndicatorFormXpathMappingType().equalsIgnoreCase("integer")) {
			for (Object[] crossTabData : crossTabDatas) {
				dataMap.put("Atleast One_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
						crossTabData[0].toString());
				dataMap.put("Atleast Two_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
						crossTabData[1].toString());
				dataMap.put("More Than Two_" + crossTabData[3].toString() + "_" + crossTabData[4].toString(),
						crossTabData[2].toString());
			}
		}

		else {
			for (Object[] crossTabData : crossTabDatas) {
				dataMap.put(crossTabData[1].toString() + "_" + crossTabData[2].toString() + "_"
						+ crossTabData[3].toString(), crossTabData[0].toString());

				if (dataMap.containsKey("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString())) {
					int sum = Integer.parseInt(
							dataMap.get("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString()));
					dataMap.put("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString(),
							String.valueOf(Integer.parseInt(crossTabData[0].toString()) + sum));
				} else {
					dataMap.put("Total_" + crossTabData[2].toString() + "_" + crossTabData[3].toString(),
							crossTabData[0].toString());
				}

				if (dataMap.containsKey(crossTabData[1].toString() + "_0_" + crossTabData[3].toString())) {
					int sum = Integer
							.parseInt(dataMap.get(crossTabData[1].toString() + "_0_" + crossTabData[3].toString()));
					dataMap.put(crossTabData[1].toString() + "_0_" + crossTabData[3].toString(),
							String.valueOf(Integer.parseInt(crossTabData[0].toString()) + sum));
				} else {
					dataMap.put(crossTabData[1].toString() + "_0_" + crossTabData[3].toString(),
							crossTabData[0].toString());
				}

				if (dataMap.containsKey("Total_0_" + crossTabData[3].toString())) {
					int sum = Integer.parseInt(dataMap.get("Total_0_" + crossTabData[3].toString()));
					dataMap.put("Total_0_" + crossTabData[3].toString(),
							String.valueOf(Integer.parseInt(crossTabData[0].toString()) + sum));
				} else {
					dataMap.put("Total_0_" + crossTabData[3].toString(), crossTabData[0].toString());
				}
			}
		}

		List<Map<String, String>> tableDataMapList = new ArrayList<Map<String, String>>();
		Map<String, List<ValueObject>> valueObjectMap = new LinkedHashMap<String, List<ValueObject>>();
		List<ValueObject> timePeriodList = new ArrayList<ValueObject>();

		for (String colSubGroup : colSubGroups) {
			int i = 0;
			switch (colSubGroup) {
			case "PHC":
				i = Constants.PHC_ID;
				break;

			case "CHC":
				i = Constants.CHC_ID;
				break;

			case "DH":
				i = Constants.DH_ID;
				break;

			}
			Map<String, String> tableDataMap = new LinkedHashMap<String, String>();

			tableDataMap.put("", colSubGroup);
			for (String rowSubGroup : rowSubGroups) {
				List<ValueObject> valueObjects = new ArrayList<ValueObject>();
				for (String timePeriod : timePeriods) {
					ValueObject valueObject = new ValueObject();
					valueObject.setKey(timePeriod);
					valueObject.setDescription(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")" + timePeriod);
					tableDataMap.put(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")" + timePeriod,
							dataMap.containsKey(rowSubGroup + "_" + i + "_" + timePeriod)
									? dataMap.get(rowSubGroup + "_" + i + "_" + timePeriod)
									: "-");

					valueObjects.add(valueObject);
				}

				if (!valueObjectMap.containsKey(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")")) {
					valueObjectMap.put(crossTabDataModel.getRowLabel() + " (" + rowSubGroup + ")", valueObjects);
					timePeriodList.addAll(valueObjects);
				}
			}

			tableDataMapList.add(tableDataMap);
		}

		tableDatas.put("data", tableDataMapList);
		tableDatas.put("header", valueObjectMap);
		tableDatas.put("lowHeader", timePeriodList);
		return tableDatas;
	}

}
