import React, { use, useEffect, useState } from 'react';
import { Alert, AppRegistry, Button, PermissionsAndroid, StatusBar, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AppScreen from './src/screens/LuckyWheelScreen/AppScreen';
import LuckyDrawScreen from './src/screens/LuckyDrawScreen/LuckyDrawScreen';
import FlippingCoinScreen from './src/screens/FlippingCoinScreen/FlippingCoinScreen';
import RandomNumberScreen from './src/screens/RandomNumberScreen/RandomNumberScreen';
import SettingsScreen from './src/screens/SettingScreen/SettingsScreen';

import LuckyWheelIcon from './assets/icons/LuckyWheelIcon'
import TouchIcon from './assets/icons/TouchIcon'
import RandomNumberIcon from './assets/icons/RandomNumberIcon'
import CoinIcon from './assets/icons/CoinIcon'
import SettingsIcon from './assets/icons/SettingsIcon'
import { LanguageProvider } from './src/contexts/LanguageContext';
import NativeMusicPlayer from './specs/NativeMusicPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NativeSplashScreen from './specs/NativeSplashScreen';

import analytics from '@react-native-firebase/analytics';
import remoteConfig from '@react-native-firebase/remote-config';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import notifee from '@notifee/react-native';
import colors from './src/constants/colors';
import RollDiceScreen from './src/screens/RollDiceScreen/RollDiceScreen';
import DiceIcon from './assets/icons/DiceIcon';
import { RemoteConfigProvider, useGetRemoteConfig } from './src/remoteConfig/RemoteConfig';

const Tabs = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [primaryColor, setPrimaryColor] = useState<string>(colors.primary);
  const [secondaryColor, setSecondaryColor] = useState<string>(colors.secondary);
  const [rerenderTrigger, setRerenderTrigger] = useState<boolean>(false);

  // Function to clear all AsyncStorage data
  // const clearAllData = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log('All AsyncStorage data cleared successfully');
  //     // Reset wheels to initial state after clearing
  //   } catch (error) {
  //     console.error('Error clearing AsyncStorage data:', error);
  //   }
  // };

  // useEffect(() => {
  //   clearAllData();
  // }, [])


  //Fetch Remote Config


  useEffect(() => {
    const fetchData = async () => {
      try {
        const isMuteMusic = await AsyncStorage.getItem('isMuteMusic');
        if (isMuteMusic === 'false') {
          NativeMusicPlayer.startMusic();
        }
        NativeSplashScreen.hide();
      } catch (error) {
        console.log(error);
        crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
      }
    };
    fetchData();

  }, []);

  return (
    <LanguageProvider>
      <RemoteConfigProvider>
        <View style={{ backgroundColor: 'white', width: '100%', height: '100%', flex: 1, paddingTop: StatusBar.currentHeight }}>
          <StatusBar
            backgroundColor={'white'}
            barStyle={'dark-content'}
          />
          <NavigationContainer>
            <Tabs.Navigator
              screenOptions={({ route }) => ({
                tabBarStyle: {
                  backgroundColor: colors.primary,
                  height: 60,
                  paddingTop: 10,
                  paddingBottom: 10,
                },
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#white',
                tabBarIcon: ({ focused, color, size }) => {
                  if (route.name === "App") {
                    return <LuckyWheelIcon width={25} height={25} fill={focused ? secondaryColor : 'white'} />
                  } else if (route.name === "Lucky Draw") {
                    return <TouchIcon width={25} height={25} fill={focused ? secondaryColor : 'white'} />
                  } else if (route.name === "Random Number") {
                    return <RandomNumberIcon width={25} height={25} fill={focused ? secondaryColor : 'white'} />
                  } else if (route.name === "Flipping Coin") {
                    return <CoinIcon width={25} height={25} fill={focused ? secondaryColor : 'white'} />
                  } else if (route.name === "Rolling Dice") {
                    return <DiceIcon width={25} height={25} fill={focused ? secondaryColor : 'white'} />
                  } else if (route.name === "Settings") {
                    return <SettingsIcon width={25} height={25} fill={focused ? secondaryColor : 'white'} />
                  }
                },
              })}
            >
              <Tabs.Screen name="App" component={AppScreen} />
              <Tabs.Screen name="Lucky Draw" component={LuckyDrawScreen} />
              <Tabs.Screen name="Random Number" component={RandomNumberScreen} />
              <Tabs.Screen name="Flipping Coin" component={FlippingCoinScreen} />
              <Tabs.Screen name="Rolling Dice" component={RollDiceScreen} />
              <Tabs.Screen name="Settings" component={SettingsScreen} />
            </Tabs.Navigator>
          </NavigationContainer>
        </View>
      </RemoteConfigProvider>
    </LanguageProvider>
  );
}

// const App = () => {
//   useEffect(() => {
//     const startApp = async () => {
//     await crashlytics().setCrashlyticsCollectionEnabled(true);
//     crashlytics().crash();

//     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

//     analytics().logAppOpen();

//     remoteConfig()
//       .setConfigSettings({
//         minimumFetchIntervalMillis: 0,
//       })
//       .then(() => remoteConfig().setDefaults({
//         awesome_new_feature: 'disabled',
//       }))
//       .then(() => remoteConfig().fetchAndActivate())
//       .then(() => remoteConfig().getValue('awesome_new_feature'))
//       .then(value => {
//         setAwesomeNewFeature(value.asString());
//       })

//       messaging().onMessage(async remoteMessage => {
//         Alert.alert(
//           remoteMessage.notification?.body || 'New Message',
//           remoteMessage.notification?.title || 'You received a notification'
//         );
//       });
//     }
//     startApp();

//     NativeSplashScreen.hide()
//   }, [])

//   // async function onDisplayNotification() {
//   //   await notifee.requestPermission();

//   //   const channelId = await notifee.createChannel({
//   //     id: 'default',
//   //     name: 'Default Channel'
//   //   });

//   //   await notifee.displayNotification({
//   //     title: 'Notification Title',
//   //     body: 'Main body content of the notification',
//   //     android: {
//   //       channelId,
//   //       pressAction: {
//   //         id: 'default',
//   //       }
//   //     }
//   //   })
//   // }

//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
    
//   })

//   const [awesomeNewFeature, setAwesomeNewFeature] = useState<string>('disabled');

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button
//         title="Press me"
//         // Logs in the firebase analytics console as "select_content" event
//         // only accepts the two object properties which accept strings.
//         onPress={async () => {
//           // onDisplayNotification()
//           // await analytics().logAddToCart({
//           //   value: 100,
//           //   currency: 'USD',
//           //   items: [{
//           //     item_id: '12345',
//           //     item_name: 'Name of the item',
//           //     item_category: 'Category of the item',
//           //     quantity: 1,
//           //     price: 100,
//           //   }]
//           // })
//           crashlytics().log('Button pressed');
//           crashlytics().recordError(new Error('Error button pressed'));  
//           crashlytics().crash();
//         }
//         }
//       />
//       <Text style={{marginTop: 10, color: 'white'}}>{awesomeNewFeature}</Text>
//     </View>
//   )
// }

AppRegistry.registerComponent('App', () => App);

export default App;