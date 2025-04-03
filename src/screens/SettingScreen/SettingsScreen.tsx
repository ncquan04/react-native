import { View, Text, TouchableOpacity, Switch, Vibration } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import EarthIcon from '../../../assets/icons/EarthIcon'
import NextIcon from '../../../assets/icons/NextIcon'
import LanguageModal from './modals/LanguageModal'
import { LanguageContext } from '../../contexts/LanguageContext'
import MuteMusicIcon from '../../../assets/icons/MuteMusicIcon'
import MuteSoundIcon from '../../../assets/icons/MuteSoundIcon'
import NativeMusicPlayer from '../../../specs/NativeMusicPlayer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REMOTE_KEY, useGetRemoteConfig } from '../../remoteConfig/RemoteConfig'
import DarkModeIcon from '../../../assets/icons/DarkModeIcon'
import colors, { useColors } from '../../constants/colors'
import { DarkModeContext } from '../../contexts/DarkModeContext'

const SettingsScreen: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isMuteMusic, setIsMuteMusic] = useState<boolean>(false);
  const [isMuteSound, setIsMuteSound] = useState<boolean>(false);
    const [LanguageModalVisible, setLanguageModalVisible] = useState<boolean>(false)

  useEffect(() => {
    const fetchMuteMusic = async () => {
      const isMuteMusic = await AsyncStorage.getItem('isMuteMusic');
      if (isMuteMusic) {
        setIsMuteMusic(JSON.parse(isMuteMusic));
      }
    }
    fetchMuteMusic();
  })


  const toggleMuteMusic = () => {
    isMuteMusic ? NativeMusicPlayer.startMusic() : NativeMusicPlayer.stopMusic();
    AsyncStorage.setItem('isMuteMusic', JSON.stringify(!isMuteMusic));
    setIsMuteMusic(!isMuteMusic);
  }

  const toggleMuteSound = () => {
    setIsMuteSound(!isMuteSound);
  }

  const saveDarkMode = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(value));
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <View 
      style={{width: '100%', height: '100%', paddingVertical: 20, flexDirection: 'column', 
      justifyContent: 'flex-start', alignItems: 'center', backgroundColor: useColors().background_color}}
    >
      <Text style={{fontSize: 35, fontWeight: 700, color: colors.text_color}}>{t['SETTING']}</Text>
      <View style={{width: '90%', flexDirection: 'column', marginTop: 20}}>
          <Text style={{fontSize: 25, fontWeight: 600, color: colors.text_color}}>{t['General']}</Text>

          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), 
            padding: 10, borderRadius: 20, marginTop: 20, paddingHorizontal: 10, paddingVertical: 20}}
            onPress={() => {
              Vibration.vibrate(50);
              setLanguageModalVisible(true);
            }}
          >
            <EarthIcon width={30} height={30} fill={colors.background_color}/>
            <Text style={{fontSize: 20, fontWeight: 500, color: colors.background_color, marginLeft: 20}}>{t['Language']}</Text>
            <NextIcon width={20} height={20} fill={colors.background_color} style={{marginLeft: 'auto'}}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), 
            padding: 10, borderRadius: 20, marginTop: 10, paddingHorizontal: 10, paddingVertical: 20}}
            onPress={() => {
              Vibration.vibrate(50);
              toggleMuteMusic();
            }}
          >
            <MuteMusicIcon width={30} height={30} fill={colors.background_color}/>
            <Text style={{fontSize: 20, fontWeight: 500, color: colors.background_color, marginLeft: 20}}>{t['Mute music']}</Text>
            <Switch
              trackColor={{false: colors.background_color, true: useGetRemoteConfig(REMOTE_KEY.secondary_color)}}
              thumbColor={colors.background_color}
              onValueChange={toggleMuteMusic}
              value={isMuteMusic}
              style={{marginLeft: 'auto'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), 
            padding: 10, borderRadius: 20, marginTop: 10, paddingHorizontal: 10, paddingVertical: 20}}
            onPress={() => {
              Vibration.vibrate(50);
              toggleMuteSound();
            }}
          >
            <MuteSoundIcon width={30} height={30} fill={colors.background_color}/>
            <Text style={{fontSize: 20, fontWeight: 500, color: colors.background_color, marginLeft: 20}}>{t['Mute sound']}</Text>
            <Switch
              trackColor={{false: colors.background_color, true: useGetRemoteConfig(REMOTE_KEY.secondary_color)}}
              thumbColor={colors.background_color}
              onValueChange={toggleMuteSound}
              value={isMuteSound}
              style={{marginLeft: 'auto'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), 
            padding: 10, borderRadius: 20, marginTop: 10, paddingHorizontal: 10, paddingVertical: 20}}
            onPress={() => {
              Vibration.vibrate(50);
              toggleDarkMode();
              saveDarkMode(!isDarkMode);
            }}
          >
            <DarkModeIcon width={30} height={30} fill={colors.background_color}/>
            <Text style={{fontSize: 20, fontWeight: 500, color: colors.background_color, marginLeft: 20}}>{t['Dark mode']}</Text>
            <Switch
              trackColor={{false: colors.background_color, true: useGetRemoteConfig(REMOTE_KEY.secondary_color)}}
              thumbColor={colors.background_color}
              onValueChange={() => {
                toggleDarkMode();
                saveDarkMode(!isDarkMode);
              }}
              value={isDarkMode}
              style={{marginLeft: 'auto'}}
            />
          </TouchableOpacity>
      </View>

      {LanguageModalVisible && <LanguageModal
        LanguageModalVisible={LanguageModalVisible}
        setLanguageModalVisible={setLanguageModalVisible}
      />}
    </View>
  )
}

export default SettingsScreen