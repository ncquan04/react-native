import { View, Text, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HistoryIcon from '../../../assets/icons/HistoryIcon';
import StartIcon from '../../../assets/icons/StartIcon';
import CustomIcon from '../../../assets/icons/CustomIcon';
import RandomCustomModal from './modals/RandomCustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RandomHistoryModal from './modals/RandomHistoryModal';
import LottieView from 'lottie-react-native';
import colors from '../../constants/colors';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const AnimatedText = Animated.createAnimatedComponent(Text);

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
  const [showLottie, setShowLottie] = useState<boolean>(false);
  const numberScale = useRef(new Animated.Value(1));

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { iterations: 3 }
    ).start();
  }, [showLottie])

  const StartRandom = () => {
    if (isRandoming) return; // Ngăn chặn nhiều lần nhấn
    
    Vibration.vibrate(75);
    setIsRandoming(true);
    setShowLottie(false);
    animationProgress.current.setValue(0);
    
    // Animation cho số khi bắt đầu
    Animated.sequence([
      Animated.timing(numberScale.current, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(numberScale.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    let intervalId: NodeJS.Timeout;
    let elapsedTime = 0;
    const totalDuration = duration * 1000;
    const initialInterval = 100; // Thời gian ban đầu giữa các lần cập nhật (ms)
    const finalInterval = 500; // Thời gian cuối cùng giữa các lần cập nhật (ms)
    
    // Hàm tính toán khoảng thời gian giữa các lần cập nhật
    const calculateInterval = (elapsed: number) => {
      // Sử dụng hàm easeInOutQuad để tạo hiệu ứng nhanh dần rồi chậm dần
      const progress = elapsed / totalDuration;
      if (progress < 0.5) {
        // Nhanh dần trong nửa đầu
        return initialInterval - (initialInterval - 10) * (progress * 2);
      } else {
        // Chậm dần trong nửa sau
        return 10 + (finalInterval - 10) * ((progress - 0.5) * 2);
      }
    };
    
    const updateNumber = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      elapsedTime += deltaTime;
      startTime = currentTime;
      
      if (elapsedTime >= totalDuration) {
        clearInterval(intervalId);
        const finalRandomNumber = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;
        setRandomNumber(finalRandomNumber);
        setTempNumber(finalRandomNumber);
        setIsRandoming(false);
        
        // Animation cho số khi kết thúc
        Animated.sequence([
          Animated.timing(numberScale.current, {
            toValue: 1.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(numberScale.current, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
        
        animationProgress.current.setValue(0);
        setShowLottie(true);
        Vibration.vibrate([0, 100, 50, 100]);
        SaveData(finalRandomNumber);
        return;
      }
      
      setTempNumber(Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber);
      
      if (elapsedTime < totalDuration / 2) {
        // Trong nửa đầu, tạo rung nhẹ
        Vibration.vibrate(5);
      } else if (elapsedTime > totalDuration * 0.8) {
        // Trong 20% cuối, tạo rung mạnh hơn
        Vibration.vibrate(15);
      } else {
        // Trong khoảng giữa
        Vibration.vibrate(10);
      }
      
      // Cập nhật interval dựa trên thời gian đã trôi qua
      clearInterval(intervalId);
      const newInterval = calculateInterval(elapsedTime);
      intervalId = setInterval(updateNumber, newInterval);
    };
    
    let startTime = Date.now();
    intervalId = setInterval(updateNumber, initialInterval);
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
    <>

      {showLottie && <View pointerEvents='none' style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 11, justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedLottieView
          source={require('../../../assets/lotties/confetti.json')}
          progress={animationProgress.current}
          style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
          resizeMode='cover'
        />
      </View>}

      <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingTop: '60%', paddingBottom: '20%' }}>
        <AnimatedText 
          style={{ fontSize: 120, fontWeight: '600', transform: [{ scale: numberScale.current }] }}
        >
          {isRandoming ? tempNumber : randomNumber}
        </AnimatedText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', backgroundColor: colors.primary, paddingVertical: 2, borderRadius: 100 }}>
          <TouchableOpacity 
            style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} 
            onPress={() => {
              Vibration.vibrate(50);
              setRandomHistoryModalVisible(true)
            }}
          >
            <HistoryIcon width={40} height={40} fill={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }} onPress={StartRandom}>
            <StartIcon width={80} height={80} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} 
            onPress={() => {
              Vibration.vibrate(50);
              setRandomCustomModalVisible(true)
            }}
          >
            <CustomIcon width={40} height={40} fill={'white'} />
          </TouchableOpacity>
        </View>

        {RandomCustomModalVisible && <RandomCustomModal
          RandomCustomModalVisible={RandomCustomModalVisible}
          setRandomCustomModalVisible={setRandomCustomModalVisible}
          startNumber={startNumber}
          setStartNumber={setStartNumber}
          endNumber={endNumber}
          setEndNumber={setEndNumber}
          duration={duration}
          setDuration={setDuration}
        />}

        {RandomHistoryModalVisible && <RandomHistoryModal
          RandomHistoryModalVisible={RandomHistoryModalVisible}
          setRandomHistoryModalVisible={setRandomHistoryModalVisible}
          history={history}
        />}
      </View>
    </>
  );
};

export default RandomNumberScreen;
