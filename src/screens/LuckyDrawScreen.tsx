import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'

const LuckyDrawStore = () => {
  const {t} = useContext(LanguageContext);

  return (
    <View style={{width: '100%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{width: '80%', height: '17%', flexDirection: 'column', justifyContent: 'space-between'}}>
        <Text>{t['1. Everyone (2 - 10 people) HOLD one finger on the screen']}</Text>
        <Text>{t['2. Wait 3 seconds then remove your finger from the screen']}</Text>
        <Text>{t['3. The winner will be highlighted on the screen']}</Text>
      </View>
      <View style={{width: '30%', height: '15%', marginTop: 20}}>
        <Image
          source={require('../../assets/images/randomHandTouch.png')}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    </View>
  )
}

export default LuckyDrawStore