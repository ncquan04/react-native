import { View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import StartIcon from '../../assets/icons/StartIcon'
import HistoryIcon from '../../assets/icons/HistoryIcon'
import CustomIcon from '../../assets/icons/CustomIcon'

const FlippingCoinStore = () => {
  const [coinIndex, setCoinIndex] = useState<number>(1);

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40%', paddingBottom: '20%' }}>
      <View style={{ width: '70%', height: '70%'}}>
        {coinIndex === 1 && <Image source={require('../../assets/coins/heads_1.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
        {coinIndex === 2 && <Image source={require('../../assets/coins/heads_2.png')} />}
        {coinIndex === 3 && <Image source={require('../../assets/coins/heads_3.png')} />}
      </View>

      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', backgroundColor: '#305b69', paddingVertical: 2, borderRadius: 100 }}>
      <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
        <HistoryIcon width={40} height={40} fill={'white'} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
        <StartIcon width={80} height={80} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
        <CustomIcon width={40} height={40} fill={'white'} />
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default FlippingCoinStore