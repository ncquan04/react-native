import { View, Text, Modal, TouchableOpacity, Vibration } from 'react-native';
import React, { useContext, useState } from 'react';
import BackIcon from '../../../../assets/icons/BackIcon';
import CheckIcon from '../../../../assets/icons/CheckIcon';
import UKFlag from '../../../../assets/images/UKFlag';
import VietnamFlag from '../../../../assets/images/VietNamFlag';
import { LanguageContext } from '../../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface LanguageModalProps {
    LanguageModalVisible: boolean;
    setLanguageModalVisible: (visible: boolean) => void;
}

const LanguageModal = ({ LanguageModalVisible, setLanguageModalVisible }: LanguageModalProps) => {
    const { language, setLanguage, t } = useContext(LanguageContext);
    const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
    const { theme } = useDarkMode();

    const handleChangeLanguage = async () => {
        await AsyncStorage.setItem('language', selectedLanguage);
        setLanguage(selectedLanguage);
        setLanguageModalVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            statusBarTranslucent={true}
            visible={LanguageModalVisible}
            onRequestClose={() => setLanguageModalVisible(!LanguageModalVisible)}
        >
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: theme.background_color,
                    paddingTop: 20
                }}
            >
                <View
                    style={{
                        width: '90%',
                        height: '10%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity onPress={() => {
                        Vibration.vibrate(50);
                        setLanguageModalVisible(false);
                    }}>
                        <BackIcon width={40} height={40} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, fontWeight: '500', color: theme.contrast_text_color }}>{t['Language']}</Text>
                    <TouchableOpacity onPress={() => {
                        Vibration.vibrate(50);
                        handleChangeLanguage();
                    }}>
                        <CheckIcon width={25} height={25} fill={theme.secondary_color} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        Vibration.vibrate(50);
                        setSelectedLanguage('en');
                    }}
                    style={{
                        width: '90%',
                        paddingHorizontal: 10,
                        paddingVertical: 15,
                        flexDirection: 'row',
                        backgroundColor: theme.primary_color,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UKFlag width={40} height={40} />
                        <Text style={{ fontSize: 20, fontWeight: '500', color: theme.background_color, marginLeft: 20 }}>
                            English
                        </Text>
                    </View>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            borderWidth: 2,
                            borderColor: theme.background_color,
                            borderRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {selectedLanguage === 'en' && <CheckIcon width={15} height={15} fill={theme.secondary_color} />}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        Vibration.vibrate(50);
                        setSelectedLanguage('vi');
                    }}
                    style={{
                        width: '90%',
                        paddingHorizontal: 10,
                        paddingVertical: 15,
                        flexDirection: 'row',
                        backgroundColor: theme.primary_color,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <VietnamFlag width={40} height={40} />
                        <Text style={{ fontSize: 20, fontWeight: '500', color: theme.background_color, marginLeft: 20 }}>
                            Tiếng Việt
                        </Text>
                    </View>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            borderWidth: 2,
                            borderColor: theme.background_color,
                            borderRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {selectedLanguage === 'vi' && <CheckIcon width={15} height={15} fill={theme.secondary_color} />}
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default LanguageModal;
