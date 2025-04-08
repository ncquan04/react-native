import { View, Text, TouchableOpacity, ScrollView, StatusBar, Vibration } from 'react-native'
import React, { use, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../../contexts/LanguageContext';
import HistoryIcon from '../../../assets/icons/HistoryIcon';
import AddIcon from '../../../assets/icons/AddIcon';
import TrashIcon from '../../../assets/icons/TrashIcon';
import LuckyWheel from '../../components/LuckyWheel';
import LuckyWheelModal from './modals/LuckyWheelModal';
import AddWheelModal from './modals/AddWheelModal';
import WheelHistorySelectModal from './modals/WheelHistorySelectModal';
import { useDarkMode } from '../../contexts/DarkModeContext';

const initWheels = [
  {
    id: 1,
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
    id: 2,
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

const LuckyWheelScreen = () => {
  const {t} = useContext(LanguageContext);
  const [LuckyWheelModalVisible, setLuckyWheelModalVisible] = useState<boolean>(false);
  const [addWheelModalVisible, setAddWheelModalVisible] = useState<boolean>(false);
  const [WheelHistorySelectModalVisible, setWheelHistorySelectModalVisible] = useState<boolean>(false);
  const [wheels, setWheels] = useState<any[]>(initWheels);
  const [selectedWheel, setSelectedWheel] = useState<{id: number, name: string, segments: []}>(wheels[0])
  const { theme } = useDarkMode();
  
  useEffect(() => {
    const fetchWheels = async () => {
      try {
        const wheels = await AsyncStorage.getItem('wheels');
        if (wheels) {
          setWheels(JSON.parse(wheels));
        }
      } catch (error) {
        console.error('Error fetching wheels from AsyncStorage:', error);
      }
    }
    fetchWheels();
  }, [])

  const handleDeleteWheel = async (index: number) => {
    let newWheels = [...wheels]
    newWheels.splice(index, 1)
    await AsyncStorage.setItem('wheels', JSON.stringify(newWheels))
    setWheels(newWheels)
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.background_color, alignItems: 'center'}}>
      <Text style={{fontSize: 30, fontWeight: 500, marginTop: 10, color: theme.contrast_text_color}}>{t['Wheels']}</Text>
      <View style={{flexDirection: 'row', marginTop: 20, width: '90%', justifyContent: 'space-between'}}>
        <TouchableOpacity 
          style={{flexDirection: 'row', alignItems: 'center', backgroundColor: theme.secondary_color, padding: 10, borderRadius: 15}}
          onPress={() => {
            Vibration.vibrate(50);
            setAddWheelModalVisible(true);
          }}  
        >
          <AddIcon width={30} height={30} fill={theme.text_color} />
          <Text style={{fontSize: 17, fontWeight: 500, color: theme.text_color, marginLeft: 10}}>{t['Wheel']}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{flexDirection: 'row', alignItems: 'center', backgroundColor: theme.secondary_color, padding: 10, borderRadius: 15}}
          onPress={() => {
            Vibration.vibrate(50);
            setWheelHistorySelectModalVisible(true);
          }}
        >
          <HistoryIcon width={30} height={30} fill={theme.text_color} />
          <Text style={{fontSize: 17, fontWeight: 500, color: theme.text_color, marginLeft: 10}}>{t['History']}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{width: '100%', marginTop: 20}}>
        {wheels.length != 0 ? wheels.map((wheel, index) => {
          return (
            <TouchableOpacity 
              key={index}
              style={{flexDirection: 'column', justifyContent: 'space-between', width: '78%', padding: 15, height: 150, backgroundColor: theme.primary_color, borderRadius: 30, marginLeft: 20, marginTop: 20, position: 'relative'}}
              onPress={() => {
                Vibration.vibrate(50);
                setSelectedWheel(wheel);
                setLuckyWheelModalVisible(true);
              }}
            >
              <View style={{width: '95%'}}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{color: theme.text_color, fontSize: 20, fontWeight: 600, width: '70%'}}>{wheel.name}</Text>
              </View>
              <TouchableOpacity 
                style={{ width: '11%'}}
                onPress={() => {
                  Vibration.vibrate(50);
                  handleDeleteWheel(index);
                }}
              >
                <TrashIcon width={30} height={30} fill={theme.text_color} />
              </TouchableOpacity>
              <View style={{position: 'absolute', top: -5, right: -50}}>
                <LuckyWheel 
                  segments={wheel.segments.map((segment: any) => ({ ...segment, content: "" }))}
                  radius={75}
                />
              </View>
            </TouchableOpacity>
          )
        }) : null}
      </ScrollView>

      {LuckyWheelModalVisible && <LuckyWheelModal
        LuckyWheelModalVisible={LuckyWheelModalVisible}
        setLuckyWheelModalVisible={setLuckyWheelModalVisible}
        luckyWheel={selectedWheel}
      />}

      {addWheelModalVisible && <AddWheelModal
        addWheelModalVisible={addWheelModalVisible}
        setAddWheelModalVisible={setAddWheelModalVisible}
        setWheels={setWheels}
        t={t}
      />}

      {WheelHistorySelectModalVisible && <WheelHistorySelectModal
        wheelHistorySelectModalVisible={WheelHistorySelectModalVisible}
        setWheelHistorySelectModalVisible={setWheelHistorySelectModalVisible}
        wheels={wheels}
        t={t}
      />}
    </View>
  )  
}

export default LuckyWheelScreen