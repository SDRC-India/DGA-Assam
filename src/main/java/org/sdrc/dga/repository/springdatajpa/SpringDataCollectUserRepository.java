/**
 * 
 */
package org.sdrc.dga.repository.springdatajpa;

import org.sdrc.dga.domain.CollectUser;
import org.sdrc.dga.repository.CollectUserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Harsh(harsh@sdrc.co.in)
 *
 */
public interface SpringDataCollectUserRepository extends
		JpaRepository<CollectUser, Integer>, CollectUserRepository {

}
