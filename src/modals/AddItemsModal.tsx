import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Alert from '../components/Alert';
import BackIcon from '../../assets/icons/BackIcon';
import AddIcon from '../../assets/icons/AddIcon';
import ColorPickerModal from './ColorPickerModal';
import TrashIcon from '../../assets/icons/TrashIcon';
import WheelDemoModal from './WheelDemoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddItemsModalProps {
    addItemsModalVisible: boolean;
    setAddItemsModalVisible: (value: boolean) => void;
    setAddWheelModalVisible: (value: boolean) => void;
    wheelName: string;
    t: any;
}

const AddItemsModal = ({ addItemsModalVisible, setAddItemsModalVisible, setAddWheelModalVisible, wheelName, t} : AddItemsModalProps) => {
    const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
    const [colorPickerModalVisible, setColorPickerModalVisible] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]);
    const [itemName, setItemName] = useState<string>('');
    const [wheelDemoModalVisible, setWheelDemoModalVisible] = useState<boolean>(false);

    const handleAddItem = () => {
        setItems([...items, {content: itemName, color: selectedColor}])
        setItemName('')
    }

    const handleDeleteItem = (index: number) => {
        let newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const handleSaveWheel = async () => {
        const wheels = await AsyncStorage.getItem('wheels')
        let newWheels = wheels ? JSON.parse(wheels) : []
        newWheels.push({name: wheelName, segments: items})
        await AsyncStorage.setItem('wheels', JSON.stringify(newWheels))
        setAddItemsModalVisible(false)
        setAddWheelModalVisible(false)
    }

    return (
        <>
            <Modal
                animationType='slide'
                transparent={true}
                visible={addItemsModalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => {
                    setAddItemsModalVisible(!addItemsModalVisible)
                }}
                >
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 40}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => setAddItemsModalVisible(false)}
                            >
                                <BackIcon width={40} height={40}/>
                            </TouchableOpacity>
                            <Text style={{fontSize: 30, fontWeight: 600}}>{t['Items']}</Text>
                            <View style={{width: 40}}/>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                            <Text style={{fontSize: 25, fontWeight: 500}}>{t['Add Item']}</Text>
                            <TouchableOpacity
                                style={{backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}
                            >
                                <Text style={{fontSize: 17, fontWeight: 500, color: 'white'}}>Add by list</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                            <View style={{width: '60%', alignItems: 'center'}}>
                                <TextInput
                                    style={{width: '100%', backgroundColor: '#305b69', color: 'white', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 25}}
                                    placeholder={t["Item's name"]}
                                    placeholderTextColor={'white'}
                                    value={itemName}
                                    onChangeText={(text) => setItemName(text)}
                                />
                            </View>
                            <TouchableOpacity
                                style={{width: '37%', height: '100%', backgroundColor: '#305b69', padding: 10, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                                onPress={() => setColorPickerModalVisible(true)}
                            >
                                <Text style={{fontSize: 15, fontWeight: 500, color: 'white'}}>{t['Color']}</Text>
                                <View style={{ width: '30%', height: '62%', borderRadius: 100, backgroundColor: selectedColor}}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={{width: '100%', marginTop: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f2ae41', borderRadius: 50}}
                            onPress={handleAddItem}
                        >
                            <AddIcon width={30} height={30} fill={'white'}/>
                            <Text style={{fontSize: 20, fontWeight: 500, color: 'white'}}>{t['Add']}</Text>
                            <View style={{width: 30}}/>
                        </TouchableOpacity>

                        <Text style={{fontSize: 25, fontWeight: 500, marginTop: 30, alignSelf: 'flex-start'}}>{t['Items']}</Text>

                        <ScrollView
                            contentContainerStyle={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 10, gap: 8}}
                            style={{width: '100%', marginTop: 10}}
                        >
                            {items.map((item, index) => {
                                return (
                                    <View 
                                        key={index}
                                        style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#305b69', borderRadius: 15, marginTop: 10, borderWidth: 2, borderColor: 'black', overflow: 'hidden'}}
                                    >
                                        <View style={{width: '70%', flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{width: '30%', height: 50, backgroundColor: `${item.color}`}}/>
                                            <Text style={{fontSize: 20, fontWeight: 500, color: 'white', marginLeft: 20}}>{item.name}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{marginRight: 20}}
                                            onPress={() => handleDeleteItem(index)}
                                        >
                                            <TrashIcon width={20} height={20} fill={'white'}/>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </ScrollView>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '100%'}}>
                            <TouchableOpacity 
                                style={{width: '47%', backgroundColor: '#f2ae41', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 20}} 
                                onPress={() => setWheelDemoModalVisible(true)}
                            >
                                <Text style={{fontSize: 20, fontWeight: 500, color: 'white', textAlign: 'center'}}>{t['Demo']}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{width: '47%', backgroundColor: '#f2ae41', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 20}}
                                onPress={handleSaveWheel}
                            >
                                <Text style={{fontSize: 20, fontWeight: 500, color: 'white', textAlign: 'center'}}>{t['Save Wheel']}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
            </Modal>

            <ColorPickerModal
                colorPickerModalVisible={colorPickerModalVisible}
                setColorPickerModalVisible={setColorPickerModalVisible}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                t={t}
            />

            <WheelDemoModal
                wheelDemoModalVisible={wheelDemoModalVisible}
                setWheelDemoModalVisible={setWheelDemoModalVisible}
                items={items}
                t={t}
            />
        </>
    )
}

export default AddItemsModal