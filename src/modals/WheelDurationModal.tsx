import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import XIcon from '../../assets/icons/XIcon';
import Slider from '@react-native-community/slider';
import colors from '../constants/colors';

interface WheelDurationModalProps {
    wheelDurationModalVisible: boolean;
    setWheelDurationModalVisible: (visible: boolean) => void;
    duration: number;
    setDuration: (Duration: number) => void;
    t: any;
}

const WheelDurationModal = ({ wheelDurationModalVisible, setWheelDurationModalVisible, duration, setDuration, t}: WheelDurationModalProps) => {
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
                <View style={{flex: 0.3, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 30, paddingTop: 10}}>
                    <View style={{width: '100%', height: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{marginLeft: 20}}/>
                        <Text style={{fontSize: 30, fontWeight: 600}}>{t['Duration']}</Text>
                        <TouchableOpacity
                            style={{marginRight: 20}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelDurationModalVisible(false);
                            }}
                        >
                            <XIcon width={15} height={15} fill={'black'} onPress={() => {
                                Vibration.vibrate(50);
                                setWheelDurationModalVisible(false);
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 25, fontWeight: 500, alignSelf: 'center'}}>
                        {tempDuration}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 20, fontWeight: 500}}>1</Text>
                        <Slider
                            style={{width: '60%', height: 40, alignSelf: 'center'}}
                            step={1}
                            minimumValue={1}
                            maximumValue={20}
                            minimumTrackTintColor={colors.secondary}
                            maximumTrackTintColor="#000000"
                            thumbTintColor={colors.secondary}
                            value={duration / 1000}
                            onValueChange={value => setTempDuration(value)}
                        />
                        <Text style={{fontSize: 20, fontWeight: 500}}>20</Text>
                    </View>
                    <TouchableOpacity 
                        style={{alignSelf: 'flex-end', marginRight: 40}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setDuration(tempDuration * 1000);
                            setWheelDurationModalVisible(false);
                        }}
                    >
                        <Text style={{fontSize: 20, fontWeight: 500, color: colors.secondary}}>{t['Apply']}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default WheelDurationModal