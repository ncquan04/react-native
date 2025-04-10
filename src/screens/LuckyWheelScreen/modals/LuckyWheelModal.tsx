import { View, Text, Modal, TouchableOpacity, Image, Animated, Easing, Vibration, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import EqualizerIcon from '../../../../assets/icons/EqualizerIcon';
import LuckyWheel from '../../../components/LuckyWheel';
import WheelCustomModal from './WheelCustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface LuckyWheelModalProps {
    LuckyWheelModalVisible: boolean;
    setLuckyWheelModalVisible: (visible: boolean) => void;
    luckyWheel: { id: number, name: string, segments: { content: string, color: string }[] };
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const LuckyWheelModal = ({ LuckyWheelModalVisible, setLuckyWheelModalVisible, luckyWheel }: LuckyWheelModalProps) => {
    const { theme } = useDarkMode();
    const settingsRef = useRef({
        duration: 3000,
        speed: 3,
        fontSize: 16,
        removeSelected: false
    })

    const wheelRef = useRef({ ...luckyWheel });
    const isSpinningRef = useRef(false);
    const randomResultRef = useRef(0);
    const initDegreeRef = useRef(0);

    // Animation refs
    const animationProgress = useRef(new Animated.Value(0));
    const spinValue = useRef(new Animated.Value(0)).current;
    const resultOpacity = useRef(new Animated.Value(0)).current;
    const resultScale = useRef(new Animated.Value(0.5)).current;
    const wheelScale = useRef(new Animated.Value(1)).current;

    const [segmentsCount, setSegmentsCount] = useState<number>(luckyWheel.segments.length);
    const [wheelCustomModalVisible, setWheelCustomModalVisible] = useState<boolean>(false);
    const [showLottie, setShowLottie] = useState<boolean>(false);
    const [resultText, setResultText] = useState<string>('');
    const [rerenderTrigger, setRerenderTrigger] = useState<number>(0);

    const degreePerSegment = useMemo(() => 360 / segmentsCount, [segmentsCount]);

    useEffect(() => {
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

    // Lưu cấu hình người dùng
    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('wheelSettings', JSON.stringify(settingsRef.current));
            console.log('Settings saved successfully!');
            console.log('Current settings:', settingsRef.current);
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
                settingsRef.current = {
                    duration: settings.duration || 3000,
                    speed: settings.speed || 3,
                    fontSize: settings.fontSize || 16,
                    removeSelected: settings.removeSelected || false
                };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    // Xóa phân khúc đã chọn
    const removeSelectedSegments = () => {
        if (wheelRef.current.segments.length > 2) {
            const newSegments = [...wheelRef.current.segments];
            const indexToRemove = randomResultRef.current === 0 ?
                newSegments.length - 1 : randomResultRef.current - 1;

            newSegments.splice(indexToRemove, 1);
            wheelRef.current = {
                ...wheelRef.current,
                segments: newSegments
            };
            setSegmentsCount(newSegments.length);
        }
    };

    // Tạo số ngẫu nhiên từ 0 đến segmentsCount - 1
    const random = () => {
        randomResultRef.current = Math.floor(Math.random() * segmentsCount);
    };

    // Lưu lịch sử quay
    const saveToHistory = async () => {
        const index = randomResultRef.current === 0 ?
            wheelRef.current.segments.length - 1 :
            randomResultRef.current - 1;

        const result = wheelRef.current.segments[index].content;
        setResultText(result);

        const history = {
            id: luckyWheel.id,
            name: luckyWheel.name,
            result: result,
            date: new Date().toISOString()
        };

        try {
            const savedHistory = await AsyncStorage.getItem('luckyWheelHistory');
            let historyArray = savedHistory ? JSON.parse(savedHistory) : [];
            historyArray = [history, ...historyArray].slice(0, 15);
            await AsyncStorage.setItem('luckyWheelHistory', JSON.stringify(historyArray));
        } catch (error) {
            console.error('Failed to save to history:', error);
        }
    };

    // Animation cho bánh xe quay
    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const spinWheel = useCallback(() => {
        // Ẩn kết quả trước đó nếu có
        setResultText('');

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
        spinValue.setValue(initDegreeRef.current);

        // Tính toán số vòng quay dựa trên tốc độ
        const rotations = Math.floor(settingsRef.current.speed * 2);

        // Tạo hiệu ứng rung theo nhịp khi đang quay
        let vibrationInterval: NodeJS.Timeout | null = null;
        if (settingsRef.current.speed > 2) {
            vibrationInterval = setInterval(() => {
                Vibration.vibrate(5);
            }, 200);
        }

        // Tính toán góc xoay mới
        const newAngle = -((randomResultRef.current * degreePerSegment - degreePerSegment / 2) / 360 + rotations);

        // Animation quay với hiệu ứng easing tùy chỉnh
        Animated.timing(spinValue, {
            toValue: newAngle,
            duration: settingsRef.current.duration,
            easing: Easing.bezier(0.2, 0.1, 0.3, 1.0),
            useNativeDriver: true
        }).start();

        initDegreeRef.current = -(randomResultRef.current * degreePerSegment - degreePerSegment / 2) / 360;
        saveToHistory();

        // Kết thúc quay
        setTimeout(() => {
            // Dừng rung
            if (vibrationInterval) clearInterval(vibrationInterval);

            // Tạo rung mạnh khi kết quả xuất hiện
            Vibration.vibrate([0, 100, 50, 100]);

            // Hiển thị kết quả với animation

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

            isSpinningRef.current = false;

            // Đặt lại animation confetti
            animationProgress.current.setValue(0);
            setShowLottie(true);

            // Xử lý loại bỏ phân khúc nếu được chọn
            if (settingsRef.current.removeSelected) {
                setTimeout(() => removeSelectedSegments(), 1000);
            }
        }, settingsRef.current.duration);
    }, [degreePerSegment]);

    return (
        <>
            <Modal
                animationType="fade"
                transparent={false}
                visible={LuckyWheelModalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => {
                    setLuckyWheelModalVisible(false);
                }}
            >
                <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: theme.background_color, alignItems: 'center', paddingTop: 20 }}>
                    {showLottie && (
                        <View 
                            pointerEvents='none' 
                            style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 11, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <AnimatedLottieView
                                source={require('../../../../assets/lotties/confetti.json')}
                                progress={animationProgress.current}
                                style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
                                resizeMode='cover'
                            />
                        </View>
                    )}

                    <View style={{ width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setLuckyWheelModalVisible(false);
                            }}
                        >
                            <BackIcon width={40} height={40} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelCustomModalVisible(true);
                            }}
                        >
                            <EqualizerIcon width={30} height={30} fill={theme.secondary_color} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '80%', height: '5%', marginTop: 40, backgroundColor: theme.primary_color, borderRadius: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: theme.text_color, fontSize: 20, fontWeight: '600' }}>
                            {luckyWheel.name}
                        </Text>
                    </View>

                    {(
                        <Animated.View
                            style={[{ marginTop: 20, padding: 15, backgroundColor: theme.secondary_color, borderRadius: 15, minWidth: '60%', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4 },{ opacity: resultOpacity, transform: [{ scale: resultScale }] }]}
                        >
                            <Text style={{ color: theme.text_color, fontSize: 18, fontWeight: '600', textAlign: 'center' }}>{resultText}</Text>
                        </Animated.View>
                    )}

                    <View style={{ marginTop: '10%', zIndex: 10, alignItems: 'center', position: 'relative' }}>
                        <Image
                            source={require('../../../../assets/images/selector.png')}
                            style={{ height: 50, width: 50, objectFit: 'contain', zIndex: 10, position: 'absolute', top: -20 }}
                        />
                        <Animated.View
                            style={{transform: [{ rotate },{ scale: wheelScale }]}}
                        >
                            <LuckyWheel
                                segments={wheelRef.current.segments}
                                radius={170}
                                fontSize={settingsRef.current.fontSize}
                            />
                        </Animated.View>
                        <TouchableOpacity
                            style={{ width: 63, height: 63, opacity: 0.1, borderRadius: 100, backgroundColor: theme.text_color, position: 'absolute', top: '41%' }}
                            onPress={() => {
                                if (isSpinningRef.current) return;
                                Vibration.vibrate(50);
                                isSpinningRef.current = true;
                                setShowLottie(false);
                                random();
                                spinWheel();
                            }}
                            disabled={isSpinningRef.current}
                        />
                    </View>
                </View>
            </Modal>

            {wheelCustomModalVisible && (
                <WheelCustomModal
                    wheelCustomModalVisible={wheelCustomModalVisible}
                    setWheelCustomModalVisible={(visible) => {
                        if (!visible) {
                            // Save settings when modal is closed
                            saveSettings();
                        }
                        setWheelCustomModalVisible(visible);
                    }}
                    duration={settingsRef.current.duration}
                    setDuration={(val) => settingsRef.current.duration = val}
                    speed={settingsRef.current.speed}
                    setSpeed={(val) => settingsRef.current.speed = val}
                    fontSize={settingsRef.current.fontSize}
                    setFontSize={(val) => settingsRef.current.fontSize = val}
                    removeSelected={settingsRef.current.removeSelected}
                    setRemoveSelected={(val) => settingsRef.current.removeSelected = val}
                    rerenderTrigger={rerenderTrigger}
                    setRerenderTrigger={setRerenderTrigger}
                />
            )}
        </>
    );
};

export default LuckyWheelModal;
