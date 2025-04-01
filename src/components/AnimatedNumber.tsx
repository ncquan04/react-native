import { View, Text, Animated, Vibration } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  startNumber?: number;
  endNumber?: number;
  duration?: number;
  isRandoming?: boolean;
  SaveData?: (randomNumber: number) => void;
}

const AnimatedNumber = ({ startNumber = 1, endNumber = 100, duration = 5, isRandoming, SaveData }: AnimatedNumberProps) => {
  const numberScale = useRef(new Animated.Value(1));
  const [displayNumber, setDisplayNumber] = useState<number>(startNumber);

  useEffect(() => {
    if (!isRandoming) {
      return;
    }
    
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

    let startTime = Date.now();
    
    const updateNumber = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      elapsedTime += deltaTime;
      startTime = currentTime;

      if (elapsedTime >= totalDuration) {
        clearInterval(intervalId);
        // Đảm bảo endNumber >= startNumber
        const validStartNumber = Math.min(startNumber, endNumber);
        const validEndNumber = Math.max(startNumber, endNumber);
        const finalRandomNumber = Math.floor(Math.random() * (validEndNumber - validStartNumber + 1)) + validStartNumber;
        setDisplayNumber(finalRandomNumber);
        
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
        if (SaveData) {
          SaveData(finalRandomNumber);
        }
        
        return;
      }

      // Đảm bảo random trong khoảng hợp lệ
      const validStartNumber = Math.min(startNumber, endNumber);
      const validEndNumber = Math.max(startNumber, endNumber);
      setDisplayNumber(Math.floor(Math.random() * (validEndNumber - validStartNumber + 1)) + validStartNumber);

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

    // Hàm cleanup để tránh memory leak
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    
  }, [isRandoming, startNumber, endNumber, duration, SaveData]);

  return (
    <Animated.Text
      style={{ fontSize: 120, fontWeight: '600', transform: [{ scale: numberScale.current }] }}
    >
      {displayNumber}
    </Animated.Text>
  )
}

export default AnimatedNumber
