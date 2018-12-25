/**
 * 
 */
package org.sdrc.dga.repository;

import java.util.List;

import org.sdrc.dga.domain.RoleFeaturePermissionScheme;

/**
 * @author Harsh Pratyush(harsh@sdrc.co.in)
 * Created on 20-Nov-2018
 */
public interface RoleFeaturePermissionSchemeRepository {
	
	<S extends RoleFeaturePermissionScheme> List<S> save(Iterable<S> roleFeaturePermissionSchemes);

	List<RoleFeaturePermissionScheme> findAll();

}
