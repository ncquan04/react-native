import { View, Animated, Easing, Vibration } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RandomCustomModal from './modals/RandomCustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RandomHistoryModal from './modals/RandomHistoryModal';
import LottieView from 'lottie-react-native';
import AnimatedNumber from '../../components/AnimatedNumber';
import StartGameBar from '../../components/StartGameBar';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const RandomNumberScreen = () => {
  const [RandomCustomModalVisible, setRandomCustomModalVisible] = useState<boolean>(false);
  const [RandomHistoryModalVisible, setRandomHistoryModalVisible] = useState<boolean>(false);
  const [setting, setSetting] = useState<{ startNumber: number; endNumber: number; duration: number }>({
    startNumber: 1,
    endNumber: 100,
    duration: 5,
  });
  const [randomNumber, setRandomNumber] = useState<number>(setting.startNumber);
  const [isRandoming, setIsRandoming] = useState<boolean>(false); // Chuyển từ useRef sang useState để kích hoạt re-render
  const history = useRef<{ randomNumber: number; date: string; time: string }[]>([]);
  const [showLottie, setShowLottie] = useState<boolean>(false);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation | null = null; // Khai báo biến animationLoop ở đây
    if (showLottie) {
      animationLoop = Animated.loop(
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        { iterations: 3 }
      );
      animationLoop.start();
    }

    // Thêm hàm cleanup để tránh memory leak
    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [showLottie]);

  const StartRandom = () => {
    if (isRandoming) return; // Ngăn chặn nhiều lần nhấn
    
    Vibration.vibrate(75);
    setIsRandoming(true); // Sử dụng setState thay vì useRef
    setShowLottie(false);
    animationProgress.current.setValue(0);
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
      history.current = existingData;
      
      // Đặt trạng thái sau khi lưu dữ liệu
      setIsRandoming(false);
      setShowLottie(true);
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  return (
    <>
      {showLottie && (
        <View pointerEvents='none' style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 11, justifyContent: 'center', alignItems: 'center' }}>
          <AnimatedLottieView
            source={require('../../../assets/lotties/confetti.json')}
            progress={animationProgress.current}
            style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
            resizeMode='cover'
          />
        </View>
      )}

      <View style={{ width: '100%', height: '100%', backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingTop: '60%', paddingBottom: '20%' }}>
        <AnimatedNumber
          startNumber={setting.startNumber}
          endNumber={setting.endNumber}
          duration={setting.duration}
          isRandoming={isRandoming}
          SaveData={SaveData}
        />
        <StartGameBar
          setHistoryModalVisible={setRandomHistoryModalVisible}
          setCustomModalVisible={setRandomCustomModalVisible}
          StartRandom={StartRandom}
        />
      </View>

      {RandomCustomModalVisible && <RandomCustomModal
        RandomCustomModalVisible={RandomCustomModalVisible}
        setRandomCustomModalVisible={setRandomCustomModalVisible}
        setting={setting}
        setSetting={setSetting}
      />}

      {RandomHistoryModalVisible && <RandomHistoryModal
        RandomHistoryModalVisible={RandomHistoryModalVisible}
        setRandomHistoryModalVisible={setRandomHistoryModalVisible}
        history={history.current}
      />}
    </>
  );
};

export default RandomNumberScreen;
