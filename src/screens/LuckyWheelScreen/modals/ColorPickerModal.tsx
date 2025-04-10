import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Vibration } from 'react-native'
import React from 'react'
import CheckIcon from '../../../../assets/icons/CheckIcon';
import colors from '../../../constants/colors';
import { useDarkMode } from '../../../contexts/DarkModeContext';

interface ColorPickerModalProps {
    colorPickerModalVisible: boolean;
    setColorPickerModalVisible: (value: boolean) => void;
    selectedColor: string;
    setSelectedColor: (value: string) => void;
    t: any;
}

const sampleColors = [
    // White to black gradient (33 colors)
    '#FFFFFF', '#F8F8F8', '#F0F0F0', '#E8E8E8', '#E0E0E0',
    '#D8D8D8', '#D0D0D0', '#C8C8C8', '#C0C0C0', '#B8B8B8',
    '#B0B0B0', '#A8A8A8', '#A0A0A0', '#989898', '#909090',
    '#888888', '#808080', '#787878', '#707070', '#686868',
    '#606060', '#585858', '#505050', '#484848', '#404040',
    '#383838', '#303030', '#282828', '#202020', '#181818',
    '#101010', '#080808', '#000000',
    // Red variations (9 colors)
    '#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC',
    '#CC0000', '#990000', '#660000', '#330000',
    // Green variations (9 colors)
    '#00FF00', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC',
    '#00CC00', '#009900', '#006600', '#003300',
    // Blue variations (9 colors)
    '#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF',
    '#0000CC', '#000099', '#000066', '#000033',
    // Additional colors (10 colors)
    '#FFFF00', '#FF00FF', '#00FFFF', // Yellow, Magenta, Cyan
    '#FF8000', '#FF0080', '#80FF00', // Orange, Pink, Lime
    '#0080FF', '#8000FF', '#00FF80', // Light Blue, Purple, Light Green
    '#800080' // Purple
]

const ColorPickerModal = ({colorPickerModalVisible, setColorPickerModalVisible, selectedColor, setSelectedColor, t}: ColorPickerModalProps) => {
    const [selectedColorIndex, setSelectedColorIndex] = React.useState<number>(0);
    const { theme } = useDarkMode();
    
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={colorPickerModalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
                setColorPickerModalVisible(!colorPickerModalVisible)
            }}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'relative'}}>
            <TouchableWithoutFeedback
                    onPress={() => setColorPickerModalVisible(false)}
                >
                    <View style={{flex: 1, zIndex: 1}} />
                </TouchableWithoutFeedback>
                <View style={{width: '60%', height: '50%', backgroundColor: theme.background_color, position: 'absolute', top: 160, left: 20, borderRadius: 20, flexDirection: 'column', zIndex: 10}}>
                    <View style={{flex: 0.9}}>
                        <ScrollView 
                            contentContainerStyle={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 8}}
                        >
                            {sampleColors.map((color, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={{width: 35, height: 35, backgroundColor: color, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.text_color}}
                                        onPress={() => {
                                            Vibration.vibrate(50);
                                            setSelectedColorIndex(index)
                                        }}
                                    >
                                        {selectedColorIndex === index ? <CheckIcon width={20} height={20} fill={colors.text_color}/> : null}
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <TouchableOpacity 
                        style={{flex: 0.1, alignSelf: 'flex-end', paddingRight: 20, marginTop: 10}}
                        onPress={() => {
                            Vibration.vibrate(50);
                            setSelectedColor(sampleColors[selectedColorIndex])
                            setColorPickerModalVisible(false)
                        }}
                    >
                        <Text style={{fontSize: 15, fontWeight: 500, color: theme.secondary_color}}>DONE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ColorPickerModal