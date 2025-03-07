import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import HistoryIcon from '../../assets/icons/HistoryIcon';
import StartIcon from '../../assets/icons/StartIcon';
import CustomIcon from '../../assets/icons/CustomIcon';
import RandomCustomModal from '../modals/RandomCustomModal';


const RandomNumberStore = () => {
  const [randomNumber, setRandomNumber] = useState<string>('0');
  const [startNumber, setStartNumber] = useState<number>(1);
  const [endNumber, setEndNumber] = useState<number>(100);
  const [duration, setDuration] = useState<number>(5);
  const [isRandoming, setIsRandoming] = useState<boolean>(false);
  const [tempNumber, setTempNumber] = useState<number>(startNumber);
  const [RandomCustomModalVisible, setRandomCustomModalVisible] = useState<boolean>(false);
  const [RandomHistoryModalVisible, setRandomHistoryModalVisible] = useState<boolean>(false);

  const StartRandom = () => {
    
  }
  
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', 
    justifyContent: 'space-between', alignItems: 'center', paddingTop: '60%', paddingBottom: '20%'}}
    >
      <Text style={{fontSize: 120, fontWeight: 600}}>{isRandoming ? tempNumber : randomNumber}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%', 
        backgroundColor: '#305b69', paddingVertical: 2, borderRadius: 100}}
      >
        <TouchableOpacity style={{width: '30%', justifyContent: 'center', alignItems: 'center'}}>
          <HistoryIcon width={40} height={40} fill={'white'}/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}
          onPress={StartRandom}
        >
          <StartIcon width={80} height={80}/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{width: '30%', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => setRandomCustomModalVisible(true)}
        >
          <CustomIcon width={40} height={40} fill={'white'}/>
        </TouchableOpacity>

        <RandomCustomModal 
          RandomCustomModalVisible={RandomCustomModalVisible}
          setRandomCustomModalVisible={setRandomCustomModalVisible}
        />
      </View>
    </View>
  )
}

export default RandomNumberStore