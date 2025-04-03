import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext';
import colors from '../constants/colors';
import { useDarkMode } from '../contexts/DarkModeContext';

interface AlertProps {
    alertVisible: boolean;
    setAlertVisible: (visible: boolean) => void;
    setAttemptedSubmit: (value: boolean) => void;
    message: string;
}

const Alert = ({ alertVisible, setAlertVisible, message, setAttemptedSubmit}: AlertProps) => {
    const {t} = useContext(LanguageContext);
    const { theme } = useDarkMode();

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={alertVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setAttemptedSubmit(!alertVisible);
                setAlertVisible(!alertVisible);
            }}
        >
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <View style={{width: '80%', flexDirection: 'column', backgroundColor: colors.background_color, borderRadius: 30, padding: 20, alignItems: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 500, flexWrap: 'wrap', color: colors.text_color, textAlign: 'center'}}>{t[`${message}`]}</Text>
                    <TouchableOpacity
                        style={{width: '50%', backgroundColor: theme.secondary_color, borderRadius: 15, padding: 10, marginTop: 20}}
                        onPress={() => setAttemptedSubmit(false)}
                    >
                        <Text style={{fontSize: 20, fontWeight: 500, textAlign: 'center', color: colors.text_color}}>{t['OK']}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default Alert