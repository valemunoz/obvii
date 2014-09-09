package com.example.obvii;

import android.os.Bundle;
//import android.app.Activity;
import org.apache.cordova.*;


public class MainActivity extends DroidGap 
{
	@Override
	public void onCreate(Bundle savedInstanceState) 
	{
		super.onCreate(savedInstanceState);
		super.setIntegerProperty("splashscreen", R.drawable.screen);
		super.loadUrl("file:///android_asset/www/index.html",30000);
		//super.loadUrl("file:///android_asset/www/index_nob.html");		
	     
		
	}
}

