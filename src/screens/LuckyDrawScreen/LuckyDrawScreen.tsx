import { View, Text, Image, PanResponder, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import TouchElement from '../../components/TouchElement';
import LottieView from 'lottie-react-native';
import RestartIcon from '../../../assets/icons/RestartIcon';
import colors from '../../constants/colors';

interface Finger {
    identifier: number;
    x: Animated.Value;
    y: Animated.Value;
}

const COLORS: string[] = [
    '#d55e5e', '#94d361', '#c673cf', '#9da74f', '#dbaa61', '#686ac8', '#795479', '#ffff00', '#da5f83',
];

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const LuckyDrawScreen = () => {
    const { t } = useContext(LanguageContext);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [joiningGame, setJoiningGame] = useState<boolean>(true);
    const [playerJoined, setPlayerJoined] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [fingerCount, setFingerCount] = useState<number>(0); // Theo dõi số ngón tay
    const animationProgress = useRef(new Animated.Value(0));

    const fingersRef = useRef<Finger[]>([]);
    const timerRef = useRef<Animated.Value>(new Animated.Value(0));

    useEffect(() => {
        if (gameOver) {
            animationProgress.current.setValue(0);
            Animated.loop(
                Animated.timing(animationProgress.current, {
                    toValue: 1,
                    duration: 5000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                { iterations: 3 }
            ).start();
        }
    }, [gameOver]);

    //Begin timer handling
    const startTimer = useCallback(() => {
        timerRef.current.stopAnimation();
        timerRef.current.setValue(0);
        Animated.timing(timerRef.current, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start(({finished}) => {
            if (finished)
                startRandom();
        });
    }, [])

    const stopTimer = useCallback(() => {
        timerRef.current.setValue(0);
    }, [])

    useEffect(() => {
        if (fingersRef.current.length >= 2) {
            startTimer();
        } else {
            stopTimer();
        }
    }, [fingersRef.current.length])

    // useEffect(() => {
    //     if (timer >= 3000) {
    //         startRandom();
    //     }
    // }, [timer])
    //End timer handling

    //Begin touch handling
    const handleTouchEvents = useCallback((e: any) => {
        if (joiningGame) {
            const newFingers = e.nativeEvent.touches.map((touch: any) => {
                let existingFinger = fingersRef.current.find(f => f.identifier === touch.identifier);
                if (!existingFinger) {
                    existingFinger = {
                        identifier: touch.identifier,
                        x: new Animated.Value(touch.pageX),
                        y: new Animated.Value(touch.pageY),
                    };
                    fingersRef.current.push(existingFinger);
                } else {
                    existingFinger.x.setValue(touch.pageX);
                    existingFinger.y.setValue(touch.pageY);
                }
                return existingFinger;
            });

            if (newFingers.length !== fingerCount) {
                setFingerCount(newFingers.length);
                startTimer();
            }
            fingersRef.current = newFingers;
            if (!playerJoined) {
                setPlayerJoined(true);
            }
        }
    }, [joiningGame, playerJoined, fingerCount, startTimer]);

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderStart: handleTouchEvents,
        onPanResponderMove: handleTouchEvents,
        onPanResponderRelease: handleTouchEvents,
    }), [handleTouchEvents]);
    //End touch handling

    //Begin game logic
    const startRandom = () => {
        stopTimer();
        setJoiningGame(false);

        let interval = setInterval(() => {
            setHighlightedIndex(Math.floor(Math.random() * fingersRef.current.length));
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setGameOver(true);
        }, 3000);
    };

    const restartGame = () => {
        fingersRef.current = [];
        setGameOver(false);
        setJoiningGame(true);
        setPlayerJoined(false);
        setHighlightedIndex(null);
        setFingerCount(0);
        animationProgress.current.setValue(0);
    };
    //End game logic

    return (
        <View 
            style={{ flex: 1, backgroundColor: 'white'}} 
            {...panResponder.panHandlers}
        >
            {gameOver && (
                <View
                    pointerEvents='none'
                    style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 11, justifyContent: 'center', alignItems: 'center' }}
                >
                    <AnimatedLottieView
                        source={require('../../../assets/lotties/confetti.json')}
                        progress={animationProgress.current}
                        style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
                        resizeMode='cover'
                    />
                </View>
            )}
            
            {/* Main */}
            {playerJoined && fingersRef.current.map((finger, index) => (
                <TouchElement 
                    key={finger.identifier} 
                    color={COLORS[index % COLORS.length]} 
                    fill={!gameOver && joiningGame ? timerRef.current : 100} 
                    highlighted={!gameOver && highlightedIndex === index} 
                    resultDisplayed={gameOver && highlightedIndex === index} 
                    x={finger.x} y={finger.y} 
                />
            ))}

            {/* Instructions */}
            {!playerJoined &&
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{ width: '80%', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 14, fontWeight: 400 }}>
                            {t['1. Everyone (2 - 10 people) HOLD one finger on the screen']}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 20 }}>
                            {t['2. Wait 3 seconds then remove your finger from the screen']}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 20 }}>
                            {t['3. The winner will be highlighted on the screen']}
                        </Text>
                        <View style={{ width: 100, height: 100, marginTop: 20, alignSelf: 'center' }}>
                            <Image source={require('../../../assets/images/randomHandTouch.png')} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
                        </View>
                    </View>
                </View>}

            {gameOver && (
                <TouchableOpacity style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }} onPress={restartGame}>
                    <RestartIcon width={40} height={40} fill={colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default LuckyDrawScreen;
