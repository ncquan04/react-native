import { useEffect, useState } from "react"
import remoteConfig from '@react-native-firebase/remote-config'
import { NativeModules } from "react-native";
import NativeSplashScreen from "../../specs/NativeSplashScreen";
import colors from "../constants/colors";

export const REMOTE_KEY = {
    primary_color: 'primary_color',
    secondary_color: 'secondary_color',
    background_color: 'background_color',
    text_color: 'text_color',
}

export const useGetRemoteConfig = (key: string) => {
    return remoteConfig().getValue(key).asString();
}

export const RemoteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    
    useEffect(() => {
        const fetchRemoteConfig = async () => {
            try {
                await remoteConfig().setConfigSettings({
                    minimumFetchIntervalMillis: 0,
                })
                await remoteConfig().setDefaults({
                    [REMOTE_KEY.primary_color]: '#344955',
                    [REMOTE_KEY.secondary_color]: '#f2ae41',
                    [REMOTE_KEY.background_color]: '#ffffff',
                    [REMOTE_KEY.text_color]: '#000000',
                });
                await remoteConfig().fetchAndActivate();
                setIsConfigLoaded(true);
                setTimeout(() => {
                    NativeSplashScreen.hide();
                }, 700);
            }
            catch (error) {
                console.log(error);
                setIsConfigLoaded(true);
            }
        }
        fetchRemoteConfig();
    }, [])

    if (!isConfigLoaded) {
        // Hiển thị loading screen hoặc splash screen
        return null;
    }

    return children;
}
