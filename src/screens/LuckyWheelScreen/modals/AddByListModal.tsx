import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, TextInput, Vibration } from 'react-native'
import React, { useState } from 'react'
import XIcon from '../../../../assets/icons/XIcon';
import colors from '../../../constants/colors';

interface AddByListModalProps {
    addByListModalVisible: boolean;
    setAddByListModalVisible: (value: boolean) => void;
    items: any[];
    setItems: (value: any[]) => void;
    t: any;
}

const AddByListModal = ({addByListModalVisible, setAddByListModalVisible, items, setItems, t}: AddByListModalProps) => {
    const [itemList, setItemList] = useState('');

    const handleAddByList = () => {
        const itemsArray = itemList.split('\n');
        const newItems = itemsArray.map((item, index) => {
            return {
                id: items.length + index,
                content: item,
                color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
                checked: false
            }
        });
        setItems([...items, ...newItems]);
        setItemList('');
        setAddByListModalVisible(false);
    }

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
                            onPress={() => {
                                Vibration.vibrate(50);
                                setAddByListModalVisible(false);
                            }}
                        >
                            <XIcon width={20} height={20}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: '65%', width: '90%', padding: 20, backgroundColor: colors.primary, borderRadius: 30, borderWidth: 2, borderColor: 'black'}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={16}
                            style={{color: 'white', fontSize: 15, width: '100%'}}
                            value={itemList}
                            onChangeText={(text) => setItemList(text)}
                            placeholder='Enter your list here...'
                            placeholderTextColor='white'
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, width: '100%', paddingVertical: 20}}>
                        <TouchableOpacity 
                            style={{width: '45%', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#fc6f6f', borderRadius: 30}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setAddByListModalVisible(false);
                            }}
                        >
                            <Text style={{fontSize: 20, fontWeight: 500, color: 'white', textAlign: 'center'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{width: '45%', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: colors.secondary, borderRadius: 30}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleAddByList();
                            }}
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