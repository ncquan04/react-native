import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext } from 'react'
import BackIcon from '../../assets/icons/BackIcon';
import { LanguageContext } from '../contexts/LanguageContext';

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
    const { t } = useContext(LanguageContext);

    const handleSave = () => {
        setStartNumber(tempStartNumber);
        setEndNumber(tempEndNumber);
        setDuration(tempDuration);
        setRandomCustomModalVisible(false);
    }

    return (
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
                    <TouchableOpacity onPress={() => setRandomCustomModalVisible(false)}>
                        <BackIcon width={40} height={40}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 30, fontWeight: 500}}>{t['Custom']}</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                    >
                        <Text style={{fontSize: 20, fontWeight: 400}}>{t['Save']}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '80%', flexDirection: 'column', marginTop: 60}}>
                    <View 
                        style={{flexDirection: 'row', height: 60,
                        justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}
                    >
                        <View style={{width: '35%', height: '100%', backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                {t['Start']}
                            </Text>
                        </View>
                        <View style={{width: '60%', height: '100%', backgroundColor: '#305b69', padding: 5, borderRadius: 10}}>
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
                        <View style={{width: '35%', height: '100%', backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                {t['End']}
                            </Text>
                        </View>
                        <View style={{width: '60%', backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center'}}>
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
                        <View style={{width: '35%', height: '100%',backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                {t['Duration']}
                            </Text>
                        </View>
                        <View style={{width: '60%', backgroundColor: '#305b69', padding: 5, borderRadius: 10}}>
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
    )
}

export default RandomCustomModal