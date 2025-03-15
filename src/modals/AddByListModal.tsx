import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import XIcon from '../../assets/icons/XIcon';

interface AddByListModalProps {
    addByListModalVisible: boolean;
    setAddByListModalVisible: (value: boolean) => void;
    items: any[];
    setItems: (value: any[]) => void;
    t: any;
}

const AddByListModal = ({addByListModalVisible, setAddByListModalVisible, items, setItems, t}: AddByListModalProps) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={addByListModalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setAddByListModalVisible(!addByListModalVisible)
            }}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative'}}>
                <TouchableWithoutFeedback
                    onPress={() => setAddByListModalVisible(false)}
                    style={{flex: 1}}
                >
                    <View style={{flex: 1}}/>
                </TouchableWithoutFeedback>
                <View style={{width: '90%', height: '65%', position: 'absolute', top: '18%', left: '5%', right: '5%', backgroundColor: 'white', borderRadius: 50, flexDirection: 'column', zIndex: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20, alignItems: 'center'}}>
                        <View style={{width: 20}}/>
                        <Text style={{fontSize: 30, fontWeight: 600}}>Item List</Text>
                        <TouchableOpacity
                            onPress={() => setAddByListModalVisible(false)}
                        >
                            <XIcon width={20} height={20}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: '65%', width: '90%', padding: 20, backgroundColor: '#305b69', borderRadius: 30, borderWidth: 2, borderColor: 'black'}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={16}
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, width: '100%', paddingVertical: 20}}>
                        <TouchableOpacity 
                            style={{width: '45%', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#fc6f6f', borderRadius: 30}}
                            onPress={() => setAddByListModalVisible(false)}
                        >
                            <Text style={{fontSize: 20, fontWeight: 500, color: 'white', textAlign: 'center'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{width: '45%', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#f2ae41', borderRadius: 30}}
                        >
                            <Text style={{fontSize: 20, fontWeight: 500, color: 'white', textAlign: 'center'}}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default AddByListModal