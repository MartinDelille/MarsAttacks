package com.marsattacksgrenoble.androidclient;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;



import org.osmdroid.views.MapController;
import org.osmdroid.views.MapView;
import org.osmdroid.util.GeoPoint;




public class MainActivity extends Activity {

	private MapView myOpenMapView;
	private MapController myMapController;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		 myOpenMapView = (MapView)findViewById(R.id.openmapview);
	        myOpenMapView.setBuiltInZoomControls(true);
	        myMapController = myOpenMapView.getController();
	        myMapController.setZoom(4);
	        
	        
	        GeoPoint gPt = new GeoPoint(51500000, -150000);
	        //Centre map near to Hyde Park Corner, London
	        myMapController.setCenter(gPt);

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
