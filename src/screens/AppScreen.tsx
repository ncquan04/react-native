import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../contexts/LanguageContext';
import HistoryIcon from '../../assets/icons/HistoryIcon';
import AddIcon from '../../assets/icons/AddIcon';
import TrashIcon from '../../assets/icons/TrashIcon';
import LuckyWheel from '../components/LuckyWheel';
import LuckyWheelModal from '../modals/LuckyWheelModal';

const AppScreen = () => {
  const {t} = useContext(LanguageContext);
  const [LuckyWheelModalVisible, setLuckyWheelModalVisible] = useState<boolean>(false);
  const [wheelIndex, setWheelIndex] = useState<number>(0);

  const wheels = [
    {
      name: 'Yes or No',
      segments: [
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
        { content: "Yes", color: "#88dceb"},
        { content: "No", color: "#eb9d9d"},
      ]
    },
    {
      name: 'Food Choices',
      segments: [
        { content: "Pizza", color: "#FF9F1C"},
        { content: "Burger", color: "#FFBF69"},
        { content: "Sushi", color: "#CBF3F0"},
        { content: "Pasta", color: "#2EC4B6"},
        { content: "Salad", color: "#80ED99"},
        { content: "Tacos", color: "#FFCFD2"},
        { content: "Curry", color: "#FB6107"},
        { content: "Sandwich", color: "#F9C74F"},
        { content: "Ice Cream", color: "#90DBF4"},
        { content: "Steak", color: "#F94144"},
        { content: "Soup", color: "#B8C0FF"},
        { content: "Seafood", color: "#43AA8B"},
        { content: "Noodles", color: "#F8961E"},
        { content: "BBQ", color: "#A31621"},
        { content: "Dumplings", color: "#90BE6D"},
        { content: "Fried Chicken", color: "#F9844A"}
      ]
    },
    {
      name: 'Places to Visit',
      segments: [
        { content: "Paris", color: "#FF9F1C"},
        { content: "New York", color: "#FFBF69"},
        { content: "Tokyo", color: "#CBF3F0"},
        { content: "London", color: "#2EC4B6"},
        { content: "Sydney", color: "#80ED99"},
        { content: "Barcelona", color: "#FFCFD2"},
        { content: "Rome", color: "#FB6107"},
        { content: "Dubai", color: "#F9C74F"},
        { content: "Los Angeles", color: "#90DBF4"},
        { content: "Singapore", color: "#F94144"},
        { content: "Bali", color: "#B8C0FF"},
        { content: "Bangkok", color: "#43AA8B"},
        { content: "Hawaii", color: "#F8961E"},
        { content: "Istanbul", color: "#A31621"},
        { content: "Cape Town", color: "#90BE6D"},
        { content: "Rio de Janeiro", color: "#F9844A"}
      ]
    },
    {
      name: 'What to Do on a Date',
      segments: [
        { content: "Movie", color: "#FF9F1C"},
        { content: "Dinner", color: "#FFBF69"},
        { content: "Beach", color: "#CBF3F0"},
        { content: "Picnic", color: "#2EC4B6"},
        { content: "Amusement Park", color: "#80ED99"},
        { content: "Museum", color: "#FFCFD2"},
        { content: "Concert", color: "#FB6107"},
        { content: "Hike", color: "#F9C74F"},
        { content: "Bowling", color: "#90DBF4"},
        { content: "Karaoke", color: "#F94144"},
        { content: "Shopping", color: "#B8C0FF"},
        { content: "Cooking", color: "#43AA8B"},
        { content: "Road Trip", color: "#F8961E"},
        { content: "Spa", color: "#A31621"},
        { content: "Zoo", color: "#90BE6D"},
        { content: "Painting", color: "#F9844A"}
      ]
    },
    {
      name: 'What Music Genre to Listen',
      segments: [
        { content: "Pop", color: "#FF9F1C"},
        { content: "Rock", color: "#FFBF69"},
        { content: "Rap", color: "#CBF3F0"},
        { content: "Jazz", color: "#2EC4B6"},
        { content: "Classical", color: "#80ED99"},
        { content: "Country", color: "#FFCFD2"},
        { content: "EDM", color: "#FB6107"},
        { content: "Reggae", color: "#F9C74F"},
        { content: "Blues", color: "#90DBF4"},
        { content: "Metal", color: "#F94144"},
        { content: "Folk", color: "#B8C0FF"},
        { content: "Indie", color: "#43AA8B"},
        { content: "R&B", color: "#F8961E"},
        { content: "K-Pop", color: "#A31621"},
        { content: "Soul", color: "#90BE6D"},
        { content: "Techno", color: "#F9844A"}
      ]
    }
  ]

  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <Text style={{fontSize: 30, fontWeight: 500, marginTop: 10}}>{t['Wheels']}</Text>
      <View style={{flexDirection: 'row', marginTop: 20, width: '90%', justifyContent: 'space-between'}}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}>
          <AddIcon width={30} height={30} fill={'white'} />
          <Text style={{fontSize: 17, fontWeight: 500, color: 'white', marginLeft: 10}}>Wheel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2ae41', padding: 10, borderRadius: 15}}>
        <HistoryIcon width={30} height={30} fill={'white'} />
          <Text style={{fontSize: 17, fontWeight: 500, color: 'white', marginLeft: 10}}>History</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{width: '100%', marginTop: 20}}>
        {wheels.map((wheel, index) => {
          return (
            <TouchableOpacity 
              key={index}
              style={{flexDirection: 'column', justifyContent: 'space-between', width: '78%', padding: 15, height: 150, backgroundColor: '#305b69', borderRadius: 30, marginLeft: 20, marginTop: 20, position: 'relative'}}
              onPress={async () => {
                await setWheelIndex(index)
                setLuckyWheelModalVisible(true)
              }}
            >
              <View style={{width: '95%'}}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{color: 'white', fontSize: 20, fontWeight: 600, width: '70%'}}>{wheel.name}</Text>
              </View>
              <TouchableOpacity>
                <TrashIcon width={30} height={30} fill={'white'} />
              </TouchableOpacity>
                <View style={{position: 'absolute', top: -10, right: -50}}>
                <LuckyWheel 
                  segments={wheel.segments.map(segment => ({ ...segment, content: "" }))} 
                  radius={75}
                />
                </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <LuckyWheelModal
        LuckyWheelModalVisible={LuckyWheelModalVisible}
        setLuckyWheelModalVisible={setLuckyWheelModalVisible}
        luckyWheel={wheels[wheelIndex]}
      />
    </View>
  )  
}

export default AppScreen