import { View, Text, NativeModules, NativeEventEmitter, Button, StyleSheet, Animated, Easing } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native';
import { LanguageContext } from '../contexts/LanguageContext';

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
    const [isShaking, setIsShaking] = useState<boolean>(false);
    const [isDetecting, setIsDetecting] = useState<boolean>(true);
    const [randomResult, setRandomResult] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const {t} = useContext(LanguageContext);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const rollingDiceAnimationProgress = useRef(new Animated.Value(1/5));
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);
    const isAnimatingRef = useRef<boolean>(false);

    const startDetection = async () => {
        try {
            const result = await NativeAccelerometer.startDetection();
            console.log(result);
            setIsDetecting(true);
        } catch (error) {
            console.error('Lỗi khi bắt đầu phát hiện:', error);
        }
    };

    useEffect(() => {
        startDetection();

        // Đăng ký lắng nghe sự kiện
        const shakeStartSubscription = accelerometerEventEmitter.addListener(
            'shakeStart',
            () => {
                console.log('Bắt đầu lắc');
                setIsShaking(true);                
                // Xóa timeout trước đó nếu có
                if (animationTimeoutRef.current) {
                    clearTimeout(animationTimeoutRef.current);
                    animationTimeoutRef.current = null;
                }
                
                // Chỉ bắt đầu animation mới nếu không có animation đang chạy
                if (!isAnimatingRef.current) {
                    startRollingDice();
                }
            }
        );

        const shakeEndSubscription = accelerometerEventEmitter.addListener(
            'shakeEnd',
            () => {
                console.log('Kết thúc lắc');
                
                // Đặt timeout để dừng animation sau 2.5s nếu không có lắc mới
                animationTimeoutRef.current = setTimeout(() => {
                    setIsShaking(false);
                    // Dừng animation sau timeout
                    if (animationRef.current) {
                        animationRef.current.stop();
                    }
                    isAnimatingRef.current = false;
                }, 1500);
            }
        );

        // Hủy đăng ký khi component unmount
        // return () => {
        //     shakeStartSubscription.remove();
        //     shakeEndSubscription.remove();
        //     if (isDetecting) {
        //         NativeAccelerometer.stopDetection();
        //     }
        //     if (animationTimeoutRef.current) {
        //         clearTimeout(animationTimeoutRef.current);
        //     }
        // };
    }, []);

    const startRollingDice = () => {
        // Dừng animation hiện tại nếu có
        if (animationRef.current) {
            animationRef.current.stop();
        }
        
        const newRandomResult = Math.floor(Math.random() * 6) + 1;
        setRandomResult(newRandomResult);
        
        rollingDiceAnimationProgress.current.setValue(0);
        isAnimatingRef.current = true;
        
        animationRef.current = Animated.sequence([
            Animated.timing(rollingDiceAnimationProgress.current, {
                toValue: 0.3,
                duration: 700,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(rollingDiceAnimationProgress.current, {
                toValue: 0.7,
                duration: 700,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(rollingDiceAnimationProgress.current, {
                toValue: randomFrames[newRandomResult] / 50,
                duration: 600,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: false,
            })
        ]);
        
        animationRef.current.start(({ finished }) => {
            if (finished && isShaking) {
                startRollingDice();
            } else if (finished) {
                isAnimatingRef.current = false;
                setIsShaking(false);
                setShowConfetti(true);
            }
        });
    }

    return (
        <>
            {showConfetti && (
                <LottieView
                    source={require('../../assets/lotties/confetti.json')}
                    autoPlay
                    loop={false}
                    style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
                    resizeMode='cover'
                    onAnimationFinish={() => setShowConfetti(false)}
                />
            )}

            <View style={{
                flex: 1, 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'white',
            }}>
                <Animated.View style={{
                    backgroundColor: 'white',
                    borderRadius: 30,
                    width: 200,
                    height: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: 'black',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                    transform: [{ rotate: rollingDiceAnimationProgress.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                    })}, {
                        rotate: 
                            randomResult === 1 ? '-4deg' : 
                            randomResult === 2 ? '-4deg' : 
                            randomResult === 3 ? '-22deg' : 
                            randomResult === 4 ? '-40deg' : 
                            randomResult === 5 ? '-7deg' : 
                            randomResult === 6 ? '15deg' : '0deg'
                    }]
                }}>
                    <AnimatedLottieView
                        source={require('../../assets/lotties/rollingDice.json')}
                        progress={rollingDiceAnimationProgress.current}
                        style={{ 
                            width: 500, 
                            height: 500,
                        }}
                    />
                </Animated.View>
                
                <Text style={{
                    marginTop: 200,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '500'
                }}>
                    {t['Shake your phone to roll the dice']}
                </Text>
            </View>
        </>
    );
};

export default RollDiceScreen
