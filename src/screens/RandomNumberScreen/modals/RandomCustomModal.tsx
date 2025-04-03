import { View, Text, Modal, TouchableOpacity, TextInput, Vibration } from 'react-native'
import React, { useContext } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import { LanguageContext } from '../../../contexts/LanguageContext';
import Alert from '../../../components/Alert';
import { REMOTE_KEY, useGetRemoteConfig } from '../../../remoteConfig/RemoteConfig';
import colors from '../../../constants/colors';

interface RandomCustomModalProps {
    RandomCustomModalVisible: boolean;
    setRandomCustomModalVisible: (visible: boolean) => void;
    setting: {startNumber: number, endNumber: number, duration: number};
    setSetting: (setting: {startNumber: number, endNumber: number, duration: number}) => void;
}

const RandomCustomModal = ({ RandomCustomModalVisible, setRandomCustomModalVisible, setting, setSetting }: RandomCustomModalProps) => {
    const [tempStartNumber, setTempStartNumber] = React.useState<number>(setting.startNumber);
    const [tempEndNumber, setTempEndNumber] = React.useState<number>(setting.endNumber);
    const [tempDuration, setTempDuration] = React.useState<number>(setting.duration);
    const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
    const { t } = useContext(LanguageContext);

    const handleSave = () => {
        if (!tempStartNumber || !tempEndNumber || !tempDuration || 
            tempStartNumber === 0 || tempEndNumber === 0 || tempDuration === 0) {
            setAlertVisible(true);
            return;
        }

        if (tempStartNumber > tempEndNumber) {
            setAlertVisible(true);
            return;
        }
        
        setSetting({startNumber: tempStartNumber, endNumber: tempEndNumber, duration: tempDuration});
        setRandomCustomModalVisible(false);
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={false}
                statusBarTranslucent={true}
                visible={RandomCustomModalVisible}
                onRequestClose={() => {
                    setRandomCustomModalVisible(!RandomCustomModalVisible);
                }}
            >
                <View style={{width: '100%', height: '100%', flexDirection: 'column', backgroundColor: colors.background_color, alignItems: 'center'}}>
                    <View 
                        style={{width: '100%', height: '10%', paddingHorizontal: 20, flexDirection: 'row', 
                        justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(50);
                            setRandomCustomModalVisible(false);
                        }}>
                            <BackIcon width={40} height={40}/>
                        </TouchableOpacity>
                        <Text style={{fontSize: 30, fontWeight: 500, color: colors.text_color}}>{t['Custom']}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleSave();
                            }}
                        >
                            <Text style={{fontSize: 20, fontWeight: 400, color: colors.text_color}}>{t['Save']}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '80%', flexDirection: 'column', marginTop: 60}}>
                        <View 
                            style={{flexDirection: 'row', height: 60,
                            justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}
                        >
                            <View style={{width: '35%', height: '100%', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 400, color: colors.background_color, textAlign: 'center'}}>
                                    {t['Start']}
                                </Text>
                            </View>
                            <View style={{width: '60%', height: '100%', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), padding: 5, borderRadius: 10}}>
                                <TextInput 
                                    style={{fontSize: 20, fontWeight: 400, color: colors.background_color}}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setTempStartNumber(parseInt(text))}
                                    value={tempStartNumber ? tempStartNumber.toString() : ''}
                                />
                            </View>
                        </View>
                        <View 
                            style={{flexDirection: 'row', height: 60, 
                            justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}
                        >
                            <View style={{width: '35%', height: '100%', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 400, color: colors.background_color, textAlign: 'center'}}>
                                    {t['End']}
                                </Text>
                            </View>
                            <View style={{width: '60%', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), padding: 5, borderRadius: 10, justifyContent: 'center'}}>
                                <TextInput 
                                    style={{fontSize: 20, fontWeight: 400, color: colors.background_color}}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setTempEndNumber(parseInt(text))}
                                    value={tempEndNumber ? tempEndNumber.toString() : ''}
                                />
                            </View>
                        </View>
                        <View 
                            style={{flexDirection: 'row', height: 60, 
                            justifyContent: 'space-between', alignItems: 'center', marginTop: 80}}
                        >
                            <View style={{width: '35%', height: '100%',backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 400, color: colors.background_color, textAlign: 'center'}}>
                                    {t['Duration']}
                                </Text>
                            </View>
                            <View style={{width: '60%', backgroundColor: useGetRemoteConfig(REMOTE_KEY.primary_color), padding: 5, borderRadius: 10}}>
                                <TextInput 
                                    style={{fontSize: 20, fontWeight: 400, color: colors.background_color}}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setTempDuration(parseInt(text))}
                                    value={tempDuration ? tempDuration.toString() : ''}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        
            {alertVisible && (!tempStartNumber || !tempEndNumber || !tempDuration || 
            tempStartNumber === 0 || tempEndNumber === 0 || tempDuration === 0) && <Alert 
                alertVisible={alertVisible} 
                setAlertVisible={setAlertVisible}
                setAttemptedSubmit={() => {setAlertVisible(false)}} // Nếu không cần thiết, có thể xóa prop này
                message={'Please fill all fields!'} // Sử dụng hàm t để đa ngôn ngữ
            />}

            {alertVisible && (tempStartNumber > tempEndNumber) && <Alert
                alertVisible={alertVisible}
                setAlertVisible={setAlertVisible}
                setAttemptedSubmit={() => {setAlertVisible(false)}}
                message={'End number must be greater than Start number!'}
            />}
        </>
    )
}

export default RandomCustomModal