import React, { useEffect, useState } from 'react';
import { Button, StatusBar, View } from 'react-native';
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
import NativeSplashScreen from './specs/NativeSplashScreen';

import { getAnalytics, logEvent } from '@react-native-firebase/analytics';

const Tabs = createBottomTabNavigator();

const InitWheels = [
  {
    name: 'Yes or No',
    segments: [
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
      { content: 'Yes', color: '#dbdbdb' },
      { content: 'No', color: '#5e5e5e'},
    ]
  },
  {
    name: 'What to Eat',
    segments: [
      { content: 'Pizza', color: '#FF6B6B' },
      { content: 'Burger', color: '#4ECDC4'},
      { content: 'Pasta', color: '#FFE66D' },
      { content: 'Sushi', color: '#1A535C' },
      { content: 'Salad', color: '#7FB069' },
      { content: 'Tacos', color: '#F7B267' },
      { content: 'Sandwich', color: '#D8A47F' },
      { content: 'Curry', color: '#FFA69E' },
      { content: 'Ramen', color: '#6D6875' },
      { content: 'BBQ', color: '#E63946' },
      { content: 'Steak', color: '#457B9D' },
      { content: 'Seafood', color: '#1D3557' }
    ]
  }
]

// function App(): React.JSX.Element {
//   const [Wheels, setWheels] = useState<any[]>([]);

//   // // Function to clear all AsyncStorage data
//   // const clearAllData = async () => {
//   //   try {
//   //     await AsyncStorage.clear();
//   //     console.log('All AsyncStorage data cleared successfully');
//   //     // Reset wheels to initial state after clearing
//   //     setWheels(InitWheels);
//   //   } catch (error) {
//   //     console.error('Error clearing AsyncStorage data:', error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   clearAllData();
//   // }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const isMuteMusic = await AsyncStorage.getItem('isMuteMusic');
//         if (isMuteMusic === 'false') {
//           NativeMusicPlayer.startMusic();
//         }
//         const fetchWheels = async () => {
//           const wheels = await AsyncStorage.getItem('wheels');
//           if (wheels) {
//             setWheels(JSON.parse(wheels));
//           } else {
//             setWheels(InitWheels);
//             await AsyncStorage.setItem('wheels', JSON.stringify(InitWheels));
//           }
//         }
//         await fetchWheels();
//         NativeSplashScreen.hide();
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <LanguageProvider>
//       <View style={{ backgroundColor: 'white', width: '100%', height: '100%', flex: 1, paddingTop: StatusBar.currentHeight }}>
//         <StatusBar
//           backgroundColor={'white'}
//           barStyle={'dark-content'}
//         />
//         <NavigationContainer>
//           <Tabs.Navigator
//             screenOptions={({ route }) => ({
//               tabBarStyle: {
//                 backgroundColor: '#305b69',
//                 height: 60,
//                 paddingTop: 10,
//                 paddingBottom: 10,
//               },
//               headerShown: false,
//               tabBarShowLabel: false,
//               tabBarActiveTintColor: '#ffffff',
//               tabBarInactiveTintColor: '#white',
//               tabBarIcon: ({ focused, color, size }) => {
//                 if (route.name === "App") {
//                   return <LuckyWheelIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
//                 } else if (route.name === "Lucky Draw") {
//                   return <TouchIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
//                 } else if (route.name === "Random Number") {
//                   return <RandomNumberIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
//                 } else if (route.name === "Flipping Coin") {
//                   return <CoinIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
//                 } else if (route.name === "Settings") {
//                   return <SettingsIcon width={25} height={25} fill={focused ? '#f2ae41' : 'white'} />
//                 }
//               },
//             })}
//           >
//             <Tabs.Screen name="App">{() => <AppScreen Wheels={Wheels} />}</Tabs.Screen>
//             <Tabs.Screen name="Lucky Draw" component={LuckyDrawScreen} />
//             <Tabs.Screen name="Random Number" component={RandomNumberScreen} />
//             <Tabs.Screen name="Flipping Coin" component={FlippingCoinScreen} />
//             <Tabs.Screen name="Settings" component={SettingsScreen} />
//           </Tabs.Navigator>
//         </NavigationContainer>
//       </View>
//     </LanguageProvider>
//   );
// }

const App = () => {
  useEffect(() => {
    NativeSplashScreen.hide();
  }, [])

  return (
    <View>
      <Button
        title="Press me"
        // Logs in the firebase analytics console as "select_content" event
        // only accepts the two object properties which accept strings.
        onPress={async () =>
          await logEvent(getAnalytics(), 'select_content', {
            content_type: 'clothing',
            item_id: 'abcd',
          })
        }
      />
    </View>
  )
}

export default App;