import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Vibration } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import BackIcon from '../../../../assets/icons/BackIcon';
import ColorPickerModal from './ColorPickerModal';
import CheckIcon from '../../../../assets/icons/CheckIcon';
import TrashIcon from '../../../../assets/icons/TrashIcon';
import WheelDemoModal from './WheelDemoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddByListModal from '../../LuckyWheelScreen/modals/AddByListModal';
import Alert from '../../../components/Alert';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { LanguageContext } from '../../../contexts/LanguageContext';
import EyeIcon from '../../../../assets/icons/EyeIcon';
import SaveIcon from '../../../../assets/icons/SaveIcon';

interface AddItemsModalProps {
    addItemsModalVisible: boolean;
    setAddItemsModalVisible: (value: boolean) => void;
    setAddWheelModalVisible: (value: boolean) => void;
    setWheels: any;
    sampleStyle: {name: string, segments: { color: string, content: string }[]};
}

const AddItemsModal = ({ addItemsModalVisible, setAddItemsModalVisible, setAddWheelModalVisible, setWheels, sampleStyle }: AddItemsModalProps) => {
    console.log(sampleStyle)

    const itemsRef = useRef<{ color: string, content: string }[]>(sampleStyle.name !== "Custom" ? [...sampleStyle.segments] : []);
    const [_, forceUpdate] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
    const [colorPickerModalVisible, setColorPickerModalVisible] = useState(false);
    const [wheelDemoModalVisible, setWheelDemoModalVisible] = useState(false);
    const [addByListModalVisible, setAddByListModalVisible] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);
    const [missingItem, setMissingItem] = useState(false);
    const [wheelName, setWheelName] = useState('');
    const nameHighlightRef = useRef<boolean>(false);
    const itemsHighlightRef = useRef<boolean[]>(itemsRef.current.map(() => false));

    const { theme } = useDarkMode();
    const { t } = useContext(LanguageContext);

    const handleAddItem = () => {
        itemsRef.current.unshift({ color: selectedColor, content: '' });
        itemsHighlightRef.current.unshift(false);
        forceUpdate(prev => prev + 1);
    };

    const handleDeleteItem = (index: number) => {
        itemsRef.current.splice(index, 1);
        forceUpdate(prev => prev + 1);
    };

    const handleChangeItemName = (text: string, index: number) => {
        itemsRef.current[index].content = text;
        forceUpdate(prev => prev + 1);
    };

    const handleSaveWheel = async () => {
        const items = itemsRef.current;
        if (items.length >= 2 && wheelName) {
            const wheels = await AsyncStorage.getItem('wheels');
            let newWheels = wheels ? JSON.parse(wheels) : [];
            const maxId = newWheels.length > 0 ? Math.max(...newWheels.map((wheel: any) => wheel.id)) : 0;
            newWheels.push({ id: maxId + 1, name: wheelName, segments: items });
            await AsyncStorage.setItem('wheels', JSON.stringify(newWheels));
            setWheels(newWheels);
            setAddItemsModalVisible(false);
            setAddWheelModalVisible(false);
            items.map((item) => {
                item.content = '';
            })
        } else {
            if (items.length < 2) {
                setMissingItem(true);
            }
            setAttemptedSubmit(true);
        }
    };

    return (
        <>
            <Modal
                animationType='slide'
                transparent
                visible={addItemsModalVisible}
                statusBarTranslucent
                onRequestClose={() => setAddItemsModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: theme.background_color, paddingHorizontal: 20, paddingVertical: 40 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(50);
                            setAddItemsModalVisible(false);
                        }}>
                            <BackIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 30, fontWeight: '600', color: theme.contrast_text_color }}>{t['Wheel']}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Wheel name input */}    
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 20, }}>
                        <Text style={{ fontSize: 25, fontWeight: 600, color: theme.contrast_text_color }}>{t['Name']}</Text>
                        <TextInput
                            style={{ width: '100%', fontSize: 22, fontWeight: 700, backgroundColor: theme.primary_color, color: theme.text_color, borderRadius: 15, paddingHorizontal: 10, paddingVertical: 20, marginTop: 10, borderWidth: 1, borderColor: nameHighlightRef.current ? theme.secondary_color : theme.primary_color }}
                            placeholder={t["Add wheel's name"]}
                            placeholderTextColor={'rgba(255, 255, 255, 0.3)'}
                            value={wheelName}
                            onFocus={() => {
                                nameHighlightRef.current = true;
                                forceUpdate(prev => prev + 1);
                            }}
                            onBlur={() => {
                                nameHighlightRef.current = false;
                                forceUpdate(prev => prev + 1);
                            }}
                            onChangeText={(text) => setWheelName(text)}
                        />
                    </View>

                    {/* Add item input */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                        <Text style={{ fontSize: 25, fontWeight: 600, color: theme.contrast_text_color }}>{t['Add Item']}</Text>
                        
                    </View>

                    {/* Color picker */}
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.secondary_color, padding: 15, borderRadius: 50 }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setAddByListModalVisible(true);
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: '500', color: theme.text_color }}>{t['Add by list']}</Text>
                        </TouchableOpacity>


                        {/* Add button */}
                        {/* <TouchableOpacity
                            style={{ width: '30%', padding: 15, backgroundColor: theme.secondary_color, borderRadius: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleAddItem();
                            }}
                        >
                            <CheckIcon width={25} height={25} fill={theme.text_color} />
                            <Text style={{ fontSize: 20, fontWeight: '500', color: theme.text_color }}>{t['Add']}</Text>
                        </TouchableOpacity> */}

                        <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 500, color: theme.contrast_text_color }}>{t['or']}</Text>
                        <TouchableOpacity
                            style={{ marginTop: 10, borderWidth: 1, borderColor: theme.secondary_color, width: '100%', paddingVertical: 10, overflow: 'hidden', backgroundColor: theme.primary_color, borderRadius: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setColorPickerModalVisible(true);
                            }}
                        >
                            <Text style={{ paddingLeft: 15, fontSize: 20, fontWeight: 600, color: theme.text_color }}>{t['Color']}</Text>
                            <View style={{
                                width: 35, height: 35, borderRadius: 100, marginLeft: 'auto', marginRight: 15,
                                backgroundColor: selectedColor
                            }} />
                            <TouchableOpacity
                                style={{ width: '20%', height: '300%', backgroundColor: theme.secondary_color, top: 0, left: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    Vibration.vibrate(50);
                                    handleAddItem();
                                }}
                            >
                                <CheckIcon width={25} height={25} fill={theme.text_color} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>



                    {/* Items list */}
                    <Text style={{ fontSize: 25, fontWeight: 600, marginTop: 25, color: theme.text_color }}>{t['Items']}</Text>
                        

                    <ScrollView
                        style={{ marginTop: 10, minHeight: 100 }}
                        contentContainerStyle={{ gap: 10 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {itemsRef.current.map((item, index) => (
                            <View
                                key={index}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.primary_color, borderRadius: 15, borderWidth: 1, borderColor: itemsHighlightRef.current[index] ? theme.secondary_color : theme.primary_color, overflow: 'hidden' }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                    <View style={{ width: '30%', height: 50, backgroundColor: item.color }} />
                                    <TextInput
                                        style={{ flex: 1, color: theme.text_color, marginLeft: 10, fontSize: 16, fontWeight: 500, backgroundColor: theme.primary_color, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 15 }}
                                        placeholder="Item's name"
                                        placeholderTextColor={'rgba(255,255,255,0.5)'}
                                        value={item.content}
                                        onFocus={() => {
                                            itemsHighlightRef.current[index] = true;
                                            forceUpdate(prev => prev + 1);
                                        }}
                                        onBlur={() => {
                                            itemsHighlightRef.current[index] = false;
                                            forceUpdate(prev => prev + 1);
                                        }}
                                        onChangeText={(text) => handleChangeItemName(text, index)}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => {
                                    Vibration.vibrate(50);
                                    handleDeleteItem(index);
                                }} style={{ paddingHorizontal: 15 }}>
                                    <TrashIcon width={20} height={20} fill={theme.text_color} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Bottom buttons */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <TouchableOpacity
                            style={{ width: '47%', backgroundColor: theme.secondary_color, padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                setWheelDemoModalVisible(true);
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: '500', color: theme.text_color, textAlign: 'center' }}>{t['Demo']}</Text>
                            <EyeIcon width={30} height={30} fill={theme.text_color} style={{marginLeft: 10}} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: '47%', backgroundColor: theme.secondary_color, padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: wheelName ? 1 : 0.6 }}
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleSaveWheel();
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: '500', color: theme.text_color, textAlign: 'center' }}>{t['Save']}</Text>
                            <SaveIcon width={20} height={20} fill={theme.text_color} style={{marginLeft: 10}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Sub modals */}
            {colorPickerModalVisible && (
                <ColorPickerModal
                    colorPickerModalVisible={colorPickerModalVisible}
                    setColorPickerModalVisible={setColorPickerModalVisible}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    t={t}
                />
            )}
            {wheelDemoModalVisible && (
                <WheelDemoModal
                    wheelDemoModalVisible={wheelDemoModalVisible}
                    setWheelDemoModalVisible={setWheelDemoModalVisible}
                    items={itemsRef.current}
                    t={t}
                />
            )}
            {addByListModalVisible && (
                <AddByListModal
                    addByListModalVisible={addByListModalVisible}
                    setAddByListModalVisible={setAddByListModalVisible}
                    items={itemsRef.current}
                    setItems={(newItems: any) => {
                        itemsRef.current = newItems;
                        forceUpdate(prev => prev + 1);
                    }}
                    t={t}
                    selectedColors={itemsRef.current.map(item => item.color)}
                />
            )}

            {/* Alerts */}
            {attemptedSubmit && missingItem && (
                <Alert
                    alertVisible={attemptedSubmit}
                    setAlertVisible={() => setAttemptedSubmit(false)}
                    setAttemptedSubmit={setAttemptedSubmit}
                    message="There must be at least 2 items!"
                />
            )}

            {!wheelName && attemptedSubmit && 
                <Alert 
                    alertVisible={attemptedSubmit} 
                    setAlertVisible={() => {}} 
                    setAttemptedSubmit={setAttemptedSubmit} 
                    message={"Please fill wheel's name!"} 
                />
            }

        </>
    );
};

export default AddItemsModal;
