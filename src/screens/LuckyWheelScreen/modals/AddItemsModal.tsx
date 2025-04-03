import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Vibration } from 'react-native'
import React, { useState } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import AddIcon from '../../../../assets/icons/AddIcon';
import ColorPickerModal from './ColorPickerModal';
import TrashIcon from '../../../../assets/icons/TrashIcon';
import WheelDemoModal from './WheelDemoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddByListModal from '../../LuckyWheelScreen/modals/AddByListModal';
import Alert from '../../../components/Alert';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface AddItemsModalProps {
    addItemsModalVisible: boolean;
    setAddItemsModalVisible: (value: boolean) => void;
    setAddWheelModalVisible: (value: boolean) => void;
    setWheels: any;
    wheelName: string;
    sampleStyle: any;
    t: any;
}

interface AddItemsModalProps {
    addItemsModalVisible: boolean;
    setAddItemsModalVisible: (value: boolean) => void;
    setAddWheelModalVisible: (value: boolean) => void;
    setWheels: any;
    wheelName: string;
    sampleStyle: any;
    t: any;
}

const AddItemsModal = ({ addItemsModalVisible, setAddItemsModalVisible, setAddWheelModalVisible, setWheels, wheelName, sampleStyle, t} : AddItemsModalProps) => {
    const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
    const [colorPickerModalVisible, setColorPickerModalVisible] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>(sampleStyle.segments);
    const [itemName, setItemName] = useState<string>('');
    const [wheelDemoModalVisible, setWheelDemoModalVisible] = useState<boolean>(false);
    const [addByListModalVisible, setAddByListModalVisible] = useState<boolean>(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
    const [missingItem, setMissingItem] = useState<boolean>(false);
    const { theme } = useDarkMode();

    const handleAddItem = () => {
        if (itemName) {
            let newItems = [...items]
            newItems.push({content: itemName, color: selectedColor})
            setItems(newItems)
            setItemName('')
            setSelectedColor('#ffffff')
        } else {
            setAttemptedSubmit(true)
        }
    }

    const handleDeleteItem = (index: number) => {
        let newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const handleSaveWheel = async () => {
        if (items.length >= 2){
            const wheels = await AsyncStorage.getItem('wheels')
            let newWheels = wheels ? JSON.parse(wheels) : []
            const maxId = newWheels.length > 0 ? Math.max(...newWheels.map((wheel: any) => wheel.id)) : 0;
            newWheels.push({id: maxId + 1, name: wheelName, segments: items})
            await AsyncStorage.setItem('wheels', JSON.stringify(newWheels))
            setWheels(newWheels)
            setAddItemsModalVisible(false)
            setAddWheelModalVisible(false)
        } else {
            setMissingItem(true)
            setAttemptedSubmit(true)
        }
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
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: theme.background_color, paddingHorizontal: 20, paddingVertical: 40}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setAddItemsModalVisible(false);
                                }}
                            >
                                <BackIcon width={40} height={40}/>
                            </TouchableOpacity>
                            <Text style={{fontSize: 30, fontWeight: 600, color: theme.contrast_text_color}}>{t['Items']}</Text>
                            <View style={{width: 40}}/>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                            <Text style={{fontSize: 25, fontWeight: 500, color: theme.contrast_text_color}}>{t['Add Item']}</Text>
                            <TouchableOpacity
                                style={{backgroundColor: theme.secondary_color, padding: 10, borderRadius: 15}}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setAddByListModalVisible(true);
                                }}
                            >
                                <Text style={{fontSize: 17, fontWeight: 500, color: theme.text_color}}>Add by list</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                            <View style={{width: '60%', alignItems: 'center'}}>
                                <TextInput
                                    style={{width: '100%', backgroundColor: theme.primary_color, color: theme.text_color, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 25}}
                                    placeholder={t["Item's name"]}
                                    placeholderTextColor={theme.text_color}
                                    value={itemName}
                                    onChangeText={(text) => setItemName(text)}
                                />
                            </View>
                            <TouchableOpacity
                                style={{width: '37%', height: '100%', backgroundColor: theme.primary_color, padding: 10, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setColorPickerModalVisible(true);
                                }}
                            >
                                <Text style={{fontSize: 15, fontWeight: 500, color: theme.text_color}}>{t['Color']}</Text>
                                <View style={{ width: '30%', height: '62%', borderRadius: 100, backgroundColor: selectedColor}}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={{width: '100%', marginTop: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.secondary_color, borderRadius: 50}}
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleAddItem();
                            }}
                        >
                            <AddIcon width={30} height={30} fill={theme.text_color}/>
                            <Text style={{fontSize: 20, fontWeight: 500, color: theme.text_color}}>{t['Add']}</Text>
                            <View style={{width: 30}}/>
                        </TouchableOpacity>

                        <Text style={{fontSize: 25, fontWeight: 500, marginTop: 30, alignSelf: 'flex-start', color: theme.text_color}}>{t['Items']}</Text>

                        <ScrollView
                            contentContainerStyle={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 10, gap: 8}}
                            style={{width: '100%', marginTop: 10, minHeight: 100}}
                        >
                            {items.map((item, index) => {
                                return (
                                    <View 
                                        key={index}
                                        style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.primary_color, borderRadius: 15, marginTop: 10, borderWidth: 2, borderColor: theme.text_color, overflow: 'hidden'}}
                                    >
                                        <View style={{width: '70%', flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{width: '30%', height: 50, backgroundColor: `${item.color}`}}/>
                                            <Text style={{fontSize: 20, fontWeight: 500, color: theme.text_color, marginLeft: 20}}>{item.content}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{marginRight: 20}}
                                            onPress={() => {
                                                Vibration.vibrate(50);
                                                handleDeleteItem(index);
                                            }}
                                        >
                                            <TrashIcon width={20} height={20} fill={theme.text_color}/>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </ScrollView>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '100%'}}>
                            <TouchableOpacity 
                                style={{width: '47%', backgroundColor: theme.secondary_color, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 20}} 
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    setWheelDemoModalVisible(true);
                                }}
                            >
                                <Text style={{fontSize: 20, fontWeight: 500, color: theme.text_color, textAlign: 'center'}}>{t['Demo']}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{width: '47%', backgroundColor: theme.secondary_color, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 20}}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    handleSaveWheel();
                                }}
                            >
                                <Text style={{fontSize: 20, fontWeight: 500, color: theme.text_color, textAlign: 'center'}}>{t['Save Wheel']}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
            </Modal>

            {colorPickerModalVisible && <ColorPickerModal
                colorPickerModalVisible={colorPickerModalVisible}
                setColorPickerModalVisible={setColorPickerModalVisible}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                t={t}
            />}

            {wheelDemoModalVisible && <WheelDemoModal
                wheelDemoModalVisible={wheelDemoModalVisible}
                setWheelDemoModalVisible={setWheelDemoModalVisible}
                items={items}
                t={t}
            />}

            {addByListModalVisible && <AddByListModal
                addByListModalVisible={addByListModalVisible}
                setAddByListModalVisible={setAddByListModalVisible}
                items={items}
                setItems={setItems}
                t={t}
            />}

        {attemptedSubmit && !itemName && <Alert alertVisible={attemptedSubmit} setAlertVisible={() => setAttemptedSubmit(false)} setAttemptedSubmit={setAttemptedSubmit} message="Please fill Item's name" />}
        {attemptedSubmit && missingItem && <Alert alertVisible={attemptedSubmit} setAlertVisible={() => setAttemptedSubmit(false)} setAttemptedSubmit={setAttemptedSubmit} message="There must be at least 2 items!" />}
        </>
    )
}

export default AddItemsModal