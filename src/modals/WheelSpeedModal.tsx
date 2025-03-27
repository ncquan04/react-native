import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import XIcon from '../../assets/icons/XIcon';
import Slider from '@react-native-community/slider';
import colors from '../constants/colors';

interface WheelSpeedModalProps {
    wheelSpeedModalVisible: boolean;
    setWheelSpeedModalVisible: (visible: boolean) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    t: any;
}

const WheelSpeedModal = ({ wheelSpeedModalVisible, setWheelSpeedModalVisible, speed, setSpeed, t}: WheelSpeedModalProps) => {
    const [tempSpeed, setTempSpeed] = useState<number>(speed);

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={wheelSpeedModalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setWheelSpeedModalVisible(!wheelSpeedModalVisible)
            }}
        >
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <TouchableWithoutFeedback
                    onPress={() => setWheelSpeedModalVisible(false)}
                >
                    <View style={{flex: 0.7, backgroundColor: 'rgba(0,0,0,0)'}}/>
                </TouchableWithoutFeedback>
                <View style={{flex: 0.3, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 30, paddingTop: 10}}>
                    <View style={{width: '100%', height: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '38%'}}>
                        <Text style={{fontSize: 30, fontWeight: 600}}>{t['Speed']}</Text>
                        <TouchableOpacity
                            style={{marginRight: 20}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelSpeedModalVisible(false);
                            }}
                        >
                            <XIcon width={15} height={15} fill={'black'} onPress={() => {
                                Vibration.vibrate(50);
                                setWheelSpeedModalVisible(false);
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 20, fontWeight: 500, alignSelf: 'center'}}>
                        {tempSpeed === 1 ? t['Slow'] : tempSpeed === 3 ? t['Normal'] : t['Fast']}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 15, fontWeight: 500}}>{t['Slow']}</Text>
                        <Slider
                            style={{width: '60%', height: 40, alignSelf: 'center'}}
                            step={2}
                            minimumValue={1}
                            maximumValue={5}
                            minimumTrackTintColor={colors.secondary}
                            maximumTrackTintColor="#000000"
                            thumbTintColor={colors.secondary}
                            value={speed}
                            onValueChange={value => setTempSpeed(value)}
                        />
                        <Text style={{fontSize: 15, fontWeight: 500}}>{t['Fast']}</Text>
                    </View>
                    <TouchableOpacity 
                        style={{alignSelf: 'flex-end', marginRight: 40}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setSpeed(tempSpeed);
                            setWheelSpeedModalVisible(false);
                        }}
                    >
                        <Text style={{fontSize: 20, fontWeight: 500, color: colors.secondary}}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default WheelSpeedModal