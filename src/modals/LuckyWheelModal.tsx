import { View, Text, Modal, TouchableOpacity, Image, Animated, Easing } from 'react-native'
import React, { useRef, useState } from 'react'
import BackIcon from '../../assets/icons/BackIcon';
import EqualizerIcon from '../../assets/icons/EqualizerIcon';
import LuckyWheel from '../components/LuckyWheel';
import WheelCustomModal from './WheelCustomModal';

interface LuckyWheelModalProps {
    LuckyWheelModalVisible: boolean;
    setLuckyWheelModalVisible: (visible: boolean) => void;
    luckyWheel: any;
}

const LuckyWheelModal = ({ LuckyWheelModalVisible, setLuckyWheelModalVisible, luckyWheel }: LuckyWheelModalProps) => {
    const segmentsCount = luckyWheel.segments.length;
    const degreePerSegment = 360 / segmentsCount;

    const [wheelCustomModalVisible, setWheelCustomModalVisible] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(3000);
    const [speed, setSpeed] = useState<number>(3);
    const [fontSize, setFontSize] = useState<number>(16);
    const [randomResult, setRandomResult] = useState<number>(0);
    const [initDegree, setInitDegree] = useState<number>((randomResult * degreePerSegment - degreePerSegment / 2) / 360);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [removeSelected, setRemoveSelected] = useState<boolean>(false);

    const random = () => {
        setRandomResult(Math.floor(Math.random() * segmentsCount));
    }

    const spinValue = useRef(new Animated.Value(0)).current;

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const spinWheel = () => {
        spinValue.setValue(initDegree);

        Animated.timing(spinValue, {
            toValue: (randomResult * degreePerSegment - degreePerSegment / 2) / 360 + Math.floor(speed * duration / 3000),
            duration: duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
        }).start();

        setInitDegree((randomResult * degreePerSegment - degreePerSegment / 2) / 360);
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
                    <View style={{width: '80%', height: '5%', marginTop: 20, backgroundColor: '#305b69', borderRadius: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{color: 'white', fontSize: 20, fontWeight: 600}}>{luckyWheel.name}</Text>
                    </View>
                    <View style={{marginTop: '20%', zIndex: 10, alignItems: 'center', position: 'relative'}}>
                        <Image
                            source={require('../../assets/images/selector.png')}
                            style={{height: 50, width: 50, objectFit: 'contain', zIndex: 10, position: 'absolute', top: -20}}
                        />
                        <Animated.View style={{transform: [{ rotate }]}}>
                            <LuckyWheel
                                segments={luckyWheel.segments}
                                radius={170}
                                fontSize={fontSize}
                            />
                        </Animated.View>
                        <TouchableOpacity
                            style={{width: 63, height: 63, opacity: 0.1, borderRadius: 100, backgroundColor: 'black', position: 'absolute', top: '41%'}}
                            onPress={() => {
                                if (isSpinning) return;
                                setIsSpinning(true);
                                random();
                                spinWheel();
                                setTimeout(() => {
                                    setIsSpinning(false);
                                }, duration);
                            }}
                            disabled={isSpinning}
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