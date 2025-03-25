package com.nativelocalstorage;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

public class NativeAccelerometerModule extends NativeAccelerometerSpec implements SensorEventListener, PermissionListener {
    public static final String NAME = "NativeAccelerometer";

    private final ReactApplicationContext reactContext;
    private SensorManager sensorManager;
    private Sensor accelerometer;
    private boolean isListening = false;
    private boolean isShaking = false;

    private float shakeThreshold = 12.0f;
    private static final int SHAKE_TIMEOUT = 500;
    private static final int SHAKE_STOP_TIMEOUT = 5000;

    private long lastShakeTime = 0;
    private long lastAccelerationTime = 0;

    private static final int PERMISSION_REQUEST_CODE = 1234;
    private Promise pendingPromise;

    private static final int AUTO_STOP_TIMEOUT = 1000; // 1 second
    private Handler autoStopHandler;
    private Runnable autoStopRunnable;

    public NativeAccelerometerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.sensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);
        this.accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        // Initialize auto-stop handler and runnable
        this.autoStopHandler = new Handler(Looper.getMainLooper());
        this.autoStopRunnable = new Runnable() {
            @Override
            public void run() {
                if (isListening) {
                    stopDetectionInternal();
                    WritableMap params = Arguments.createMap();
                    params.putString("reason", "timeout");
                    sendEvent("detectionStopped", params);
                }
            }
        };
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void startDetection(Promise promise) {
        if (accelerometer == null) {
            promise.reject("ERROR", "Accelerometer not available on this device");
            return;
        }

        if (!isListening) {
            boolean success = sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_GAME);
            isListening = success;
            if (success) {
                resetAutoStopTimer();
                promise.resolve("Shake detection started");
            } else {
                promise.reject("ERROR", "Failed to start shake detection");
            }
        } else {
            promise.resolve("Shake detection is already running");
        }
    }

    private void startDetectionAfterPermissionGranted(Promise promise) {
        if (!isListening) {
            boolean success = sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_GAME);
            isListening = success;
            if (success) {
                resetAutoStopTimer();
                promise.resolve("Shake detection started");
            } else {
                promise.reject("ERROR", "Failed to start shake detection");
            }
        } else {
            promise.resolve("Shake detection already running");
        }
    }

    @Override
    public void stopDetection(Promise promise) {
        stopDetectionInternal();
        promise.resolve("Shake detection stopped");
    }

    private void stopDetectionInternal() {
        if (isListening) {
            sensorManager.unregisterListener(this);
            isListening = false;
            isShaking = false;
            cancelAutoStopTimer();
        }
    }

    private void resetAutoStopTimer() {
        cancelAutoStopTimer();
        autoStopHandler.postDelayed(autoStopRunnable, AUTO_STOP_TIMEOUT);
    }

    private void cancelAutoStopTimer() {
        autoStopHandler.removeCallbacks(autoStopRunnable);
    }

    @Override
    public void isAvailable(Promise promise) {
        boolean hasSensor = accelerometer != null;
        boolean hasPermission = checkSensorPermission();
        promise.resolve(hasSensor && hasPermission);
    }

    private boolean checkSensorPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            return ContextCompat.checkSelfPermission(
                    reactContext,
                    Manifest.permission.BODY_SENSORS
            ) == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    private void requestSensorPermission(Promise promise) {
        this.pendingPromise = promise;

        if (reactContext.getCurrentActivity() != null &&
                reactContext.getCurrentActivity() instanceof PermissionAwareActivity) {

            PermissionAwareActivity activity = (PermissionAwareActivity) reactContext.getCurrentActivity();
            activity.requestPermissions(
                    new String[]{Manifest.permission.BODY_SENSORS},
                    PERMISSION_REQUEST_CODE,
                    this
            );
        } else {
            promise.reject("ERROR", "Activity is not available or not PermissionAwareActivity");
        }
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSION_REQUEST_CODE && pendingPromise != null) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startDetectionAfterPermissionGranted(pendingPromise);
            } else {
                pendingPromise.reject("ERROR", "Sensor permission denied");
            }
            pendingPromise = null;
            return true;
        }
        return false;
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];

            float acceleration = (float) Math.sqrt(x * x + y * y + z * z) - SensorManager.GRAVITY_EARTH;

            long currentTime = System.currentTimeMillis();

            resetAutoStopTimer(); // Reset the timer on each sensor event

            if (acceleration > shakeThreshold) {
                lastAccelerationTime = currentTime;

                if (!isShaking && (currentTime - lastShakeTime > SHAKE_TIMEOUT)) {
                    isShaking = true;
                    lastShakeTime = currentTime;

                    WritableMap params = Arguments.createMap();
                    sendEvent("shakeStart", params);
                }
            } else if (isShaking && (currentTime - lastShakeTime > SHAKE_STOP_TIMEOUT)) {
                isShaking = false;

                WritableMap params = Arguments.createMap();
                sendEvent("shakeEnd", params);
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Not needed for this implementation
    }
}
