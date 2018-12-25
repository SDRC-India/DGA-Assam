package org.sdrc.dga.repository;

import java.util.List;

import org.sdrc.dga.domain.FormXpathScoreMapping;
import org.sdrc.dga.domain.XForm;
import org.springframework.transaction.annotation.Transactional;

/**
 * 
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 *
 */
public interface XFormRepository {

	@Transactional
	XForm save(XForm xForm);

	XForm findByXFormIdAndIsLiveTrue(String getxFormId);

	XForm findByFormId(Integer id);

	List<XForm> findAllByIsLiveTrue();

	XForm findByxFormIdAndIsLiveTrue(String xFormId);

	void updateIsLiveById(Integer xFormId);

	@Transactional
	public <S extends FormXpathScoreMapping> List<S> save(Iterable<S> entities);
	
	List<String> findAllXformNameByIsLiveTrue();

}
