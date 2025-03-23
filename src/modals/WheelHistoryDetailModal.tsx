import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackIcon from '../../assets/icons/BackIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';

interface WheelHistoryDetailModalProps {
    wheelHistoryDetailModalVisible: boolean;
    setWheelHistoryDetailModalVisible: (visible: boolean) => void;
    wheel: any;
    index: number;
    t: any;
}

const WheelHistoryDetailModal = ({ wheelHistoryDetailModalVisible, setWheelHistoryDetailModalVisible, wheel, index, t }: WheelHistoryDetailModalProps) => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const history = await AsyncStorage.getItem('luckyWheelHistory');
            if (history) {
                setHistory(JSON.parse(history));
            }
        }
        fetchHistory();
    }, [])

    const formatISODate = (date: string) => {
        const d = new Date(date);
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={wheelHistoryDetailModalVisible}
            onRequestClose={() => setWheelHistoryDetailModalVisible(!wheelHistoryDetailModalVisible)}
        >
            <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center' }}>
                <View style={{ width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setWheelHistoryDetailModalVisible(false)}>
                        <BackIcon width={40} height={40} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, fontWeight: '500' }}>{wheel.name}</Text>
                    <View style={{ width: 40 }} />
                </View>
                <ScrollView 
                    style={{ width: '100%', height: '90%'}}
                    contentContainerStyle={{ alignItems: 'center' }}
                >
                    {history
                        .filter(item => item.wheelIndex === index)
                        .map((item, i) => (
                            <View key={i} style={{ width: '90%', flexDirection: 'column', justifyContent: 'center', height: 100, marginTop: 20, backgroundColor: colors.primary, borderRadius: 30, paddingHorizontal: 10 }}>
                                <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', marginLeft: 10, fontStyle: 'italic' }}>{t['Time: ']}{formatISODate(item.date)}</Text>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', marginLeft: 10, marginTop: 10 }}>{t['Reward: ']}{item.result}</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </Modal>
    )
}

export default WheelHistoryDetailModal