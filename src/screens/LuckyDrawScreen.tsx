import React, {useState, useEffect, useCallback, useMemo, useRef, useContext} from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Text,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';

import TouchElement from '../components/TouchElement';
import usePrevious from '../hooks/usePrevious';
import RestartIcon from '../../assets/icons/RestartIcon';
import { LanguageContext } from '../contexts/LanguageContext';



interface Finger {
  identifier: number;
  pageX: number;
  pageY: number;
}

const colors: string[] = [
  '#d55e5e',
  '#94d361',
  '#c673cf',
  '#9da74f',
  '#dbaa61',
  '#686ac8',
  '#795479',
  '#ffff00',
  '#da5f83',
];

const timeLimit: number = 3000;
let timerInterval: NodeJS.Timeout;

const LuckyDrawScreen: React.FC = ({navigation}: any) => {
  const {t} = useContext(LanguageContext);
  const [fingers, setFingers] = useState<Finger[]>([]);
  const prevFingers = usePrevious(fingers); // saves previous state.
  const [timer, setTimer] = useState<number>(0);
  const [fill, setFill] = useState<number>(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [randomInProgress, setRandomInProgress] = useState(false); // State to track if random process is ongoing
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null); // State to highlight the winner index
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [playerJoined, setPlayerJoined] = useState<boolean>(false);
  const [displayButton, setDisplayButton] = useState<boolean>(false);
  const [resultFlashing, setResultFlashing] = useState<boolean>(false);

  useEffect(() => {
    if (prevFingers?.length !== fingers.length && fingers.length > 1) {
      startTimer();
    } else if (fingers.length < 2) {
      stopTimer();
    }
  }, [fingers, prevFingers]);

  const startRandomSelection = () => {
    setRandomInProgress(true);
    const maxVal = fingers.length - 1;
    const minVal = 0;
    setGameOver(true);
    let currentIndex1 = 0;
    const interval0 = setInterval(() => {
      setHighlightedIndex(currentIndex1);
      currentIndex1++;
      if (currentIndex1 >= fingers.length) {
        currentIndex1 = Math.floor(Math.random() * fingers.length);
      }
    }, 75);

    setTimeout(() => {
      clearInterval(interval0);
      let currentIndex = 0;
      const duration = 8;
      const interval1 = setInterval(() => {
        setHighlightedIndex(currentIndex);
        currentIndex++;
        if (currentIndex >= fingers.length + 1) {
          clearInterval(interval1);
          setTimeout(() => {
            const interval4 = setInterval(() => {
              setHighlightedIndex(currentIndex);
              currentIndex++;
              if (currentIndex >= fingers.length) {
                clearInterval(interval4);
                setTimeout(() => {
                  const winnerIndex = Math.floor(
                    Math.random() * fingers.length,
                  );
                  const winnerIdentifier = fingers[winnerIndex]?.identifier;
                  setWinner(winnerIdentifier);
                  setRandomInProgress(false);
                  setDisplayButton(true);
                  setResultFlashing(true);
                }, 100);
              }
            }, 150);
          }, (100 * duration) / 4);
        }
      }, (500 * duration) / 12);
      setTimeout(() => {
        clearInterval(interval1);
        setRandomInProgress(false);
      }, 1000 * duration);
    }, 3000);
  };

  useEffect(() => {
    setFill((timer * 100) / timeLimit);
    if (timer === timeLimit + 100) {
      startRandomSelection();
    }
  }, [timer, fingers]);

  const startTimer = () => {
    if (winner !== null) {
      return;
    }
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

  const eventToFingers = useCallback(
    (event: any) => {
      if (!gameOver) {
        const {
          nativeEvent: {touches},
        } = event;
        const coords: Finger[] = touches.map((touch: any) => ({
          identifier: touch.identifier,
          pageX: touch.pageX,
          pageY: touch.pageY,
        }));
        setFingers(coords);
        if (!playerJoined) {
          setPlayerJoined(true); // Set trạng thái khi người chơi tham gia
        }
      }
    },
    [gameOver, playerJoined],
  );

  /** Memoized PanResponder */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onPanResponderStart: event => {
          eventToFingers(event);
          // setGameStarted(true);
        },
        onPanResponderMove: event => {
          eventToFingers(event);
        },
        onPanResponderEnd: event => eventToFingers(event),
      }),
    [eventToFingers],
  );

  const restartGame = () => {
    setFingers([]);
    setTimer(0);
    setFill(0);
    setWinner(null);
    setRandomInProgress(false);
    setHighlightedIndex(null);
    setGameOver(false);
    setPlayerJoined(false);
    setDisplayButton(false);
    setResultFlashing(false);
  };

  const logo = require('../../assets/images/randomHandTouch.png');

  return (
    <View style={styles.Container}>
      <View
        style={[
          styles.GradientContainer,
          {backgroundColor: 'white'},
        ]}
        {...panResponder.panHandlers}>
        {!playerJoined && (
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
        )}
        {fingers.map(finger => {
          if (winner !== null && finger.identifier === winner) {
            return (
              <TouchElement
                key={finger.identifier}
                color={colors[finger.identifier]}
                top={finger.pageY}
                left={finger.pageX}
                fill={fill}
                resultDisplayed={true}
              />
            );
          } else {
            return (
              <TouchElement
                key={finger.identifier}
                color={colors[finger.identifier]}
                top={finger.pageY}
                left={finger.pageX}
                fill={fill}
                highlighted={
                  randomInProgress && finger.identifier === highlightedIndex
                }
                resultDisplayed={false}
              />
            );
          }
        })}
      </View>
      {/* {gameOver && (
        <View style={styles.ButtonView}>
          <ButtonRestart randomHandTouch={restartGame} />
        </View>
      )} */}
      {displayButton && (
        <TouchableOpacity
          style={styles.ButtonView}
          onPress={() => {
            restartGame();
          }}>
          <RestartIcon
            width={50}
            height={50}
            fill={'#305b69'}
            style={{marginBottom: 50, zIndex: 10}}
          />
        </TouchableOpacity>
      )}
    </View>
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: WIDTH(3),
    marginBottom: 18,
  },
  TittleBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 50, // Lề bên trái
    paddingRight: 20, // Lề bên phải
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredText: {
    textAlign: 'left',
    marginBottom: 20, // Khoảng cách giữa các dòng
    color: 'black',
  },
  centeredImage: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 80, // Lề bên trái
    paddingRight: 20,
    marginBottom: 20, // Khoảng cách giữa các dòng
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
