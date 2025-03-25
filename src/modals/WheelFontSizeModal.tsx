import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import XIcon from '../../assets/icons/XIcon';
import Slider from '@react-native-community/slider';

interface WheelFontSizeModalProps {
    wheelFontSizeModalVisible: boolean;
    setWheelFontSizeModalVisible: (visible: boolean) => void;
    fontSize: number;
    setFontSize: (FontSize: number) => void;
    t: any;
}

const WheelFontSizeModal = ({ wheelFontSizeModalVisible, setWheelFontSizeModalVisible, fontSize, setFontSize, t}: WheelFontSizeModalProps) => {
    const [tempFontSize, setTempFontSize] = useState<number>(fontSize);

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={wheelFontSizeModalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setWheelFontSizeModalVisible(!wheelFontSizeModalVisible)
            }}
        >
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <TouchableWithoutFeedback
                    onPress={() => setWheelFontSizeModalVisible(false)}
                >
                    <View style={{flex: 0.7, backgroundColor: 'rgba(0,0,0,0)'}}/>
                </TouchableWithoutFeedback>
                <View style={{flex: 0.3, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 30, paddingTop: 10}}>
                    <View style={{width: '100%', height: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{marginLeft: 20}}/>
                        <Text style={{fontSize: 30, fontWeight: 600}}>{t['Font size']}</Text>
                        <TouchableOpacity
                            style={{marginRight: 20}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelFontSizeModalVisible(false);
                            }}
                        >
                            <XIcon width={15} height={15} fill={'black'} onPress={() => {
                                Vibration.vibrate(50);
                                setWheelFontSizeModalVisible(false);
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 25, fontWeight: 500, alignSelf: 'center'}}>
                        {tempFontSize}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 20, fontWeight: 500}}>1</Text>
                        <Slider
                            style={{width: '60%', height: 40, alignSelf: 'center'}}
                            step={1}
                            minimumValue={1}
                            maximumValue={40}
                            minimumTrackTintColor="#f2ae41"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#f2ae41"
                            value={fontSize}
                            onValueChange={value => setTempFontSize(value)}
                        />
                        <Text style={{fontSize: 20, fontWeight: 500}}>40</Text>
                    </View>
                    <TouchableOpacity 
                        style={{alignSelf: 'flex-end', marginRight: 40}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setFontSize(tempFontSize);
                            setWheelFontSizeModalVisible(false);
                        }}
                    >
                        <Text style={{fontSize: 20, fontWeight: 500, color: '#f2ae41'}}>{t['Apply']}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default WheelFontSizeModal