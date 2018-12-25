/**
 * 
 */
package org.sdrc.dga.service;

import java.io.IOException;

/**
 * @author Harsh Pratyush (harsh@sdrc.co.in)
 *
 */
public interface FIPService {
	
	/**
	 * This method will generated Excel sheet FIP report and return the generated file path
	 * @param areaCode
	 * @return
	 * @throws IOException 
	 */

	public String generateFIP(String areaCode) throws IOException;
}
