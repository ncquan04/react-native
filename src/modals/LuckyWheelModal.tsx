import { View, Text, Modal, TouchableOpacity, Image, Animated, Easing } from 'react-native'
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
    const [randomResult, setRandomResult] = useState<number>(0);
    const [initDegree, setInitDegree] = useState<number>((randomResult * degreePerSegment - degreePerSegment / 2) / 360);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [removeSelected, setRemoveSelected] = useState<boolean>(false);
    const [showLottie, setShowLottie] = useState<boolean>(false);

    useEffect(() => {
        setInitDegree(0);
    }, [])
    
    const animationProgress = useRef(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.timing(animationProgress.current, {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            { iterations: 3 }
        ).start();
    }, [showLottie])

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
            setDegreePerSegment(360 / newSegments.length);
        }
    };

    const random = () => {
        setRandomResult(Math.floor(Math.random() * segmentsCount));
    }

    const saveToHistory = async () => {
        const history = {
            wheelIndex: wheelIndex,
            name: luckyWheel.name,
            result: randomResult === 0 ? tempWheel.segments[tempWheel.segments.length - 1].content : tempWheel.segments[randomResult - 1].content,
            date: new Date().toISOString()
        }
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
    }

    const spinValue = useRef(new Animated.Value(0)).current;

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const spinWheel = () => {
        spinValue.setValue(initDegree);

        Animated.timing(spinValue, {
            toValue: -((randomResult * degreePerSegment - degreePerSegment / 2) / 360 + Math.floor(speed * duration / 3000)),
            duration: duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
        }).start();

        setInitDegree(- (randomResult * degreePerSegment - degreePerSegment / 2) / 360);

        saveToHistory();
    }

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

                <View style={{width: '100%', height: '100%', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center', marginTop: 20}}>
                    {showLottie && <View pointerEvents='none' style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 11, justifyContent: 'center', alignItems: 'center'}}>
                        <AnimatedLottieView
                            source={require('../../assets/lotties/confetti.json')}
                            progress={animationProgress.current}
                            style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 11 }}
                            resizeMode='cover'
                        />
                    </View>}

                    <View 
                        style={{width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', 
                        justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <TouchableOpacity onPress={() => setLuckyWheelModalVisible(false)}>
                            <BackIcon width={40} height={40}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setWheelCustomModalVisible(true)}
                        >
                            <EqualizerIcon width={30} height={30} fill={'#f2ae41'}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '80%', height: '5%', marginTop: 20, backgroundColor: colors.primary, borderRadius: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{color: 'white', fontSize: 20, fontWeight: 600}}>{luckyWheel.name}</Text>
                    </View>
                    <View style={{marginTop: '20%', zIndex: 10, alignItems: 'center', position: 'relative'}}>
                        <Image
                            source={require('../../assets/images/selector.png')}
                            style={{height: 50, width: 50, objectFit: 'contain', zIndex: 10, position: 'absolute', top: -20}}
                        />
                        <Animated.View style={{transform: [{ rotate }]}}>
                            <LuckyWheel
                                segments={tempWheel.segments}
                                radius={170}
                                fontSize={fontSize}
                            />
                        </Animated.View>
                        <TouchableOpacity
                            style={{width: 63, height: 63, opacity: 0.1, borderRadius: 100, backgroundColor: 'black', position: 'absolute', top: '41%'}}
                            onPress={() => {
                                if (isSpinning) return;
                                setIsSpinning(true);
                                setShowLottie(false);
                                random();
                                spinWheel();
                                setTimeout(() => {
                                    setIsSpinning(false);
                                    setShowLottie(true);
                                    if (removeSelected) {
                                        removeSelectedSegments();
                                    }
                                }, duration);
                            }}
                        />
                    </View>
                </View>
            </Modal>

            {wheelCustomModalVisible && <WheelCustomModal
                wheelCustomModalVisible={wheelCustomModalVisible}
                setWheelCustomModalVisible={setWheelCustomModalVisible}
                duration={duration}
                setDuration={setDuration}
                speed={speed}
                setSpeed={setSpeed}
                fontSize={fontSize}
                setFontSize={setFontSize}
                removeSelected={removeSelected}
                setRemoveSelected={setRemoveSelected}
            />}
        </>
    )
}

export default LuckyWheelModal