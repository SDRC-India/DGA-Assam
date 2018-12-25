package org.sdrc.devinfo.repository;

import java.util.List;

import org.sdrc.devinfo.domain.UtIndicatorClassificationsEn;
/**
 * @author Harsh
 * @since version 1.0.0.0
 *
 */
public interface IndicatorClassificationRepository {
	
	List<UtIndicatorClassificationsEn> getAllSectors();
	
	
	public UtIndicatorClassificationsEn findOne(Integer id);

}
