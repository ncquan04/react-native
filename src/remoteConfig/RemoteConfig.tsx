import { useEffect } from "react"
import remoteConfig from '@react-native-firebase/remote-config'
import colors from "../constants/colors"

export const REMOTE_KEY = {
    primary_color: 'primary_color',
    secondary_color: 'secondary_color',
}

export const useGetRemoteConfig = (key: string) => {
    return remoteConfig().getValue(key).asString();
}

export const RemoteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const fetchRemoteConfig = async () => {
            try {
                await remoteConfig().setConfigSettings({
                    minimumFetchIntervalMillis: 0,
                })
                await remoteConfig().setDefaults({
                    [REMOTE_KEY.primary_color]: '#344955',
                    [REMOTE_KEY.secondary_color]: '#f2ae41',
                });
                await remoteConfig().fetchAndActivate();
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchRemoteConfig();
    }, [])

    return children;
}