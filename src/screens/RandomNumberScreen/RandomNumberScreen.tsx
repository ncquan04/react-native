import { View, Animated, Easing, Vibration } from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import RandomCustomModal from './modals/RandomCustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RandomHistoryModal from './modals/RandomHistoryModal';
import LottieView from 'lottie-react-native';
import AnimatedNumber from '../../components/AnimatedNumber';
import StartGameBar from '../../components/StartGameBar';
import { useDarkMode } from '../../contexts/DarkModeContext';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const RandomNumberScreen = () => {
  const { theme } = useDarkMode();
  const [RandomCustomModalVisible, setRandomCustomModalVisible] = useState<boolean>(false);
  const [RandomHistoryModalVisible, setRandomHistoryModalVisible] = useState<boolean>(false);
  const [setting, setSetting] = useState<{ startNumber: number; endNumber: number; duration: number }>({
    startNumber: 1,
    endNumber: 100,
    duration: 5,
  });
  const isRandoming = useRef<boolean>(false);
  const history = useRef<{ randomNumber: number; date: string; time: string }[]>([]);
  const [showLottie, setShowLottie] = useState<boolean>(false);
  const animationProgress = useRef(new Animated.Value(0));
  const animatedNumberRef = useRef<{startRandom: () => void}>(null);

  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation | null = null;
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

  const startRandom = () => {
    if (isRandoming.current) return; // Ngăn chặn nhiều lần nhấn
    Vibration.vibrate(75);
    isRandoming.current = true;
    setShowLottie(false);
    animationProgress.current.setValue(0);
    animatedNumberRef.current?.startRandom();
  };

  const saveData = async (number: number) => {
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
      isRandoming.current = false;
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

      <View style={{ width: '100%', height: '100%', backgroundColor: theme.background_color, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingTop: '60%', paddingBottom: '20%' }}>
        <AnimatedNumber
          startNumber={setting.startNumber}
          endNumber={setting.endNumber}
          duration={setting.duration}
          saveData={saveData}
          ref={animatedNumberRef}
        />
        <StartGameBar
          setHistoryModalVisible={setRandomHistoryModalVisible}
          setCustomModalVisible={setRandomCustomModalVisible}
          startRandom={startRandom}
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
