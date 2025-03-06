import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import BackIcon from '../../assets/icons/BackIcon';

interface RandomCustomModalProps {
    RandomCustomModalVisible: boolean;
    setRandomCustomModalVisible: (visible: boolean) => void;
}

const RandomCustomModal = ({ RandomCustomModalVisible, setRandomCustomModalVisible }: RandomCustomModalProps) => {
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
                    <Text style={{fontSize: 30, fontWeight: 500}}>Custom</Text>
                    <TouchableOpacity>
                        <Text style={{fontSize: 20, fontWeight: 400}}>Save</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '80%', flexDirection: 'column', marginTop: 60}}>
                    <View 
                        style={{flexDirection: 'row', height: 60,
                        justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}
                    >
                        <View style={{width: '35%', height: '100%', backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                Start
                            </Text>
                        </View>
                        <View style={{width: '60%', height: '100%', backgroundColor: '#305b69', padding: 5, borderRadius: 10}}>
                            <TextInput 
                                style={{fontSize: 20, fontWeight: 400, color: 'white'}}
                                keyboardType='number-pad'
                            >
                                0
                            </TextInput>
                        </View>
                    </View>
                    <View 
                        style={{flexDirection: 'row', height: 60, 
                        justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}
                    >
                        <View style={{width: '35%', height: '100%', backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                End
                            </Text>
                        </View>
                        <View style={{width: '60%', backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center'}}>
                            <TextInput 
                                style={{fontSize: 20, fontWeight: 400, color: 'white'}}
                                keyboardType='number-pad'
                            >
                                0
                            </TextInput>
                        </View>
                    </View>
                    <View 
                        style={{flexDirection: 'row', height: 60, 
                        justifyContent: 'space-between', alignItems: 'center', marginTop: 80}}
                    >
                        <View style={{width: '35%', height: '100%',backgroundColor: '#305b69', padding: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 400, color: 'white', textAlign: 'center'}}>
                                Duration
                            </Text>
                        </View>
                        <View style={{width: '60%', backgroundColor: '#305b69', padding: 5, borderRadius: 10}}>
                            <TextInput 
                                style={{fontSize: 20, fontWeight: 400, color: 'white'}}
                                keyboardType='number-pad'
                            >
                                0
                            </TextInput>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default RandomCustomModal