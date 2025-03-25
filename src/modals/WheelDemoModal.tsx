import { View, Text, Modal, TouchableWithoutFeedback, Vibration } from 'react-native'
import React from 'react'
import LuckyWheel from '../components/LuckyWheel';

interface WheelDemoModalProps {
    wheelDemoModalVisible: boolean;
    setWheelDemoModalVisible: (value: boolean) => void;
    items: any[];
    t: any;
}

const WheelDemoModal = ({wheelDemoModalVisible, setWheelDemoModalVisible, items, t} : WheelDemoModalProps) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={wheelDemoModalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setWheelDemoModalVisible(!wheelDemoModalVisible)
            }}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingVertical: 20}}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        Vibration.vibrate(50);
                        setWheelDemoModalVisible(false);
                    }}
                    style={{flex: 0.5}}
                >
                    <View style={{flex: 0.5}}/>
                </TouchableWithoutFeedback>
                <View style={{flex: 0.5, flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 20}}>
                    <Text style={{fontSize: 20, fontWeight: 600, marginBottom: 20}}>{t['Demo']}</Text>
                    <LuckyWheel 
                        segments={items}
                        radius={150}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default WheelDemoModal