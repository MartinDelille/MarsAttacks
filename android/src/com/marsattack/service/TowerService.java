package com.marsattack.service;

import java.util.List;

import com.marsattack.exception.RestCannotDelete;
import com.marsattack.exception.RestCannotGetData;
import com.marsattack.exception.RestCannotUpdateData;
import com.marsattack.model.Tower;

/**
 * Interface for the tower service
 * 
 * @author Julien Roche
 *
 */
public interface TowerService {
	/**
	 * Delete the specified tower
	 * @param tower Tower to delete
	 */
	void delete(Tower tower) throws RestCannotDelete;
	
	/**
	 * Retrieve all towers
	 * @return the list of towers
	 */
	List<Tower> get() throws RestCannotGetData;
	
	/**
	 * Get the specified tower by its identity
	 * @param id Identity
	 * @return the tower, null otherwise
	 */
	Tower get(int id) throws RestCannotGetData;
	
	/**
	 * Save or update the tower
	 * @param tower
	 * @return the updated tower
	 */
	Tower save(Tower tower) throws RestCannotUpdateData;
}
