package com.project.splash;

import android.app.Activity;
import android.app.Dialog;
import android.os.Build;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.project.R;

import java.lang.ref.WeakReference;

public class SplashScreen {
    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    public static void show(final Activity activity, final int themeResId, final boolean fullScreen) {
        if (activity == null) return;
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(() -> {
            if (!activity.isFinishing()) {
                mSplashDialog = new Dialog(activity, themeResId);
                mSplashDialog.setContentView(R.layout.launch_screen);
                mSplashDialog.setCancelable(false);
                if (fullScreen) {
                    setActivityAndroidP(mSplashDialog);
                }
                if (!mSplashDialog.isShowing()) {
                    mSplashDialog.show();
                }
            }
        });
    }

//    public static void showAdWarning() {
//        try {
//            if (mSplashDialog != null) {
//                mActivity.get().runOnUiThread(() -> {
//                    TextView textView = mSplashDialog.findViewById(R.id.textContainAds);
//                    if (textView != null) {
//                        textView.setVisibility(View.VISIBLE);
//                    }
//                });
//            }
//        } catch (Exception ignored) {}
//    }

    public static void show(final Activity activity, final boolean fullScreen) {
        int resourceId = R.style.SplashScreen_Fullscreen ;

        show(activity, resourceId, fullScreen);
    }

    public static void show(final Activity activity) {
        show(activity, true);
    }

    public static void hide(Activity activity) {
        if (activity == null) {
            if (mActivity == null) {
                return;
            }
            activity = mActivity.get();
        }

        if (activity == null) return;

        final Activity _activity = activity;

        _activity.runOnUiThread(() -> {
            if (mSplashDialog != null && mSplashDialog.isShowing()) {
                boolean isDestroyed = false;

                isDestroyed = _activity.isDestroyed();

                if (!_activity.isFinishing() && !isDestroyed) {
                    mSplashDialog.dismiss();
                }
                mSplashDialog = null;
            }
        });
    }

    private static void setActivityAndroidP(Dialog dialog) {
        if (Build.VERSION.SDK_INT >= 28) {
            if (dialog != null && dialog.getWindow() != null) {
                dialog.getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS); // Toàn màn hình không giới hạn
                dialog.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN); // Ẩn Status Bar (Full Screen)

                WindowManager.LayoutParams lp = dialog.getWindow().getAttributes();
                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
                dialog.getWindow().setAttributes(lp);
            }
        }
    }
}