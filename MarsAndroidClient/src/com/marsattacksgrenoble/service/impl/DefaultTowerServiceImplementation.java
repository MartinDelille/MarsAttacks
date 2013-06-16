package com.marsattacksgrenoble.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.marsattacksgrenoble.exception.RestCannotDelete;
import com.marsattacksgrenoble.exception.RestCannotGetData;
import com.marsattacksgrenoble.exception.RestCannotUpdateData;
import com.marsattacksgrenoble.model.Tower;
import com.marsattacksgrenoble.service.TowerService;
import com.marsattacksgrenoble.utils.HttpUtils;

/**
 * Default implementation of {@link TowerService}
 * @author jroche
 *
 */
public class DefaultTowerServiceImplementation implements TowerService {
	// Constants
	private static final String SERVER_URL = "http://10.0.0.104:8080/towers";

	/**
	 * Convert {@link JSONObject} to {@link Tower}
	 * @param jsonObject {@link JSONObject} to convert
	 * @return the converted {@link Tower}
	 * @throws JSONException
	 */
	private Tower convertTo(JSONObject jsonObject) throws JSONException {
		Tower tower = new Tower();
		
		if(!jsonObject.isNull("id")){
			tower.setId(jsonObject.getInt("id"));
		}
		
		tower.setAltitude(jsonObject.getInt("altitude"));
		tower.setLatitude(jsonObject.getDouble("latitude"));
		tower.setLongitude(jsonObject.getDouble("longitude"));
		
		return tower;
	}

	/**
	 * {@inheritDoc}
	 * @see com.marsattack.service.TowerService#delete(com.marsattack.model.Tower)
	 */
	@Override
	public void delete(Tower tower)  throws RestCannotDelete {
		try {
			HttpUtils.doDeleteRequest(SERVER_URL + "/" + tower.getId());
			
		} catch (Exception e) {
			throw new RestCannotDelete(e);
		}
	}

	/**
	 * {@inheritDoc}
	 * @see com.marsattack.service.TowerService#get()
	 */
	@Override
	public List<Tower> get() throws RestCannotGetData {
		try {
			JSONArray array = HttpUtils.getJsonArray(HttpUtils.doGetRequest(SERVER_URL));
			List<Tower> towers = new ArrayList<Tower>();
			int length = array.length();
			
			for(int i = 0; i < length; ++i){
				towers.add(convertTo(array.getJSONObject(i)));
			}
			
			return towers;
			
		} catch (Exception e) {
			throw new RestCannotGetData(e);
		}
	}

	/**
	 * {@inheritDoc}
	 * @see com.marsattack.service.TowerService#get(int)
	 */
	@Override
	public Tower get(int id) throws RestCannotGetData {
		try {
			return convertTo(
				HttpUtils.getJson(
					HttpUtils.doGetRequest(SERVER_URL + "/" + id)
				)
			);
			
		} catch (Exception e) {
			throw new RestCannotGetData(e);
		}
	}

	/**
	 * {@inheritDoc}
	 * @see com.marsattack.service.TowerService#save(com.marsattack.model.Tower)
	 */
	@Override
	public Tower save(Tower tower)  throws RestCannotUpdateData {
		try {
			return convertTo(
				HttpUtils.getJson(
						tower.getId() < 0 ? HttpUtils.doPutRequest(SERVER_URL) : HttpUtils.doPostRequest(SERVER_URL + "/" + tower.getId())
				)
			);
			
		} catch (Exception e) {
			throw new RestCannotUpdateData(e);
		}
	}
}
