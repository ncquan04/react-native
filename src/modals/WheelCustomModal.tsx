import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import XIcon from '../../assets/icons/XIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import HistoryIcon from '../../assets/icons/HistoryIcon';
import SpeedIcon from '../../assets/icons/SpeedIcon';
import FontSizeIcon from '../../assets/icons/FontSizeIcon';
import ReplaceIcon from '../../assets/icons/ReplaceIcon';

interface WheelCustomModalProps {
    wheelCustomModalVisible: boolean;
    setWheelCustomModalVisible: (visible: boolean) => void;
    duration: number;
    setDuration: (duration: number) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    fontSize: number;
    setFontSize: (fontSize: number) => void;
}

const WheelCustomModal = ({ wheelCustomModalVisible, setWheelCustomModalVisible, duration, setDuration, speed, setSpeed, fontSize, setFontSize }: WheelCustomModalProps) => {
    const {t} = useContext(LanguageContext);


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
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <TouchableWithoutFeedback
                    onPress={() => setWheelCustomModalVisible(false)}
                >
                    <View style={{flex: 0.2, backgroundColor: 'rgba(0,0,0,0)'}} />
                </TouchableWithoutFeedback>
                <View style={{flex: 0.8, height: '100%', backgroundColor: 'white', borderRadius: 30, flexDirection: 'column', paddingTop: 35, overflow: 'hidden'}}>
                    <View style={{width: '100%', height: '100%', flexDirection: 'column'}}>
                        <View style={{width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
                            <TouchableOpacity 
                                style={{marginLeft: 20}}
                                onPress={() => setWheelCustomModalVisible(false)}
                            >
                                <XIcon width={25} height={25} fill={'black'}/>
                            </TouchableOpacity>
                            <Text style={{fontSize: 30, fontWeight: 600, marginRight: 20}}>
                                {t['Custom']}
                            </Text>
                        </View>

                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <TouchableOpacity style={{width: '90%', height: '15%', backgroundColor: '#305b69', borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10}}>
                                <HistoryIcon width={30} height={30} fill={'white'} />
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap'}}>{t['Duration']}</Text>
                            </View>
                            <Text style={{fontSize: 20, fontWeight: 600, color: 'white', marginRight: 10}}>{duration / 1000}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: '90%', height: '15%', backgroundColor: '#305b69', borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10}}>
                                <SpeedIcon width={30} height={30} fill={'white'} />
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap'}}>{t['Speed']}</Text>
                            </View>
                            <View style={{width: '30%'}}>
                                <Text style={{fontSize: 20, fontWeight: 600, color: 'white', marginRight: 10, flexWrap: 'wrap'}}>
                                    {speed === 1 ? t['Slow'] : speed === 3 ? t['Normal'] : t['Fast']}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: '90%', height: '15%', backgroundColor: '#305b69', borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10}}>
                                <FontSizeIcon width={30} height={30} fill={'white'} />
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap'}}>{t['Font size']}</Text>
                            </View>
                            <Text style={{fontSize: 20, fontWeight: 600, color: 'white', marginRight: 10}}>{fontSize}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: '90%', height: '15%', backgroundColor: '#305b69', borderRadius: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', width: '70%', alignItems: 'center', paddingHorizontal: 10}}>
                                <ReplaceIcon width={30} height={30} fill={'white'} />
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginLeft: 10, flexWrap: 'wrap'}}>{t['Remove winning item']}</Text>
                            </View>
                            <Switch
                                trackColor={{false: 'white', true: '#f2ae41'}}
                                thumbColor={'white'}
                                ios_backgroundColor={'white'}
                                onValueChange={() => {}}
                                value={false}
                            />
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default WheelCustomModal