import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import XIcon from '../../../../assets/icons/XIcon';
import Slider from '@react-native-community/slider';
import { REMOTE_KEY, useGetRemoteConfig } from '../../../remoteConfig/RemoteConfig';
import colors from '../../../constants/colors';

interface WheelDurationModalProps {
    wheelDurationModalVisible: boolean;
    setWheelDurationModalVisible: (visible: boolean) => void;
    duration: number;
    setDuration: (Duration: number) => void;
    t: any;
    rerenderTrigger: number;
    setRerenderTrigger: (value: number) => void;
}

const WheelDurationModal = ({ wheelDurationModalVisible, setWheelDurationModalVisible, duration, setDuration, t, rerenderTrigger, setRerenderTrigger}: WheelDurationModalProps) => {
    const [tempDuration, setTempDuration] = useState<number>(duration/1000);
    
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={wheelDurationModalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setWheelDurationModalVisible(!wheelDurationModalVisible)
            }}
        >
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <TouchableWithoutFeedback
                    onPress={() => setWheelDurationModalVisible(false)}
                >
                    <View style={{flex: 0.7, backgroundColor: 'rgba(0,0,0,0)'}}/>
                </TouchableWithoutFeedback>
                <View style={{flex: 0.3, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background_color, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 30, paddingTop: 10}}>
                    <View style={{width: '100%', height: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{marginLeft: 20}}/>
                        <Text style={{fontSize: 30, fontWeight: 600, color: colors.text_color}}>{t['Duration']}</Text>
                        <TouchableOpacity
                            style={{marginRight: 20}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelDurationModalVisible(false);
                            }}
                        >
                            <XIcon width={15} height={15} fill={colors.text_color} onPress={() => {
                                Vibration.vibrate(50);
                                setWheelDurationModalVisible(false);
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 25, fontWeight: 500, alignSelf: 'center', color: colors.text_color}}>
                        {tempDuration}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 20, fontWeight: 500, color: colors.text_color}}>1</Text>
                        <Slider
                            style={{width: '60%', height: 40, alignSelf: 'center'}}
                            step={1}
                            minimumValue={1}
                            maximumValue={20}
                            minimumTrackTintColor={useGetRemoteConfig(REMOTE_KEY.secondary_color)}
                            maximumTrackTintColor={colors.text_color}
                            thumbTintColor={useGetRemoteConfig(REMOTE_KEY.secondary_color)}
                            value={duration / 1000}
                            onValueChange={value => setTempDuration(value)}
                        />
                        <Text style={{fontSize: 20, fontWeight: 500, color: colors.text_color}}>20</Text>
                    </View>
                    <TouchableOpacity 
                        style={{alignSelf: 'flex-end', marginRight: 40}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setDuration(tempDuration * 1000);
                            setRerenderTrigger(rerenderTrigger + 1);
                            setWheelDurationModalVisible(false);
                        }}
                    >
                        <Text style={{fontSize: 20, fontWeight: 500, color: useGetRemoteConfig(REMOTE_KEY.secondary_color)}}>{t['Apply']}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default WheelDurationModal