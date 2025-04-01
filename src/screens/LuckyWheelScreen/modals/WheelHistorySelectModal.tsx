import { View, Text, Modal, TouchableOpacity, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import LuckyWheel from '../../../components/LuckyWheel';
import WheelHistoryDetailModal from './WheelHistoryDetailModal';
import colors from '../../../constants/colors';

interface LuckyWheelHistoryModalProps {
    wheelHistorySelectModalVisible: boolean;
    setWheelHistorySelectModalVisible: (visible: boolean) => void;
    wheels: {id: number, name: string, segments: any[]}[];
    t: any;
}

const WheelHistorySelectModal = ({ wheelHistorySelectModalVisible, setWheelHistorySelectModalVisible, wheels, t}: LuckyWheelHistoryModalProps) => {
    const [selectedWheelId, setSelectedWheelId] = useState<number>(0);
    const [wheelHistoryDetailModalVisible, setWheelHistoryDetailModalVisible] = useState<boolean>(false);

    return (
        <>
            <Modal 
                animationType="slide" 
                transparent={true} 
                visible={wheelHistorySelectModalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => setWheelHistorySelectModalVisible(!wheelHistorySelectModalVisible)}
            >
                <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center' }}>
                    <View style={{ width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(50);
                            setWheelHistorySelectModalVisible(false);
                        }}>
                            <BackIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 30, fontWeight: '500' }}>{t['History']}</Text>
                        <View style={{width: 40}}/>
                    </View>
                    {wheels.map((wheel, index) => {
                        return (
                            <TouchableOpacity 
                                key={index} style={{ width: '90%', flexDirection: 'row', height: 100, marginTop: 20, backgroundColor: colors.primary, borderRadius: 30, alignItems: 'center', paddingHorizontal: 10 }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setSelectedWheelId(wheel.id);
                                    setWheelHistoryDetailModalVisible(true);
                                }}
                            >
                                <LuckyWheel
                                    segments={wheel.segments.map((segment: any) => ({ ...segment, content: "" }))}
                                    radius={30}
                                />
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 600, marginLeft: 10 }}>{wheel.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </Modal>

            {wheelHistoryDetailModalVisible && <WheelHistoryDetailModal
                wheelHistoryDetailModalVisible={wheelHistoryDetailModalVisible}
                setWheelHistoryDetailModalVisible={setWheelHistoryDetailModalVisible}
                wheel={wheels.find(wheel => wheel.id === selectedWheelId) || { id: 0, name: '', segments: [] }}
                id={selectedWheelId}
                t={t}
            />}
        </>
    )
}

export default WheelHistorySelectModal;