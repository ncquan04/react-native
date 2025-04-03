import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import XIcon from '../../../../assets/icons/XIcon';
import Slider from '@react-native-community/slider';
import { REMOTE_KEY, useGetRemoteConfig } from '../../../remoteConfig/RemoteConfig';
import colors from '../../../constants/colors';

interface WheelSpeedModalProps {
    wheelSpeedModalVisible: boolean;
    setWheelSpeedModalVisible: (visible: boolean) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    t: any;
    rerenderTrigger: number;
    setRerenderTrigger: (value: number) => void;
}

const WheelSpeedModal = ({ wheelSpeedModalVisible, setWheelSpeedModalVisible, speed, setSpeed, t, rerenderTrigger, setRerenderTrigger}: WheelSpeedModalProps) => {
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
                <View style={{flex: 0.3, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background_color, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 30, paddingTop: 10}}>
                    <View style={{width: '100%', height: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '38%'}}>
                        <Text style={{fontSize: 30, fontWeight: 600, color: colors.text_color}}>{t['Speed']}</Text>
                        <TouchableOpacity
                            style={{marginRight: 20}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelSpeedModalVisible(false);
                            }}
                        >
                            <XIcon width={15} height={15} fill={colors.text_color} onPress={() => {
                                Vibration.vibrate(50);
                                setWheelSpeedModalVisible(false);
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 20, fontWeight: 500, alignSelf: 'center', color: colors.text_color}}>
                        {tempSpeed === 1 ? t['Slow'] : tempSpeed === 3 ? t['Normal'] : t['Fast']}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 15, fontWeight: 500, color: colors.text_color}}>{t['Slow']}</Text>
                        <Slider
                            style={{width: '60%', height: 40, alignSelf: 'center'}}
                            step={2}
                            minimumValue={1}
                            maximumValue={5}
                            minimumTrackTintColor={useGetRemoteConfig(REMOTE_KEY.secondary_color)}
                            maximumTrackTintColor={colors.text_color}
                            thumbTintColor={useGetRemoteConfig(REMOTE_KEY.secondary_color)}
                            value={speed}
                            onValueChange={value => setTempSpeed(value)}
                        />
                        <Text style={{fontSize: 15, fontWeight: 500, color: colors.text_color}}>{t['Fast']}</Text>
                    </View>
                    <TouchableOpacity 
                        style={{alignSelf: 'flex-end', marginRight: 40}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setSpeed(tempSpeed);
                            setRerenderTrigger(rerenderTrigger + 1);
                            setWheelSpeedModalVisible(false);
                        }}
                    >
                        <Text style={{fontSize: 20, fontWeight: 500, color: useGetRemoteConfig(REMOTE_KEY.secondary_color)}}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default WheelSpeedModal