package com.nativelocalstorage;


import android.content.res.Resources;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;

import java.util.Objects;

public class NativeMusicPlayerModule extends NativeMusicPlayerSpec {

    private static final String TAG = "MusicPlayerDemo";

    private MediaPlayer mediaPlayer;

    public NativeMusicPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void startMusic() {
        try {
            Log.i(TAG, "startMusic");
            ReactApplicationContext context = getReactApplicationContext();
            Resources resources = context.getResources();
            int resId = resources.getIdentifier("xo_so1", "raw", context.getPackageName());

            if (resId == 0) {
                return;
            }

            if (mediaPlayer != null) {
                mediaPlayer.release();
            }

            mediaPlayer = MediaPlayer.create(context, resId);
            if (mediaPlayer != null) {
                mediaPlayer.start();
            } else {
                Log.e(TAG, "startMusic: " + "start error");

            }
        } catch (Exception e) {
            Log.e(TAG, "startMusic: " + e.getMessage());
        }
    }

    @Override
    public void stopMusic() {
        try {
            Log.i(TAG, "stopMusic");
            if (Objects.nonNull(mediaPlayer)) {
                mediaPlayer.stop();
                mediaPlayer.release();
            }
        } catch (Exception e) {

        }
    }
}
