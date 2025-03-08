import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AppScreen from './src/screens/AppScreen';
import LuckyDrawScreen from './src/screens/LuckyDrawScreen';
import FlippingCoinScreen from './src/screens/FlippingCoinScreen';
import RandomNumberScreen from './src/screens/RandomNumberScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import LuckyWheelIcon from './assets/icons/LuckyWheelIcon'
import TouchIcon from './assets/icons/TouchIcon'
import RandomNumberIcon from './assets/icons/RandomNumberIcon'
import CoinIcon from './assets/icons/CoinIcon'
import SettingsIcon from './assets/icons/SettingsIcon'
import { LanguageProvider } from './src/contexts/LanguageContext';
import NativeMusicPlayer from './specs/NativeMusicPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tabs = createBottomTabNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    const fetchMuteMusic = async () => {
      const isMuteMusic = await AsyncStorage.getItem('isMuteMusic');
      if (isMuteMusic === 'false') {
        NativeMusicPlayer.startMusic();
      }
    }
    fetchMuteMusic();
  }, []);

  return (
    <LanguageProvider>
      <View style={{ backgroundColor: 'white', width: '100%', height: '100%', flex: 1 }}>
        <StatusBar
          backgroundColor={'white'}
          barStyle={'dark-content'}
        />
        <NavigationContainer>
          <Tabs.Navigator
            screenOptions={({ route }) => ({
              tabBarStyle: {
                backgroundColor: '#305b69',
                height: 60,
                paddingTop: 10,
                paddingBottom: 10,
              },
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: '#ffffff',
              tabBarInactiveTintColor: '#white',
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "App") {
                  return <LuckyWheelIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
                } else if (route.name === "Lucky Draw") {
                  return <TouchIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
                } else if (route.name === "Random Number") {
                  return <RandomNumberIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
                } else if (route.name === "Flipping Coin") {
                  return <CoinIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
                } else if (route.name === "Settings") {
                  return <SettingsIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
                }
              },
            })}
          >
            <Tabs.Screen name="App" component={AppScreen} />
            <Tabs.Screen name="Lucky Draw" component={LuckyDrawScreen} />
            <Tabs.Screen name="Random Number" component={RandomNumberScreen} />
            <Tabs.Screen name="Flipping Coin" component={FlippingCoinScreen} />
            <Tabs.Screen name="Settings" component={SettingsScreen} />
          </Tabs.Navigator>
        </NavigationContainer>
      </View>
    </LanguageProvider>
  );
}

export default App;