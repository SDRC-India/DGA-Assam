package org.sdrc.dga.service;

import java.util.List;




/**
 * @author Harsh(harsh@sdrc.co.in)
 */
import org.sdrc.dga.model.CollectUserModel;
import org.sdrc.dga.model.FormsToDownloadMediafiles;
import org.sdrc.dga.model.MediaFilesToUpdate;
import org.sdrc.dga.model.ModelToCollectApplication;
import org.sdrc.dga.model.ProgramXFormsModel;

public interface UserService {
	CollectUserModel findByUserName(String userName);
	
	
	List<ProgramXFormsModel> getProgramWithXFormsList(String username, String password);	
	boolean insertUserTable();
	ModelToCollectApplication getModelToCollectApplication(List<FormsToDownloadMediafiles> list,String username,String password);
	List<MediaFilesToUpdate> getMediaFilesToUpdate(List<FormsToDownloadMediafiles> list);


	/**
	 * This service method will update the passowrd of the user
	 * @param collectUserModel
	 * @return
	 */
	boolean updatePassword(CollectUserModel collectUserModel);
	
	
	boolean configureUserDatabase();
}
