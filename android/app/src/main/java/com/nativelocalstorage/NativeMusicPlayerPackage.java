package com.nativelocalstorage;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class NativeMusicPlayerPackage extends BaseReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals(NativeMusicPlayerModule.NAME)) {
            return new NativeMusicPlayerModule(reactContext);
        } else {
            return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                Map<String, ReactModuleInfo> map = new HashMap<>();
                map.put(NativeMusicPlayerModule.NAME, new ReactModuleInfo(
                        NativeMusicPlayerModule.NAME,       // name
                        NativeMusicPlayerModule.NAME,       // className
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        false, // isCXXModule
                        true   // isTurboModule
                ));
                return map;
            }
        };
    }
}
