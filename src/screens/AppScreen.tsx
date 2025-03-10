import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'
import AddIcon from '../../assets/icons/AddIcon';
import HistoryIcon from '../../assets/icons/HistoryIcon';
import LuckyWheelPart from '../components/LuckyWheelPart';
import WheelOfFortune from '../components/LuckyWheelPart';
import LuckyWheel from '../components/LuckyWheel';

const AppScreen = () => {
  const {t} = useContext(LanguageContext);


  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <Text style={{fontSize: 30, fontWeight: 500, marginTop: 10}}>{t['Wheels']}</Text>
      <View style={{flexDirection: 'row', marginTop: 20, width: '90%', justifyContent: 'space-between'}}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}>
          <AddIcon width={30} height={30} fill={'white'} />
          <Text style={{fontSize: 17, fontWeight: 500, color: 'white', marginLeft: 10}}>Wheel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}>
        <HistoryIcon width={30} height={30} fill={'white'} />
          <Text style={{fontSize: 17, fontWeight: 500, color: 'white', marginLeft: 10}}>History</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{width: '100%', marginTop: 20}}>
        <LuckyWheel 
          segments={[
            { content: "1", color: "red"},
            { content: "2", color: "blue"},
            { content: "3", color: "green"},
            { content: "4", color: "yellow"},
            { content: "5", color: "purple"},
            { content: "6", color: "orange"},]}
          radius={120}
          crustOffset={15}
        />
      </ScrollView>
    </View>
  )  
}

export default AppScreen