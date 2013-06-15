package com.marsattack.test;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import junit.framework.Assert;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.json.JSONArray;
import org.json.JSONObject;

import android.test.AndroidTestCase;

public class RestApiTest extends AndroidTestCase {
	public void testMapsById() throws Throwable {
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet httpGet = new HttpGet("http://10.0.2.2:8080/maps/2"); // Because it does not like 127.0.0.1 nor localhost ...	
		try {
			// Do the request
			HttpResponse response = httpClient.execute(httpGet, new BasicHttpContext());
			
			// Shall return:
			/*
			   {
				  "id": "2",
				  "name": "A default map",
				  "creationDate": 1371313428754,
				  "updateDate": 1371313428754,
				  "towers": [
				    {
				      "id": 1,
				      "latitude": 45.190918,
				      "longitude": 5.712572,
				      "accuracy": 10,
				      "altitude": 300
				    },
				    {
				      "id": 2,
				      "latitude": 45.193918,
				      "longitude": 5.714572,
				      "accuracy": 10,
				      "altitude": 300
				    },
				    {
				      "id": 3,
				      "latitude": 45.192918,
				      "longitude": 5.713572,
				      "accuracy": 10,
				      "altitude": 300
				    }
				  ]
				}
			 */
			
			// Check if the request works
			Assert.assertNotNull(response);
			Assert.assertNotNull(response.getEntity());
			
			InputStream inputStream = response.getEntity().getContent();
			Assert.assertNotNull(inputStream);
			
			// Retrieve data as String
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
	        String line;
	        StringBuilder builder = new StringBuilder();
	        
	        while ((line = reader.readLine()) != null) {
	          builder.append(line);
	        }
	        
	        Assert.assertNotNull(builder);
			
	        // Retrieve data as JON
			JSONObject json = new JSONObject(builder.toString());
			Assert.assertNotNull(json);
			
			// Check if we have right data
			Assert.assertEquals(json.getInt("id"), 2);
			Assert.assertEquals(json.getString("name"), "A default map");
			
			JSONArray towers = json.getJSONArray("towers");
			Assert.assertNotNull(towers);
			Assert.assertEquals(3, towers.length());
			
			JSONObject tower = towers.getJSONObject(0);
			Assert.assertNotNull(tower);
			Assert.assertEquals(1, tower.getInt("id"));
			Assert.assertEquals(45.190918, tower.getDouble("latitude"));
			Assert.assertEquals(5.712572, tower.getDouble("longitude"));
			Assert.assertEquals(300, tower.getInt("altitude"));
			
		} catch(Exception e) {
			Assert.fail(e.getMessage());
		}
	}
}