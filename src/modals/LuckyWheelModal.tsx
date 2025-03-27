import { View, Text, Modal, TouchableOpacity, Image, Animated, Easing, Vibration, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BackIcon from '../../assets/icons/BackIcon';
import EqualizerIcon from '../../assets/icons/EqualizerIcon';
import LuckyWheel from '../components/LuckyWheel';
import WheelCustomModal from './WheelCustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import colors from '../constants/colors';

interface LuckyWheelModalProps {
    LuckyWheelModalVisible: boolean;
    setLuckyWheelModalVisible: (visible: boolean) => void;
    luckyWheel: any;
    wheelIndex: number;
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const LuckyWheelModal = ({ LuckyWheelModalVisible, setLuckyWheelModalVisible, luckyWheel, wheelIndex }: LuckyWheelModalProps) => {
    const [segmentsCount, setSegmentsCount] = useState<number>(luckyWheel.segments.length);
    const [degreePerSegment, setDegreePerSegment] = useState<number>(360 / segmentsCount);

    const [tempWheel, setTempWheel] = useState<any>(luckyWheel);

    const [wheelCustomModalVisible, setWheelCustomModalVisible] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(3000);
    const [speed, setSpeed] = useState<number>(3);
    const [fontSize, setFontSize] = useState<number>(16);
    const [randomResult, setRandomResult] = useState<number>(Math.floor(Math.random() * segmentsCount) + 1);
    const [initDegree, setInitDegree] = useState<number>((randomResult * degreePerSegment - degreePerSegment / 2) / 360);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [removeSelected, setRemoveSelected] = useState<boolean>(false);
    const [showLottie, setShowLottie] = useState<boolean>(false);
    const [resultText, setResultText] = useState<string>('');
    const [showResult, setShowResult] = useState<boolean>(false);

    // Animation refs
    const animationProgress = useRef(new Animated.Value(0));
    const spinValue = useRef(new Animated.Value(0)).current;
    const resultOpacity = useRef(new Animated.Value(0)).current;
    const resultScale = useRef(new Animated.Value(0.5)).current;
    const wheelScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setInitDegree(0);
        // Tải cấu hình đã lưu
        loadSettings();
    }, [])
    
    useEffect(() => {
        if (showLottie) {
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
    }, [showLottie]);

    useEffect(() => {
        // Cập nhật degreePerSegment khi segmentsCount thay đổi
        setDegreePerSegment(360 / segmentsCount);
    }, [segmentsCount]);

    // Lưu cấu hình người dùng
    const saveSettings = async () => {
        try {
            const settings = {
                duration,
                speed,
                fontSize,
                removeSelected
            };
            await AsyncStorage.setItem('wheelSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    // Tải cấu hình người dùng
    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('wheelSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                setDuration(settings.duration || 3000);
                setSpeed(settings.speed || 3);
                setFontSize(settings.fontSize || 16);
                setRemoveSelected(settings.removeSelected || false);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const removeSelectedSegments = () => {
        if (tempWheel.segments.length > 2) {
            const newSegments = [...tempWheel.segments];
            const indexToRemove = randomResult === 0 ? newSegments.length - 1 : randomResult - 1;
            newSegments.splice(indexToRemove, 1);
            setTempWheel({
                ...tempWheel,
                segments: newSegments
            });
            setSegmentsCount(newSegments.length);
        }
    };

    const random = () => {
        setRandomResult(Math.floor(Math.random() * segmentsCount));
    };

    const saveToHistory = async () => {
        const result = randomResult === 0 
            ? tempWheel.segments[tempWheel.segments.length - 1].content 
            : tempWheel.segments[randomResult - 1].content;
            
        setResultText(result);
        
        const history = {
            wheelIndex: wheelIndex,
            name: luckyWheel.name,
            result: result,
            date: new Date().toISOString()
        };
        
        try {
            const savedHistory = await AsyncStorage.getItem('luckyWheelHistory');
            let historyArray = savedHistory ? JSON.parse(savedHistory) : [];
            historyArray = [history, ...historyArray];
            if (historyArray.length > 15) {
                historyArray = historyArray.slice(0, 15);
            }
            await AsyncStorage.setItem('luckyWheelHistory', JSON.stringify(historyArray));
        } catch (error) {
            console.error('Failed to save to history:', error);
        }
    };

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const spinWheel = () => {
        // Ẩn kết quả trước đó nếu có
        setShowResult(false);
        
        // Đặt lại các giá trị animation
        resultOpacity.setValue(0);
        resultScale.setValue(0.5);
        
        // Hiệu ứng thu nhỏ bánh xe trước khi quay
        Animated.sequence([
            Animated.timing(wheelScale, {
                toValue: 0.95,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(wheelScale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
        
        // Đặt lại giá trị quay
        spinValue.setValue(initDegree);
        
        // Tính toán số vòng quay dựa trên tốc độ
        const rotations = Math.floor(speed * 2);
        
        // Tạo hiệu ứng rung theo nhịp khi đang quay
        let vibrationInterval: NodeJS.Timeout | null = null;
        if (speed > 2) {
            vibrationInterval = setInterval(() => {
                Vibration.vibrate(5);
            }, 200);
        }
    
        // Animation quay với hiệu ứng easing tùy chỉnh
        Animated.timing(spinValue, {
            toValue: -((randomResult * degreePerSegment - degreePerSegment / 2) / 360 + rotations),
            duration: duration,
            easing: Easing.bezier(0.2, 0.1, 0.3, 1.0),
            useNativeDriver: true
        }).start();
    
        setInitDegree(-(randomResult * degreePerSegment - degreePerSegment / 2) / 360);
        saveToHistory();
        
        // Kết thúc quay
        setTimeout(() => {
            // Dừng rung
            if (vibrationInterval) clearInterval(vibrationInterval);
            
            // Tạo rung mạnh khi kết quả xuất hiện
            Vibration.vibrate([0, 100, 50, 100]);
            
            // Hiển thị kết quả với animation
            setShowResult(true);
            
            // Khởi động lại animation kết quả
            Animated.parallel([
                Animated.timing(resultOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(resultScale, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.elastic(1.2),
                    useNativeDriver: true
                })
            ]).start();
            
            setIsSpinning(false);
            
            // Đặt lại animation confetti
            animationProgress.current.setValue(0);
            setShowLottie(true);
            
            // Xử lý loại bỏ phân khúc nếu được chọn
            if (removeSelected) {
                setTimeout(() => removeSelectedSegments(), 1000);
            }
        }, duration);
    };

    const handleCustomModalClose = (newSettings: any) => {
        setWheelCustomModalVisible(false);
        if (newSettings) {
            setDuration(newSettings.duration);
            setSpeed(newSettings.speed);
            setFontSize(newSettings.fontSize);
            setRemoveSelected(newSettings.removeSelected);
            saveSettings();
        }
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent={false}
                visible={LuckyWheelModalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => {
                    setLuckyWheelModalVisible(!LuckyWheelModalVisible);
                }}
            >
                <View style={styles.container}>
                    {showLottie && (
                        <View pointerEvents='none' style={styles.lottieContainer}>
                            <AnimatedLottieView
                                source={require('../../assets/lotties/confetti.json')}
                                progress={animationProgress.current}
                                style={styles.lottieView}
                                resizeMode='cover'
                            />
                        </View>
                    )}

                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setLuckyWheelModalVisible(false);
                            }}
                        >
                            <BackIcon width={40} height={40}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelCustomModalVisible(true);
                            }}
                        >
                            <EqualizerIcon width={30} height={30} fill={colors.secondary}/>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.titleText}>
                            {luckyWheel.name}
                        </Text>
                    </View>
                    
                    {(
                        <Animated.View 
                            style={[
                                styles.resultContainer, 
                                { 
                                    opacity: showResult ? resultOpacity : 0,
                                    transform: [{ scale: resultScale }], 
                                    
                                }
                            ]}
                        >
                            <Text style={styles.resultText}>{resultText}</Text>
                        </Animated.View>
                    )}
                    
                    <View style={styles.wheelContainer}>
                        <Image
                            source={require('../../assets/images/selector.png')}
                            style={styles.selector}
                        />
                        <Animated.View 
                            style={[
                                styles.wheel,
                                { 
                                    transform: [
                                        { rotate }, 
                                        { scale: wheelScale }
                                    ] 
                                }
                            ]}
                        >
                            <LuckyWheel
                                segments={tempWheel.segments}
                                radius={170}
                                fontSize={fontSize}
                            />
                        </Animated.View>
                        <TouchableOpacity
                            style={styles.spinButton}
                            onPress={() => {
                                if (isSpinning) return;
                                Vibration.vibrate(50);
                                setIsSpinning(true);
                                setShowLottie(false);
                                random();
                                spinWheel();
                            }}
                            disabled={isSpinning}
                        />
                    </View>
                </View>
            </Modal>

            {wheelCustomModalVisible && (
                <WheelCustomModal
                    wheelCustomModalVisible={wheelCustomModalVisible}
                    setWheelCustomModalVisible={handleCustomModalClose}
                    duration={duration}
                    setDuration={setDuration}
                    speed={speed}
                    setSpeed={setSpeed}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    removeSelected={removeSelected}
                    setRemoveSelected={setRemoveSelected}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        height: '100%', 
        flexDirection: 'column', 
        backgroundColor: 'white', 
        alignItems: 'center', 
        marginTop: 20
    },
    lottieContainer: {
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        zIndex: 11, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    lottieView: {
        width: "100%", 
        height: "100%", 
        position: 'absolute', 
        zIndex: 11
    },
    header: {
        width: '100%', 
        height: '10%', 
        paddingHorizontal: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    backButton: {
        padding: 5,
    },
    settingsButton: {
        padding: 5,
    },
    titleContainer: {
        width: '80%', 
        height: '5%', 
        marginTop: 20, 
        backgroundColor: colors.primary, 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    titleText: {
        color: 'white', 
        fontSize: 20, 
        fontWeight: '600'
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: colors.secondary,
        borderRadius: 15,
        minWidth: '60%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    resultText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    wheelContainer: {
        marginTop: '10%', 
        zIndex: 10, 
        alignItems: 'center', 
        position: 'relative'
    },
    selector: {
        height: 50, 
        width: 50, 
        objectFit: 'contain', 
        zIndex: 10, 
        position: 'absolute', 
        top: -20
    },
    wheel: {
        // Styles for the wheel container
    },
    spinButton: {
        width: 63, 
        height: 63, 
        opacity: 0.1, 
        borderRadius: 100, 
        backgroundColor: 'black', 
        position: 'absolute', 
        top: '41%'
    },
});

export default LuckyWheelModal;
