import { View, Text, Modal, TouchableOpacity, ScrollView, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface WheelHistoryDetailModalProps {
    wheelHistoryDetailModalVisible: boolean;
    setWheelHistoryDetailModalVisible: (visible: boolean) => void;
    wheel: { id: number, name: string, segments: {content: string, color: string}[] };
    id: number;
    t: any;
}

const WheelHistoryDetailModal = ({ wheelHistoryDetailModalVisible, setWheelHistoryDetailModalVisible, wheel, id, t }: WheelHistoryDetailModalProps) => {
    const [history, setHistory] = useState<any[]>([]);
    const { theme } = useDarkMode();

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
            transparent={false}
            statusBarTranslucent={true}
            visible={wheelHistoryDetailModalVisible}
            onRequestClose={() => setWheelHistoryDetailModalVisible(!wheelHistoryDetailModalVisible)}
        >
            <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: theme.background_color, alignItems: 'center' }}>
                <View style={{ width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        Vibration.vibrate(50);
                        setWheelHistoryDetailModalVisible(false);
                    }}>
                        <BackIcon width={40} height={40} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, fontWeight: '500', color: theme.contrast_text_color }}>{wheel.name}</Text>
                    <View style={{ width: 40 }} />
                </View>
                <ScrollView 
                    style={{ width: '100%', height: '90%'}}
                    contentContainerStyle={{ alignItems: 'center' }}
                >
                    {history
                        .filter(item => item.id === id)
                        .map((item, i) => (
                            <View key={i} style={{ width: '90%', flexDirection: 'column', justifyContent: 'center', height: 100, marginTop: 20, backgroundColor: theme.primary_color, borderRadius: 30, paddingHorizontal: 10 }}>
                                <Text style={{ color: theme.text_color, fontSize: 15, fontWeight: '600', marginLeft: 10, fontStyle: 'italic' }}>{t['Time: ']}{formatISODate(item.date)}</Text>
                                <Text style={{ color: theme.text_color, fontSize: 20, fontWeight: '600', marginLeft: 10, marginTop: 10 }}>{t['Reward: ']}{item.result}</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </Modal>
    )
}

export default WheelHistoryDetailModal