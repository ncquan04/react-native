import React, {useState, useEffect, useCallback, useMemo, useContext, useRef} from 'react';
import { View, PanResponder, StyleSheet, TouchableOpacity, Text, StatusBar, Image, Animated, Easing } from 'react-native';

import TouchElement from '../components/TouchElement';
import usePrevious from '../hooks/usePrevious';
import RestartIcon from '../../assets/icons/RestartIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import LottieView from 'lottie-react-native';

interface Finger {
  identifier: number;
  pageX: number;
  pageY: number;
}

const COLORS: string[] = [
  '#d55e5e', '#94d361', '#c673cf', '#9da74f', '#dbaa61', '#686ac8', '#795479', '#ffff00', '#da5f83',
];

const TIME_LIMIT: number = 3000;
let timerInterval: NodeJS.Timeout;

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const LuckyDrawScreen: React.FC = ({navigation}: any) => {
  const {t} = useContext(LanguageContext);
  
  const [fingers, setFingers] = useState<Finger[]>([]);
  const prevFingers = usePrevious(fingers);
  const [playerJoined, setPlayerJoined] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  
  const [timer, setTimer] = useState<number>(0);
  const [fill, setFill] = useState<number>(0);
  
  const [winner, setWinner] = useState<number | null>(null);
  const [randomInProgress, setRandomInProgress] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [displayButton, setDisplayButton] = useState<boolean>(false);

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

  useEffect(() => {
    if (prevFingers?.length !== fingers.length && fingers.length > 1) {
      startTimer();
    } else if (fingers.length < 2) {
      stopTimer();
    }
  }, [fingers, prevFingers]);

  useEffect(() => {
    setFill((timer * 100) / TIME_LIMIT);
    if (timer === TIME_LIMIT + 100) {
      startRandomSelection();
    }
  }, [timer, fingers]);

  const startTimer = () => {
    if (winner !== null) return;
    
    setTimer(0);
    setFill(0);
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      setTimer(prevTime => prevTime + 100);
    }, 100);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    setTimer(0);
    setFill(0);
    setWinner(null);
  };

  const startRandomSelection = () => {
    setRandomInProgress(true);
    setShowLottie(false);
    setGameOver(true);
    
    let currentIndex = 0;
    const fastInterval = setInterval(() => {
      setHighlightedIndex(currentIndex);
      currentIndex++;
      if (currentIndex >= fingers.length) {
        currentIndex = Math.floor(Math.random() * fingers.length);
      }
    }, 75);

    setTimeout(() => {
      clearInterval(fastInterval);
      
      const FLASH_INTERVAL = 150;
      const ANIMATION_DURATION = 3000;
      
      let index = 0;
      const highlightInterval = setInterval(() => {
        setHighlightedIndex(index % fingers.length);
        index++;
        
        if (index >= fingers.length * 10) {
          clearInterval(highlightInterval);
          
          setTimeout(() => {
            const winnerIndex = Math.floor(Math.random() * fingers.length);
            const winnerIdentifier = fingers[winnerIndex]?.identifier;
            setWinner(winnerIdentifier);
            setRandomInProgress(false);
            setDisplayButton(true);
          }, 300);
        }
      }, FLASH_INTERVAL);
      
      setTimeout(() => {
        clearInterval(highlightInterval);
        if (!winner) {
          const winnerIndex = Math.floor(Math.random() * fingers.length);
          const winnerIdentifier = fingers[winnerIndex]?.identifier;
          setWinner(winnerIdentifier);
          setRandomInProgress(false);
          setShowLottie(true);
          setDisplayButton(true);
        }
      }, ANIMATION_DURATION);
      
    }, 3000);
  }

  const handleTouchEvents = useCallback(
    (event: any) => {
      if (!gameOver) {
        const {nativeEvent: {touches}} = event;
        
        const coords: Finger[] = touches.map((touch: any) => ({
          identifier: touch.identifier,
          pageX: touch.pageX,
          pageY: touch.pageY,
        }));
        
        setFingers(coords);
        if (!playerJoined) {
          setPlayerJoined(true);
        }
      }
    }, [gameOver, playerJoined]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => { },
        onPanResponderStart: handleTouchEvents,
        onPanResponderMove: handleTouchEvents,
        onPanResponderEnd: handleTouchEvents,
      }), [handleTouchEvents]);

  const restartGame = () => {
    setFingers([]);
    setTimer(0);
    setFill(0);
    setWinner(null);
    setRandomInProgress(false);
    setShowLottie(false);
    setHighlightedIndex(null);
    setGameOver(false);
    setPlayerJoined(false);
    setDisplayButton(false);
  };

  const renderInstructions = () => {
    if (!playerJoined) {
      const logo = require('../../assets/images/randomHandTouch.png');
      return (
        <View style={styles.centeredTextContainer}>
          <Text style={styles.centeredText}>
            {t['1. Everyone (2 - 10 people) HOLD one finger on the screen']},
          </Text>
          <Text style={styles.centeredText}>
            {t['2. Wait 3 seconds then remove your finger from the screen']},
          </Text>
          <Text style={styles.centeredText}>
            {t['3. The winner will be highlighted on the screen']},
          </Text>
          <View style={styles.centeredImage}>
            <Image source={logo} style={{width: 100, height: 100}} />
          </View>
        </View>
      );
    }
    return null;
  };

  const renderFingerElements = () => {
    return fingers.map(finger => {
      const isWinner = winner !== null && finger.identifier === winner;
      const isHighlighted = randomInProgress && finger.identifier === highlightedIndex;
      
      return (
        <TouchElement
          key={finger.identifier}
          color={COLORS[finger.identifier]}
          top={finger.pageY}
          left={finger.pageX}
          fill={fill}
          highlighted={isHighlighted}
          resultDisplayed={isWinner}
        />
      );
    });
  };

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

      <View style={styles.Container}>
        <View
          style={[styles.GradientContainer, {backgroundColor: 'white'}]}
          {...panResponder.panHandlers}>
          
          {renderInstructions()}
          {renderFingerElements()}
          
        </View>
        
        {displayButton && (
          <TouchableOpacity
            style={styles.ButtonView}
            onPress={restartGame}>
            <RestartIcon
              width={50}
              height={50}
              fill={'#305b69'}
              style={{marginBottom: 50, zIndex: 10}}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  GradientContainer: {
    flex: 1,
  },
  TittleRow: {
    display: 'flex',
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginVertical: 2,
    paddingTop: StatusBar.currentHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ButtonLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 15,
  },
  ButtonRight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 15,
  },
  TittleText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 15,
  },
  ButtonView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  TittleBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
  },
  centeredTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 20,
  },
  centeredText: {
    textAlign: 'left',
    marginBottom: 20,
    color: 'black',
  },
  centeredImage: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 80,
    paddingRight: 20,
    marginBottom: 20,
    color: 'black',
  },
  ConfettiContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },
  ConfettiLottie: {
    flex: 1,
  },
});

export default LuckyDrawScreen;
