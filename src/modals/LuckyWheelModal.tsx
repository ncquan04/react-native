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
    const [wheelCustomModalVisible, setWheelCustomModalVisible] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(3000);
    const [speed, setSpeed] = useState<number>(3);
    const [fontSize, setFontSize] = useState<number>(16);

    const spinValue = useRef(new Animated.Value(0)).current;

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const spinWheel = () => {
        spinValue.setValue(0);

        Animated.timing(spinValue, {
            toValue: 3,
            duration: 3000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
        }).start();
    }

    return (
        <>
            <Modal
            animationType="none"
            transparent={true}
            visible={LuckyWheelModalVisible}
            onRequestClose={() => {
                setLuckyWheelModalVisible(!LuckyWheelModalVisible);
            }}
            >
                <View style={{width: '100%', height: '100%', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center'}}>
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
                            />
                        </Animated.View>
                        <TouchableOpacity
                            style={{width: 50, height: 50, opacity: 0.1, backgroundColor: 'blue', position: 'absolute', top: '43%'}}
                            onPress={spinWheel}
                        />
                    </View>
                </View>
            </Modal>

            <WheelCustomModal
                wheelCustomModalVisible={wheelCustomModalVisible}
                setWheelCustomModalVisible={setWheelCustomModalVisible}
                duration={duration}
                setDuration={setDuration}
                speed={speed}
                setSpeed={setSpeed}
                fontSize={fontSize}
                setFontSize={setFontSize}
            />
        </>
    )
}

export default LuckyWheelModal