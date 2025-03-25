import { View, Text, TouchableOpacity, ScrollView, StatusBar, Vibration } from 'react-native'
import React, { use, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../contexts/LanguageContext';
import HistoryIcon from '../../assets/icons/HistoryIcon';
import AddIcon from '../../assets/icons/AddIcon';
import TrashIcon from '../../assets/icons/TrashIcon';
import LuckyWheel from '../components/LuckyWheel';
import LuckyWheelModal from '../modals/LuckyWheelModal';
import AddWheelModal from '../modals/AddWheelModal';
import WheelHistorySelectModal from '../modals/WheelHistorySelectModal';
import colors from '../constants/colors';

const AppScreen = ({ Wheels }: { Wheels: any[] }) => {
  const {t} = useContext(LanguageContext);
  const [LuckyWheelModalVisible, setLuckyWheelModalVisible] = useState<boolean>(false);
  const [wheelIndex, setWheelIndex] = useState<number>(0);
  const [addWheelModalVisible, setAddWheelModalVisible] = useState<boolean>(false);
  const [WheelHistorySelectModalVisible, setWheelHistorySelectModalVisible] = useState<boolean>(false);
  const [wheels, setWheels] = useState<any[]>(Wheels);
  const selectedWheel = useMemo(() => wheels[wheelIndex], [wheelIndex, wheels]);
  
  useEffect(() => {
    const fetchWheels = async () => {
      const wheels = await AsyncStorage.getItem('wheels');
      if (wheels) {
        setWheels(JSON.parse(wheels));
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
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <Text style={{fontSize: 30, fontWeight: 500, marginTop: 10}}>{t['Wheels']}</Text>
      <View style={{flexDirection: 'row', marginTop: 20, width: '90%', justifyContent: 'space-between'}}>
        <TouchableOpacity 
          style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}
          onPress={() => {
            Vibration.vibrate(50);
            setAddWheelModalVisible(true);
          }}  
        >
          <AddIcon width={30} height={30} fill={'white'} />
          <Text style={{fontSize: 17, fontWeight: 500, color: 'white', marginLeft: 10}}>{t['Wheel']}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}
          onPress={() => {
            Vibration.vibrate(50);
            setWheelHistorySelectModalVisible(true);
          }}
        >
          <HistoryIcon width={30} height={30} fill={'white'} />
          <Text style={{fontSize: 17, fontWeight: 500, color: 'white', marginLeft: 10}}>{t['History']}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{width: '100%', marginTop: 20}}>
        {wheels.length != 0 ? wheels.map((wheel, index) => {
          return (
            <TouchableOpacity 
              key={index}
              style={{flexDirection: 'column', justifyContent: 'space-between', width: '78%', padding: 15, height: 150, backgroundColor: colors.primary, borderRadius: 30, marginLeft: 20, marginTop: 20, position: 'relative'}}
              onPress={() => {
                Vibration.vibrate(50);
                setWheelIndex(index);
                setLuckyWheelModalVisible(true);
              }}
            >
              <View style={{width: '95%'}}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{color: 'white', fontSize: 20, fontWeight: 600, width: '70%'}}>{wheel.name}</Text>
              </View>
              <TouchableOpacity 
                style={{ width: '11%'}}
                onPress={() => {
                  Vibration.vibrate(50);
                  handleDeleteWheel(index);
                }}
              >
                <TrashIcon width={30} height={30} fill={'white'} />
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
        wheelIndex={wheelIndex}
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

export default AppScreen