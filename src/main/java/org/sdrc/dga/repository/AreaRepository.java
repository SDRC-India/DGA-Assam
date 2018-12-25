package org.sdrc.dga.repository;

import java.util.List;

import org.sdrc.dga.domain.Area;
import org.springframework.transaction.annotation.Transactional;

public interface AreaRepository {
	
	List<Area> findByAreaLevelAreaLevelId(Integer areaLevelId);
   
	List<Integer> findAreaIdByParentAreaId(Integer paremtAreaID);
	
	Area findByAreaId(Integer areaId);

	List<Area> findAll();

	Area findByAreaCode(String areaCode);

	List<Area> findTopOneByParentAreaIdOrderByAreaCodeDesc(Integer parentAreaId);

	@Transactional
	Area save(Area area);

	List<Area> findByAreaLevelAreaLevelIdIn(List<Integer> areaLevelIds);

	List<Area> findByAreaLevelAreaLevelIdOrderByAreaNameAsc(int i);
}
