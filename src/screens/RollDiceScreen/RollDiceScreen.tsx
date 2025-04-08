import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { View, Text, NativeModules, NativeEventEmitter, Animated, Easing, AppState, StyleSheet, Vibration } from 'react-native'
import LottieView from 'lottie-react-native';
import { LanguageContext } from '../../contexts/LanguageContext';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useIsFocused } from '@react-navigation/native';

const { NativeAccelerometer } = NativeModules;
const accelerometerEventEmitter = new NativeEventEmitter(NativeAccelerometer);

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const randomFrames: { [key: number]: number } = {
    5: 1,
    1: 13,
    4: 18,
    3: 28,
    2: 38,
    6: 48,
}

const RollDiceScreen = () => {
    const {t} = useContext(LanguageContext);
    const { theme } = useDarkMode();
    const [isDetecting, setIsDetecting] = useState<boolean>(true);
    const [randomResult, setRandomResult] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const isAnimatingRef = useRef<boolean>(false);

    const rollingDiceAnimationProgress = useRef(new Animated.Value(1/5));
    const diceScale = useRef(new Animated.Value(1)).current;
    const resultTextOpacity = useRef(new Animated.Value(0)).current;
    const resultTextScale = useRef(new Animated.Value(0.5)).current;

    const isFocused = useIsFocused();

    // Bắt đầu phát hiện lắc
    const startDetection = async () => {
        try {
            const result = await NativeAccelerometer.startDetection();
            console.log('Bắt đầu phát hiện lắc:', result);
            setIsDetecting(true);
        } catch (error) {
            console.error('Lỗi khi bắt đầu phát hiện:', error);
            crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
            setIsDetecting(false);
        }
    }

    // Dừng phát hiện lắc
    const stopDetection = async () => {
        try {
            if (isDetecting) {
                await NativeAccelerometer.stopDetection();
                console.log('Đã dừng phát hiện lắc');
                setIsDetecting(false);
            }
        } catch (error) {
            console.error('Lỗi khi dừng phát hiện:', error);
            crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
        }
    };

    // Khởi động lại phát hiện lắc
    const restartDetection = async () => {
        await stopDetection();
        await startDetection();
    }
    
    // Nếu ứng dụng chuyển sang nền hoặc không hoạt động, dừng phát hiện lắc
    // Nếu ứng dụng trở lại hoạt động, khởi động lại phát hiện lắc
    // useEffect(() => {
    //     const subscription = AppState.addEventListener('change', nextAppState => {
    //         if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
    //             console.log('App has come to the foreground!');
    //             restartDetection();
    //         } else if (nextAppState.match(/inactive|background/) && appStateRef.current === 'active') {
    //             console.log('App has gone to the background!');
    //             stopDetection();
    //         }
    //         appStateRef.current = nextAppState;
    //     });

    //     return () => {
    //         subscription.remove();
    //     };
    // }, [restartDetection, stopDetection]);

    useEffect(() => {
        if (isFocused) {
            restartDetection();
        } else {
            stopDetection();
        }
    }, [isFocused])

    const startRollingDice = useCallback(() => {
        if (isAnimatingRef.current) return; // Không chạy nếu đang có animation
        
        const newRandomResult = Math.floor(Math.random() * 6) + 1;
        
        rollingDiceAnimationProgress.current.setValue(0);
        isAnimatingRef.current = true;
        setRandomResult(newRandomResult);
        
        // Ẩn text kết quả khi bắt đầu quay
        resultTextOpacity.setValue(0);
        resultTextScale.setValue(0.5);
        
        Animated.parallel([
            Animated.sequence([
                Animated.timing(rollingDiceAnimationProgress.current, {
                    toValue: 0.3,
                    duration: 700,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(rollingDiceAnimationProgress.current, {
                    toValue: 0.7,
                    duration: 700,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(rollingDiceAnimationProgress.current, {
                    toValue: randomFrames[newRandomResult] / 50,
                    duration: 600,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                })
            ]),
            Animated.sequence([
                Animated.timing(diceScale, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(diceScale, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.bounce,
                    useNativeDriver: true,
                })
            ])
        ]).start(({ finished }) => {
            if (finished) {
                isAnimatingRef.current = false;
                setShowConfetti(true);
                setTimeout(() => {
                    Vibration.vibrate(500);
                }, 400);

                // Hiển thị text kết quả với animation
                Animated.parallel([
                    Animated.timing(resultTextOpacity, {
                        toValue: 1,
                        duration: 500,
                        delay: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(resultTextScale, {
                        toValue: 1.3,
                        duration: 500,
                        delay: 300,
                        easing: Easing.bounce,
                        useNativeDriver: true,
                    })
                ]).start();
            }
        });
    }, []);

    // Bắt đầu phát hiện lắc khi component được mount
    // Khi bắt đầu lắc, ẩn text kết quả và bắt đầu quay xúc xắc
    useEffect(() => {
        startDetection();

        const shakeStartSubscription = accelerometerEventEmitter.addListener(
            'shakeStart',
            () => {
                console.log('Bắt đầu lắc');
                
                // Ẩn text kết quả khi bắt đầu lắc
                Animated.parallel([
                    Animated.timing(resultTextOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,  
                    }),
                    Animated.timing(resultTextScale, {
                        toValue: 0.5,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start();
                
                if (!isAnimatingRef.current) {
                    startRollingDice();
                }
            }
        );

        return () => {
            shakeStartSubscription.remove();
            stopDetection();
        };
    }, []);

    const diceContainerStyle = {
        borderColor: theme.contrast_text_color,
        shadowColor: theme.text_color,
    }

    const diceAnimatedStyle = {
        transform: [
            { scale: diceScale },
            { rotate: rollingDiceAnimationProgress.current.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            })},
            { rotate: 
                randomResult === 1 ? '-4deg' : 
                randomResult === 2 ? '-4deg' : 
                randomResult === 3 ? '-22deg' : 
                randomResult === 4 ? '-40deg' : 
                randomResult === 5 ? '-7deg' : 
                randomResult === 6 ? '15deg' : '0deg'
            }
        ]
    };
    
    const resultTextStyle = {
        opacity: resultTextOpacity,
        transform: [{ scale: resultTextScale }],
        color: theme.contrast_text_color,
    };

    const containerStyle = {
        backgroundColor: theme.background_color,
    }

    const instructionTextStyle = {
        color: theme.contrast_text_color,
    };

    return (
        <>
            {showConfetti && (
                <LottieView
                    source={require('../../../assets/lotties/confetti.json')}
                    autoPlay
                    loop={false}
                    style={styles.confetti}
                    resizeMode='cover'
                    onAnimationFinish={() => setShowConfetti(false)}
                />
            )}
            <View style={[styles.container, containerStyle]}>
                <View style={{height: '20%'}}/>
                <Animated.View style={[styles.diceContainer, diceAnimatedStyle, diceContainerStyle]}>
                    <AnimatedLottieView
                        source={require('../../../assets/lotties/rollingDice.json')}
                        progress={rollingDiceAnimationProgress.current}
                        style={styles.diceAnimation}
                    />
                </Animated.View>
                
                {randomResult > 0 && (
                    <Animated.Text style={[styles.resultText, resultTextStyle]}>
                        {randomResult}
                    </Animated.Text>
                )}
                
                <Text style={[styles.instructionText, instructionTextStyle]}>
                    {t['Shake your phone to roll the dice']}
                </Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: '25%',
        alignItems: 'center',
    },
    confetti: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        zIndex: 11
    },
    diceContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    diceAnimation: {
        width: 500,
        height: 500,
    },
    resultText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 80,
        textAlign: 'center',
    },
    instructionText: {
        marginTop: 120,
        fontSize: 16,
        fontWeight: '500',
    }
});

export default RollDiceScreen;
