import { View, Text, Animated, Vibration } from 'react-native'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDarkMode } from '../contexts/DarkModeContext';

interface AnimatedNumberRef {
  startRandom: () => void;
}

interface AnimatedNumberProps {
  startNumber?: number;
  endNumber?: number;
  duration?: number;
  saveData?: (randomNumber: number) => void;
  ref: React.Ref<AnimatedNumberRef>;
}

const AnimatedNumber = ({ startNumber = 1, endNumber = 100, duration = 5, saveData, ref }: AnimatedNumberProps) => {
  const { theme } = useDarkMode();
  const numberScale = useRef(new Animated.Value(1));
  const [displayNumber, setDisplayNumber] = useState<number>(startNumber);

  useImperativeHandle(ref, () => ({
    startRandom: () => {
      startRandom();
    }
  }))

  const startRandom = () => {
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
    const initialInterval = 100; // Thời gian ban đầu giữa các lần cập nhật
    const finalInterval = 500; // Thời gian cuối cùng giữa các lần cập nhật

    // Hàm tính toán khoảng thời gian giữa các lần cập nhật
    const calculateInterval = (elapsed: number) => {
      const progress = elapsed / totalDuration;
      if (progress < 0.5) {
        // Nhanh dần trong nửa đầu
        return initialInterval - (initialInterval - 10) * (progress * 2);
      } else {
        // Chậm dần trong nửa sau
        return 10 + (finalInterval - 10) * ((progress - 0.5) * 2);
      }
    };

    let startTime = Date.now();
    
    const updateNumber = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      elapsedTime += deltaTime;
      startTime = currentTime;

      if (elapsedTime >= totalDuration) {
        clearInterval(intervalId);
        const finalNumber = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;
        setDisplayNumber(finalNumber);
        
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
        
        // Rung khi kết thúc
        Vibration.vibrate([0, 100, 50, 100]);
        
        // Gọi callback nếu có
        if (saveData) {
          saveData(finalNumber);
        }
        return;
      }

      // Đảm bảo random trong khoảng hợp lệ
      setDisplayNumber(Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber);

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

    intervalId = setInterval(updateNumber, initialInterval);
  }

  return (
    <Animated.Text
      style={{ fontSize: 120, fontWeight: '600', color: theme.contrast_text_color, transform: [{ scale: numberScale.current }] }}
    >
      {displayNumber}
    </Animated.Text>
  )
}

export default AnimatedNumber
