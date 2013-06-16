package com.marsattacksgrenoble.androidclient;

import java.util.*;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.util.Log;

import android.graphics.drawable.Drawable;

import org.osmdroid.views.MapController;
import org.osmdroid.views.MapView;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.overlay.*;
import org.osmdroid.bonuspack.location.POI;
import org.osmdroid.DefaultResourceProxyImpl;
import org.osmdroid.ResourceProxy;

import com.marsattacksgrenoble.service.impl.DefaultTowerServiceImplementation;
import com.marsattacksgrenoble.exception.RestCannotGetData;
import com.marsattacksgrenoble.model.Tower;

public class MainActivity extends Activity {

	private MapView myOpenMapView;
	private MapController myMapController;
	private static final String TAG = "MainActivity";
	
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
		 
	        final ArrayList<OverlayItem> items = new ArrayList<OverlayItem>();
		 /*DefaultTowerServiceImplementation impl = new DefaultTowerServiceImplementation();
		 
		 try
		 {
			 List<Tower> list = impl.get();
		 
			for(Tower tower:list) 
		 	{

				GeoPoint pt = new GeoPoint(tower.getLongitude(), tower.getLongitude());
		 */
		 OverlayItem myLocationOverlayItem = new OverlayItem("Here", "Current Position", gPt);
	        Drawable myCurrentLocationMarker = this.getResources().getDrawable(R.drawable.ic_launcher);
	        myLocationOverlayItem.setMarker(myCurrentLocationMarker);

	        items.add(myLocationOverlayItem);

	
		 	//}

			ResourceProxy resourceProxy = new DefaultResourceProxyImpl(getApplicationContext());

	        ItemizedIconOverlay<OverlayItem> currentLocationOverlay = new ItemizedIconOverlay<OverlayItem>(items,
	                new ItemizedIconOverlay.OnItemGestureListener<OverlayItem>() {
	                    public boolean onItemSingleTapUp(final int index, final OverlayItem item) {
	                        return true;
	                    }
	                    public boolean onItemLongPress(final int index, final OverlayItem item) {
	                        return true;
	                    }
	                }, resourceProxy);
	        this.myOpenMapView.getOverlays().add(currentLocationOverlay);
		/*}
		 catch(RestCannotGetData ex)
		 {
			 Log.i(TAG, ex.getMessage());
		 }*/
}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
