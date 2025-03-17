import { View, TouchableOpacity, Image, Text, Animated, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import StartIcon from '../../assets/icons/StartIcon'
import HistoryIcon from '../../assets/icons/HistoryIcon'
import CustomIcon from '../../assets/icons/CustomIcon'
import RestartIcon from '../../assets/icons/RestartIcon'
import CoinCustomModal from '../modals/CoinCustomModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CoinHistoryModal from '../modals/CoinHistoryModal'
import LottieView from 'lottie-react-native'

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const FlippingCoinScreen = () => {
  const [coinIndex, setCoinIndex] = useState<number>(1);
  const [coinCustomModalVisible, setCoinCustomModalVisible] = useState<boolean>(false);
  const [coinHistoryModalVisible, setCoinHistoryModalVisible] = useState<boolean>(false);
  const [coinSide, setCoinSide] = useState<number>(1);
  const [tempCoinSide, setTempCoinSide] = useState<number>(coinSide);
  const [history, setHistory] = useState<{ coinSide: number; date: string; time: string }[]>([]);
  const [headCounter, setHeadCounter] = useState<number>(0);
  const [tailCounter, setTailCounter] = useState<number>(0);
  const [isRandoming, setIsRandoming] = useState<boolean>(false);
  const [showLottie, setShowLottie] = useState<boolean>(false);

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [showLottie])

  const RandomCoinSide = () => {
    setIsRandoming(true);
    setShowLottie(false);
    let randomInterval = setInterval(() => {
      setTempCoinSide(Math.floor(Math.random() * 2) + 1);
    }, 50);
    setTimeout(() => {
      clearInterval(randomInterval);
      setCoinSide(tempCoinSide);
      setIsRandoming(false);
      setShowLottie(true);
      SaveData(tempCoinSide);
    }, 5 * 1000);
  }

  const SaveData = async (side: number) => {
    try {
      const currentDate = new Date();
      const dataToSave = {
        coinSide: side === 1 ? 'Heads' : 'Tails',
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      };

      const data = await AsyncStorage.getItem('coinSide');
      const existingData = data ? JSON.parse(data) : [];
      existingData.unshift(dataToSave);
      existingData.splice(15);
      await AsyncStorage.setItem('coinSide', JSON.stringify(existingData));
      setHistory(existingData);
      if (side === 1) {
        setHeadCounter(headCounter + 1);
      } else {
        setTailCounter(tailCounter + 1);
      }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  }

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
    <>
      {showLottie && <View pointerEvents='none' style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 11, justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedLottieView
          source={require('../../assets/lotties/confetti.json')}
          progress={animationProgress.current}
          style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
          resizeMode='cover'
        />
      </View>}

      <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20%' }}>
        <View style={{width: '70%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 'auto', marginRight: 20}}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={heads[coinIndex]}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontSize: 20, fontWeight: '500', marginLeft: 10 }}>{headCounter}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={tails[coinIndex]}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontSize: 20, fontWeight: '500', marginLeft: 10 }}>{tailCounter}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setHeadCounter(0);
              setTailCounter(0);
              setHistory([]);
            }}
          >
            <RestartIcon width={30} height={30} />
          </TouchableOpacity>
        </View>
        
        <View style={{ width: '70%', height: '70%'}}>
          <Image
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            source={ isRandoming ? (tempCoinSide === 1 ? heads[coinIndex] : tails[coinIndex]) : (coinSide === 1 ? heads[coinIndex] : tails[coinIndex]) }
          />
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', backgroundColor: '#305b69', paddingVertical: 2, borderRadius: 100 }}>
        <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => setCoinHistoryModalVisible(true)}>
          <HistoryIcon width={40} height={40} fill={'white'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }} onPress={RandomCoinSide}>
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

        <CoinHistoryModal
          coinHistoryModalVisible={coinHistoryModalVisible}
          setCoinHistoryModalVisible={setCoinHistoryModalVisible}
          history={history}
        />
      </View>
    </>
  )
}

export default FlippingCoinScreen