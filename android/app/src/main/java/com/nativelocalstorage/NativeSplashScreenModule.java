package com.nativelocalstorage;

import android.app.Activity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class NativeSplashScreenModule extends NativeSplashScreenSpec {
    public static final String NAME = "NativeSplashScreen";

    public NativeSplashScreenModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void show() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            com.project.splash.SplashScreen.show(activity, true);
        }
    }

    @Override
    public void hide() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            com.project.splash.SplashScreen.hide(activity);
        }
    }
}
