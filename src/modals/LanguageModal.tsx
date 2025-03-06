import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import BackIcon from '../../assets/icons/BackIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import UKFlag from '../../assets/images/UKFlag';
import VietnamFlag from '../../assets/images/VietNamFlag';

interface LanguageModalProps {
    LanguageModalVisible: boolean,
    setLanguageModalVisible: (visible: boolean) => void;
}

const LanguageModal = ({LanguageModalVisible, setLanguageModalVisible}: LanguageModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={LanguageModalVisible}
            onRequestClose={() => {
                setLanguageModalVisible(!LanguageModalVisible);
            }}
        >
            <View style={{width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white'}}>
                <View style={{width: '90%', height: '10%', flexDirection: 'row', 
                    justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                        <BackIcon width={40} height={40}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 30, fontWeight: 500}}>Language</Text>
                    <TouchableOpacity>
                        <CheckIcon width={25} height={25} fill={'#f2ae41'}/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={{width: '90%', paddingHorizontal: 10, paddingVertical: 15, flexDirection: 'row', 
                    backgroundColor: '#305b69', borderRadius: 20, alignItems: 'center'}}
                >
                    <UKFlag width={40} height={40}/>
                    <Text style={{fontSize: 20, fontWeight: 500, color: 'white', marginLeft: 20}}>English</Text>
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{width: '90%', paddingHorizontal: 10, paddingVertical: 15, flexDirection: 'row', 
                    backgroundColor: '#305b69', borderRadius: 20, alignItems: 'center', marginTop: 20}}
                >
                    <VietnamFlag width={40} height={40}/>
                    <Text style={{fontSize: 20, fontWeight: 500, color: 'white', marginLeft: 20}}>Tiếng Việt</Text>
                    
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default LanguageModal