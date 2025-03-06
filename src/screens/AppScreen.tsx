import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import NativeMusicPlayer from '../../specs/NativeMusicPlayer'

const AppStore = () => {

  const onStartAudio = () => {
    NativeMusicPlayer.startMusic();
  }
  
  const onStopAudio = () => {
    NativeMusicPlayer.stopMusic();
  }

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', gap: 32, flex: 1}}>
      <TouchableOpacity onPress={onStartAudio}>
        <Text>Start audio</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStopAudio}>
        <Text>Stop audio</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppStore