import { View, Text, Modal, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import React, { useContext, useEffect } from 'react';
import BackIcon from '../../../../assets/icons/BackIcon';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface RandomHistoryModalProps {
    RandomHistoryModalVisible: boolean;
    setRandomHistoryModalVisible: (visible: boolean) => void;
    history: { randomNumber: number; date: string; time: string }[];
}

const RandomHistoryModal = ({ RandomHistoryModalVisible, setRandomHistoryModalVisible, history }: RandomHistoryModalProps) => {
    const { t } = useContext(LanguageContext);
    const { theme } = useDarkMode();

    return (
        <Modal animationType="slide" transparent={false} statusBarTranslucent={true} visible={RandomHistoryModalVisible} onRequestClose={() => setRandomHistoryModalVisible(!RandomHistoryModalVisible)}>
            <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: theme.background_color, alignItems: 'center', paddingTop: 20 }}>
                <View style={{ width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', paddingRight: '37%', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        Vibration.vibrate(50);
                        setRandomHistoryModalVisible(false);
                    }}>
                        <BackIcon width={40} height={40} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, fontWeight: '500', color: theme.contrast_text_color }}>{t['History']}</Text>
                </View>

                <ScrollView style={{ width: '100%', height: '90%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <View key={index} style={{
                                width: '90%', backgroundColor: theme.primary_color, borderRadius: 20,
                                marginTop: 20, padding: 15, flexDirection: 'column',
                                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3, shadowRadius: 5, elevation: 6
                            }}>
                                <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text_color }}>{t['Random Number: ']} {item.randomNumber}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text_color }}>{t['Time: ']} {item.time}</Text>
                                    <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text_color, marginLeft: 10 }}>{item.date}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 18, color: 'gray', marginTop: 20 }}>Không có lịch sử.</Text>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default RandomHistoryModal;
