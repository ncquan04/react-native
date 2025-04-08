import { View, Text, TouchableOpacity, Vibration } from 'react-native'
import React from 'react'
import HistoryIcon from '../../assets/icons/HistoryIcon';
import StartIcon from '../../assets/icons/StartIcon';
import CustomIcon from '../../assets/icons/CustomIcon';
import { useDarkMode } from '../contexts/DarkModeContext';

interface StartGameBarProps {
    setCustomModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setHistoryModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    startRandom: () => void;
}

const StartGameBar = ({setHistoryModalVisible, setCustomModalVisible, startRandom}: StartGameBarProps) => {
  const { theme } = useDarkMode();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', backgroundColor: theme.primary_color, paddingVertical: 2, borderRadius: 100 }}>
          <TouchableOpacity
            style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} 
            onPress={() => {
                Vibration.vibrate(50);
                setHistoryModalVisible(true)
            }}
          >
            <HistoryIcon width={40} height={40} fill={theme.text_color} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }} onPress={startRandom}>
            <StartIcon width={80} height={80} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} 
            onPress={() => {
              Vibration.vibrate(50);
              setCustomModalVisible(true)
            }}
          >
            <CustomIcon width={40} height={40} fill={theme.text_color} />
          </TouchableOpacity>
        </View>
    )
}

export default StartGameBar