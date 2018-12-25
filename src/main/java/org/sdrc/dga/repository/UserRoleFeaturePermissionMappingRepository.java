/**
 * 
 */
package org.sdrc.dga.repository;

import java.util.List;

import org.sdrc.dga.domain.UserRoleFeaturePermissionMapping;

/**
 * @author Harsh Pratyush(harsh@sdrc.co.in)
 * Created on 17-Nov-2018
 */
public interface UserRoleFeaturePermissionMappingRepository {


	<S extends UserRoleFeaturePermissionMapping> List<S> save(Iterable<S> roleFeaturePermissionSchemes);

}
