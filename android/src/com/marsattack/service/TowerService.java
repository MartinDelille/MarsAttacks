package com.marsattack.service;

import java.util.List;

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
	void delete(Tower tower);
	
	/**
	 * Retrieve all towers
	 * @return the list of towers
	 */
	List<Tower> get();
	
	/**
	 * Get the specified tower by its identity
	 * @param id Identity
	 * @return the tower, null otherwise
	 */
	Tower get(int id);
	
	/**
	 * Save or update the tower
	 * @param tower
	 * @return the updated tower
	 */
	Tower save(Tower tower);
}
