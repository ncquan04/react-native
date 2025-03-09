import { View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import StartIcon from '../../assets/icons/StartIcon'
import HistoryIcon from '../../assets/icons/HistoryIcon'
import CustomIcon from '../../assets/icons/CustomIcon'
import RestartIcon from '../../assets/icons/RestartIcon'
import CoinCustomModal from '../modals/CoinCustomModal'

const FlippingCoinScreen = () => {
  const [coinIndex, setCoinIndex] = useState<number>(1);
  const [coinCustomModalVisible, setCoinCustomModalVisible] = useState<boolean>(false);

  const heads: { [key: number]: any } = {
    1: require('../../assets/coins/heads_1.png'),
    2: require('../../assets/coins/heads_2.png'),
    3: require('../../assets/coins/heads_3.png'),
    4: require('../../assets/coins/heads_4.png'),
    5: require('../../assets/coins/heads_5.png')
  }

  const tails: { [key: number]: any } = {
    1: require('../../assets/coins/tails_1.png'),
    2: require('../../assets/coins/tails_2.png'),
    3: require('../../assets/coins/tails_3.png'),
    4: require('../../assets/coins/tails_4.png'),
    5: require('../../assets/coins/tails_5.png')
  }

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20%' }}>
      <View style={{width: '70%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 'auto', marginRight: 20}}>
        <View>
          <Image/>
        </View>
        <View>
          <Image/>
        </View>
        <TouchableOpacity>
          <RestartIcon width={30} height={30} />
        </TouchableOpacity>
      </View>
      
      <View style={{ width: '70%', height: '70%'}}>
        <Image
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          source={heads[coinIndex]}
        />
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', backgroundColor: '#305b69', paddingVertical: 2, borderRadius: 100 }}>
      <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
        <HistoryIcon width={40} height={40} fill={'white'} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
        <StartIcon width={80} height={80} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => setCoinCustomModalVisible(true)}>
        <CustomIcon width={40} height={40} fill={'white'} />
      </TouchableOpacity>
      </View>

      <CoinCustomModal
        coinIndex={coinIndex}
        setCoinIndex={setCoinIndex}
        coinCustomModalVisible={coinCustomModalVisible}
        setCoinCustomModalVisible={setCoinCustomModalVisible}
        heads={heads}
        tails={tails}
      />
    </View>
  )
}

export default FlippingCoinScreen