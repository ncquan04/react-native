import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Switch, Vibration } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import XIcon from '../../../../assets/icons/XIcon';
import { LanguageContext } from '../../../contexts/LanguageContext';
import HistoryIcon from '../../../../assets/icons/HistoryIcon';
import SpeedIcon from '../../../../assets/icons/SpeedIcon';
import FontSizeIcon from '../../../../assets/icons/FontSizeIcon';
import ReplaceIcon from '../../../../assets/icons/ReplaceIcon';
import WheelSpeedModal from './WheelSpeedModal';
import WheelDurationModal from './WheelDurationModal';
import WheelFontSizeModal from './WheelFontSizeModal';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface WheelCustomModalProps {
    wheelCustomModalVisible: boolean;
    setWheelCustomModalVisible: (visible: boolean) => void;
    duration: number;
    setDuration: (duration: number) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    fontSize: number;
    setFontSize: (fontSize: number) => void;
    removeSelected: boolean;
    setRemoveSelected: (removeSelected: boolean) => void;
    rerenderTrigger: number;
    setRerenderTrigger: (rerenderTrigger: number) => void;
}

const WheelCustomModal = ({ wheelCustomModalVisible, setWheelCustomModalVisible, duration, setDuration, speed, setSpeed, fontSize, setFontSize, removeSelected, setRemoveSelected, rerenderTrigger, setRerenderTrigger }: WheelCustomModalProps) => {
    const { t } = useContext(LanguageContext);
    const [wheelDurationModalVisible, setWheelDurationModalVisible] = useState<boolean>(false);
    const [wheelSpeedModalVisible, setWheelSpeedModalVisible] = useState<boolean>(false);
    const [wheelFontSizeModalVisible, setWheelFontSizeModalVisible] = useState<boolean>(false);
    const { theme } = useDarkMode();

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={wheelCustomModalVisible}
            onRequestClose={() => {
                setWheelCustomModalVisible(!wheelCustomModalVisible)
            }}
            statusBarTranslucent={true}
        >
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <TouchableWithoutFeedback
                    onPress={() => setWheelCustomModalVisible(false)}
                >
                    <View style={{ flex: 0.2, backgroundColor: 'rgba(0,0,0,0)' }} />
                </TouchableWithoutFeedback>
                <View style={{ flex: 0.8, height: '100%', backgroundColor: theme.background_color, borderTopLeftRadius: 30, borderBottomLeftRadius: 30, flexDirection: 'column', paddingTop: 35, overflow: 'hidden' }}>
                    <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
                        <View style={{ width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity
                                style={{ marginLeft: 20 }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setWheelCustomModalVisible(false);
                                }}
                            >
                                <XIcon width={25} height={25} fill={theme.contrast_text_color} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 30, fontWeight: 600, marginRight: 20, color: theme.contrast_text_color }}>
                                {t['Custom']}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ width: '90%', height: '15%', backgroundColor: theme.primary_color, borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setWheelDurationModalVisible(true);
                                }}
                            >
                                <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <HistoryIcon width={30} height={30} fill={theme.text_color} />
                                    <Text style={{ color: theme.text_color, fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap' }}>{t['Duration']}</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: 600, color: theme.text_color, marginRight: 10 }}>{duration / 1000}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: '90%', height: '15%', backgroundColor: theme.primary_color, borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setWheelSpeedModalVisible(true);
                                }}
                            >
                                <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <SpeedIcon width={30} height={30} fill={theme.text_color} />
                                    <Text style={{ color: theme.text_color, fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap' }}>{t['Speed']}</Text>
                                </View>
                                <View style={{ width: '30%' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 600, color: theme.text_color, marginRight: 10, flexWrap: 'wrap' }}>
                                        {speed === 1 ? t['Slow'] : speed === 3 ? t['Normal'] : t['Fast']}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ width: '90%', height: '15%', backgroundColor: theme.primary_color, borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setWheelFontSizeModalVisible(true);
                                }}    
                            >
                                <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <FontSizeIcon width={30} height={30} fill={theme.text_color} />
                                    <Text style={{ color: theme.text_color, fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap' }}>{t['Font size']}</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: 600, color: theme.text_color, marginRight: 10 }}>{fontSize}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ width: '90%', height: '15%', backgroundColor: theme.primary_color, borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setRemoveSelected(!removeSelected);
                                    setRerenderTrigger(rerenderTrigger + 1);
                                }}
                            >
                                <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <ReplaceIcon width={30} height={30} fill={theme.text_color} />
                                    <Text style={{ color: theme.text_color, fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap' }}>{t['Remove winning item']}</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: theme.text_color, true: theme.secondary_color }}
                                    thumbColor={theme.text_color}
                                    ios_backgroundColor={theme.text_color}
                                    onValueChange={() => {
                                        Vibration.vibrate(50);
                                        setRemoveSelected(!removeSelected);
                                        setRerenderTrigger(rerenderTrigger + 1);
                                    }}
                                    value={removeSelected}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {wheelDurationModalVisible && <WheelDurationModal
                wheelDurationModalVisible={wheelDurationModalVisible}
                setWheelDurationModalVisible={setWheelDurationModalVisible}
                duration={duration}
                setDuration={setDuration}
                t={t}
                rerenderTrigger={rerenderTrigger}
                setRerenderTrigger={setRerenderTrigger}
            />}
            {wheelSpeedModalVisible && <WheelSpeedModal
                wheelSpeedModalVisible={wheelSpeedModalVisible}
                setWheelSpeedModalVisible={setWheelSpeedModalVisible}
                speed={speed}
                setSpeed={setSpeed}
                t={t}
                rerenderTrigger={rerenderTrigger}
                setRerenderTrigger={setRerenderTrigger}
            />}
            {wheelFontSizeModalVisible && <WheelFontSizeModal
                wheelFontSizeModalVisible={wheelFontSizeModalVisible}
                setWheelFontSizeModalVisible={setWheelFontSizeModalVisible}
                fontSize={fontSize}
                setFontSize={setFontSize}
                t={t}
                rerenderTrigger={rerenderTrigger}
                setRerenderTrigger={setRerenderTrigger}
            />}
        </Modal>
    )
}

export default WheelCustomModal