import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Vibration } from 'react-native'
import React, { useContext } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import { LanguageContext } from '../../../contexts/LanguageContext';
import colors from '../../../constants/colors';
import { REMOTE_KEY, useGetRemoteConfig } from '../../../remoteConfig/RemoteConfig';

interface CoinCustomModalProps {
    coinIndex: number;
    setCoinIndex: (index: number) => void;
    coinCustomModalVisible: boolean;
    setCoinCustomModalVisible: (visible: boolean) => void;
    heads: { [key: number]: any };
    tails: { [key: number]: any };
}

const CoinCustomModal = ({ coinIndex, setCoinIndex, coinCustomModalVisible, setCoinCustomModalVisible, heads, tails }: CoinCustomModalProps) => {
    const {t} = useContext(LanguageContext);

    const handleChangeCoins = (index: number) => {
        setCoinIndex(index + 1);
        setCoinCustomModalVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={coinCustomModalVisible}
            onRequestClose={() => {
                setCoinCustomModalVisible(!coinCustomModalVisible);
            }}
        >
            <View style={{width: '100%', height: '100%', flexDirection: 'column', backgroundColor: colors.background_color, alignItems: 'center'}}>
                <View 
                    style={{width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', 
                    justifyContent: 'space-between', alignItems: 'center', position: 'relative'}}
                >
                    <TouchableOpacity
                        style={{zIndex: 10}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setCoinCustomModalVisible(false);
                        }}
                    >
                        <BackIcon width={40} height={40}/>
                    </TouchableOpacity>
                    <Text 
                        style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 30, fontWeight: "500", color: colors.text_color}}
                    >{
                        t['Coins']}
                    </Text>
                </View>
                <ScrollView 
                    style={{width: '80%', flexDirection: 'column', marginTop: 20}}
                    showsVerticalScrollIndicator={false}
                >
                    {Object.keys(heads).map(((key: string, index) => {
                        return (
                            <TouchableOpacity 
                                key={index}
                                style={{width: '100%', height: 150, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                marginTop: 30, backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), borderRadius: 10, paddingHorizontal: '5%'}}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    handleChangeCoins(index);
                                }}
                            >
                                <Image
                                    source={heads[index + 1]}
                                    style={{width: 150, height: 150, objectFit: 'contain'}}
                                />
                                <Image
                                    source={tails[index + 1]}
                                    style={{width: 150, height: 150, objectFit: 'contain'}}
                                />
                            </TouchableOpacity>
                        )
                    }))}
                </ScrollView>
            </View>
        </Modal>
    )
}

export default CoinCustomModal