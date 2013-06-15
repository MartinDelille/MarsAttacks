package com.marsattack.model;

/**
 * Definition of a tower
 * @author jroche
 */
public class Tower {
	private int id;
	private double latitude;
	private double longitude;
	private int altitude;
	
	/**
	 * Default constructor
	 */
	public Tower() {
		super();
		this.id = -1; // Not created
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	
	public double getLongitude() {
		return longitude;
	}
	
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	
	public int getAltitude() {
		return altitude;
	}
	
	public void setAltitude(int altitude) {
		this.altitude = altitude;
	}
}
