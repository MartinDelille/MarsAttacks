package com.marsattacksgrenoble.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Utilities class for the HTTP
 * 
 * @author jroche
 *
 */
public abstract class HttpUtils {
	/**
	 * Do a request on the "DELETE" HTTP method
	 * @param url URL of the request
	 * @return the {@link HttpResponse} of the request
	 * @throws Exception
	 */
	public static HttpResponse doDeleteRequest(String url) throws Exception {
		HttpClient httpClient = new DefaultHttpClient();
		HttpDelete request = new HttpDelete(url);
		
		return httpClient.execute(request, new BasicHttpContext());
	}
	
	/**
	 * Do a request on the "GET" HTTP method
	 * @param url URL of the request
	 * @return the {@link HttpResponse} of the request
	 * @throws Exception
	 */
	public static HttpResponse doGetRequest(String url) throws Exception {
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet request = new HttpGet(url);
		
		return httpClient.execute(request, new BasicHttpContext());
	}
	
	/**
	 * Do a request on the "POST" HTTP method
	 * @param url URL of the request
	 * @return the {@link HttpResponse} of the request
	 * @throws Exception
	 */
	public static HttpResponse doPostRequest(String url) throws Exception {
		HttpClient httpClient = new DefaultHttpClient();
		HttpPost request = new HttpPost(url);
		
		return httpClient.execute(request, new BasicHttpContext());
	}
	
	/**
	 * Do a request on the "PUT" HTTP method
	 * @param url URL of the request
	 * @return the {@link HttpResponse} of the request
	 * @throws Exception
	 */
	public static HttpResponse doPutRequest(String url) throws Exception {
		HttpClient httpClient = new DefaultHttpClient();
		HttpPut request = new HttpPut(url);
		
		return httpClient.execute(request, new BasicHttpContext());
	}
	
	/**
	 * Get the content of a HTTP request
	 * @param response {@link HttpResponse} of the request
	 * @return the content of the request
	 * @throws Exception
	 */
	public static String getHttpContent(HttpResponse response) throws Exception {
		InputStream inputStream = response.getEntity().getContent();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        StringBuilder builder = new StringBuilder();
        
        while ((line = reader.readLine()) != null) {
          builder.append(line);
        }
        
        return builder.toString();
	}
	
	/**
	 * Get the JSON content of a HTTP request
	 * @param response {@link HttpResponse} of the request
	 * @return the content of the request
	 * @throws Exception
	 */
	public static JSONObject getJson(HttpResponse response) throws Exception {
		return new JSONObject(getHttpContent(response));
	}
	
	/**
	 * Get the array of JSON content of a HTTP request
	 * @param response {@link HttpResponse} of the request
	 * @return the content of the request
	 * @throws Exception
	 */
	public static JSONArray getJsonArray(HttpResponse response) throws Exception {
		return new JSONArray(getHttpContent(response));
	}
}
