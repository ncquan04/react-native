import { View, Text, Modal, TextInput, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import Alert from '../../../components/Alert';
import colors from '../../../constants/colors';
import LuckyWheel from '../../../components/LuckyWheel';
import NextIcon from '../../../../assets/icons/NextIcon';
import AddItemsModal from './AddItemsModal';

interface AddWheelModalProps {
    addWheelModalVisible: boolean;
    setAddWheelModalVisible: (value: boolean) => void;
    setWheels: any;
    t: any;
}

const SampleStyles = [
    {
        name: 'Custom',
        segments: [
            { content: '', color: '#b1b6ba' },
            { content: '', color: '#b1b6ba' }
        ]
    },
    {
        name: 'Colorful Rainbow Bright',
        segments: [
            { content: '', color: '#F719AB' },
            { content: '', color: '#CA271B' },
            { content: '', color: '#F2B705' },
            { content: '', color: '#F2D705' },
            { content: '', color: '#A0F705' },
            { content: '', color: '#05F2B7' },
            { content: '', color: '#05F2D7' },
            { content: '', color: '#05A0F7' },
            { content: '', color: '#05F705' },
            { content: '', color: '#B705F2' },
            { content: '', color: '#D705F2' },
            { content: '', color: '#F705A0' },
            { content: '', color: '#F70505' },
            { content: '', color: '#F705B7' },
            { content: '', color: '#F705D7' },
            { content: '', color: '#F70505' }
        ]
    },{
        name: 'Colorful PoolParty Light',
        segments: [
            { content: '', color: '#FF9F1C' },
            { content: '', color: '#FFBF69' },
            { content: '', color: '#CBF3F0' },
            { content: '', color: '#2EC4B6' },
            { content: '', color: '#80ED99' },
            { content: '', color: '#FFCFD2' },
            { content: '', color: '#FB6107' },
            { content: '', color: '#F9C74F' },
            { content: '', color: '#90DBF4' },
            { content: '', color: '#F94144' },
            { content: '', color: '#B8C0FF' },
            { content: '', color: '#43AA8B' },
            { content: '', color: '#F8961E' },
            { content: '', color: '#A31621' },
            { content: '', color: '#90BE6D' },
            { content: '', color: '#F9844A' }
        ]
    },
    {
        name: 'Light & Dark',
        segments: [
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' },
            { content: '', color: '#64686b' },
            { content: '', color: '#bbc3c9' }
        ]
    }
]

const AddWheelModal = ({ addWheelModalVisible, setAddWheelModalVisible, setWheels, t }: AddWheelModalProps) => {
    const [selectedStyle, setSelectedStyle] = useState<number>(0);
    const [wheelName, setWheelName] = useState<string>('');
    const [addItemsModalVisible, setAddItemsModalVisible] = useState<boolean>(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
    
    const handleItemsPress = () => {
        Vibration.vibrate(50);
        if (wheelName) {
            setAddItemsModalVisible(true);
            setAttemptedSubmit(false);
        } else {
            setAttemptedSubmit(true);
        }
    }

    return (
        <>
            <Modal
            animationType='slide'
            transparent={false}
            visible={addWheelModalVisible}
            onRequestClose={() => setAddWheelModalVisible(false)}
            statusBarTranslucent={true}
            >
            <View style={{ flex: 1, flexDirection: 'column', paddingTop: 25, backgroundColor: 'white', position: 'relative' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(50);
                            setAddWheelModalVisible(false);
                        }}>
                            <BackIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 30, fontWeight: 600 }}>Add Wheel</Text>
                        <View style={{width: 40}}/>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 20, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 25, fontWeight: 500 }}>{t['Name']}</Text>
                        <TextInput
                            style={{ width: '100%', backgroundColor: colors.primary, color: 'white', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 20, marginTop: 10 }}
                            placeholder={t["Add wheel's name"]}
                            placeholderTextColor={'white'}
                            value={wheelName}
                            onChangeText={(text) => setWheelName(text)}
                        />
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 20, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 25, fontWeight: 500 }}>{t['Style']}</Text>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                            {SampleStyles.map((style, index) => {
                                return (
                                    <View key={index} style={{width: '20%', flexDirection: 'column', alignItems: 'center'}}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                Vibration.vibrate(50);
                                                setSelectedStyle(index);
                                            }}
                                            style={{flexDirection: 'column', alignItems: 'center'}}
                                        >
                                            <LuckyWheel
                                                segments={style.segments}
                                                radius={index === selectedStyle ? 40 : 30}
                                            />
                                            <View style={{width: '100%'}}>
                                                <Text style={{fontSize: 15, fontWeight: 500, flexWrap: 'wrap', textAlign: 'center'}}>{t[style.name]}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                        <TouchableOpacity 
                            style={{width: '80%', flexDirection: 'row', backgroundColor: colors.secondary, borderRadius: 100, justifyContent: 'space-between', alignItems: 'center', marginTop: 80, alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 20}}
                            onPress={handleItemsPress}
                        >
                            <View/>
                            <Text style={{fontSize: 20, fontWeight: 600, color: 'white'}}>{t['Items']}</Text>
                            <NextIcon width={25} height={25} fill={'white'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {addItemsModalVisible && <AddItemsModal
                addItemsModalVisible={addItemsModalVisible}
                setAddItemsModalVisible={setAddItemsModalVisible}
                setAddWheelModalVisible={setAddWheelModalVisible}
                setWheels={setWheels}
                wheelName={wheelName}
                sampleStyle={SampleStyles[selectedStyle]}
                t={t}
            />}

            {!wheelName && attemptedSubmit ? <Alert alertVisible={attemptedSubmit} setAlertVisible={() => {}} setAttemptedSubmit={setAttemptedSubmit} message={"Please fill wheel's name!"} /> : null}
        </>
    )
}

export default AddWheelModal