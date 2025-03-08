import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import HistoryIcon from '../../assets/icons/HistoryIcon';
import StartIcon from '../../assets/icons/StartIcon';
import CustomIcon from '../../assets/icons/CustomIcon';
import RandomCustomModal from '../modals/RandomCustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RandomHistoryModal from '../modals/RandomHistoryModal';

const RandomNumberScreen = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [endNumber, setEndNumber] = useState<number>(100);
  const [duration, setDuration] = useState<number>(5);
  const [isRandoming, setIsRandoming] = useState<boolean>(false);
  const [tempNumber, setTempNumber] = useState<number>(startNumber);
  const [RandomCustomModalVisible, setRandomCustomModalVisible] = useState<boolean>(false);
  const [RandomHistoryModalVisible, setRandomHistoryModalVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<{ randomNumber: number; date: string; time: string }[]>([]);

  const StartRandom = () => {
    setIsRandoming(true);
    let randomInterval = setInterval(() => {
      setTempNumber(Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber);
    }, 50);
    setTimeout(() => {
      clearInterval(randomInterval);
      setRandomNumber(tempNumber);
      setIsRandoming(false);
      SaveData(tempNumber);
    }, duration * 1000);
  };

  const SaveData = async (number: number) => {
    try {
      const currentDate = new Date();
      const dataToSave = {
        randomNumber: number,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      };

      const data = await AsyncStorage.getItem('randomNumber');
      const existingData = data ? JSON.parse(data) : [];
      existingData.unshift(dataToSave);
      existingData.splice(15);
      await AsyncStorage.setItem('randomNumber', JSON.stringify(existingData));
      setHistory(existingData);
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingTop: '60%', paddingBottom: '20%' }}>
      <Text style={{ fontSize: 120, fontWeight: '600' }}>{isRandoming ? tempNumber : randomNumber}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', backgroundColor: '#305b69', paddingVertical: 2, borderRadius: 100 }}>
        <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => setRandomHistoryModalVisible(true)}>
          <HistoryIcon width={40} height={40} fill={'white'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }} onPress={StartRandom}>
          <StartIcon width={80} height={80} />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => setRandomCustomModalVisible(true)}>
          <CustomIcon width={40} height={40} fill={'white'} />
        </TouchableOpacity>
      </View>

      <RandomCustomModal 
        RandomCustomModalVisible={RandomCustomModalVisible}
        setRandomCustomModalVisible={setRandomCustomModalVisible}
        startNumber={startNumber}
        setStartNumber={setStartNumber}
        endNumber={endNumber}
        setEndNumber={setEndNumber}
        duration={duration}
        setDuration={setDuration}
      />

      <RandomHistoryModal
        RandomHistoryModalVisible={RandomHistoryModalVisible}
        setRandomHistoryModalVisible={setRandomHistoryModalVisible}
        history={history}
      />
    </View>
  );
};

export default RandomNumberScreen;
