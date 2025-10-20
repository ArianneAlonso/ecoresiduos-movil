import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface SectionProps {
  title: string;
  iconName: string;
  backgroundColor: string;
}

const SectionCard: React.FC<SectionProps> = ({ title, iconName, backgroundColor }) => (
  <TouchableOpacity onPress={() => console.log(title)}>
    <Card style={[styles.sectionCard, { backgroundColor }]}>
      <MaterialCommunityIcons name={iconName} size={40} color="#fff" />
    </Card>
    <Text style={styles.sectionText}>{title}</Text>
  </TouchableOpacity>
);

const Sections = () => {
  return (
    <View style={styles.sectionsContainer}>
      <SectionCard title="Retiro" iconName="truck-delivery-outline" backgroundColor="#B3E5FC" />
      <SectionCard title="Mapa" iconName="map-marker" backgroundColor="#C8E6C9" />
      <SectionCard title="Canjes" iconName="gift-outline" backgroundColor="#FFCDD2" />
      <SectionCard title="Eventos" iconName="calendar-month-outline" backgroundColor="#FFECB3" />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sectionCard: {
    width: 65,
    height: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  sectionText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Sections;