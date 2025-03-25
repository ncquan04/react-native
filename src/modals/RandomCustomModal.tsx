import { View, Text, Modal, TouchableOpacity, TextInput, Vibration } from 'react-native'
import React, { useContext } from 'react'
import BackIcon from '../../assets/icons/BackIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import Alert from '../components/Alert';
import colors from '../constants/colors';

interface RandomCustomModalProps {
    RandomCustomModalVisible: boolean;
    setRandomCustomModalVisible: (visible: boolean) => void;
    startNumber: number;
    setStartNumber: (number: number) => void;
    endNumber: number;
    setEndNumber: (number: number) => void;
    duration: number;
    setDuration: (number: number) => void;
}

const RandomCustomModal = ({ RandomCustomModalVisible, setRandomCustomModalVisible, startNumber, setStartNumber, endNumber, setEndNumber, duration, setDuration }: RandomCustomModalProps) => {
    const [tempStartNumber, setTempStartNumber] = React.useState<number>(startNumber);
    const [tempEndNumber, setTempEndNumber] = React.useState<number>(endNumber);
    const [tempDuration, setTempDuration] = React.useState<number>(duration);
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
        
        setStartNumber(tempStartNumber);
        setEndNumber(tempEndNumber);
        setDuration(tempDuration);
        setRandomCustomModalVisible(false);
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={RandomCustomModalVisible}
                onRequestClose={() => {
                    setRandomCustomModalVisible(!RandomCustomModalVisible);
                }}
            >
                <View style={{width: '100%', height: '100%', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center'}}>
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
                        <Text style={{fontSize: 30, fontWeight: 500}}>{t['Custom']}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleSave();
                            }}
                        >
                            <Text style={{fontSize: 20, fontWeight: 400}}>{t['Save']}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '80%', flexDirection: 'column', marginTop: 60}}>
                        <View 
                            style={{flexDirection: 'row', height: 60,
                            justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}
                        >
                            <View style={{width: '35%', height: '100%', backgroundColor: colors.primary, padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                    {t['Start']}
                                </Text>
                            </View>
                            <View style={{width: '60%', height: '100%', backgroundColor: colors.primary, padding: 5, borderRadius: 10}}>
                                <TextInput 
                                    style={{fontSize: 20, fontWeight: 400, color: 'white'}}
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
                            <View style={{width: '35%', height: '100%', backgroundColor: colors.primary, padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                    {t['End']}
                                </Text>
                            </View>
                            <View style={{width: '60%', backgroundColor: colors.primary, padding: 5, borderRadius: 10, justifyContent: 'center'}}>
                                <TextInput 
                                    style={{fontSize: 20, fontWeight: 400, color: 'white'}}
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
                            <View style={{width: '35%', height: '100%',backgroundColor: colors.primary, padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                    {t['Duration']}
                                </Text>
                            </View>
                            <View style={{width: '60%', backgroundColor: colors.primary, padding: 5, borderRadius: 10}}>
                                <TextInput 
                                    style={{fontSize: 20, fontWeight: 400, color: 'white'}}
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