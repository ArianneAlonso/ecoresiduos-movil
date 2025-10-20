import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Header = () => {
  
  return (
    <View style={styles.headerContainer}>
      <Chip
        icon={() => <MaterialCommunityIcons name="leaf" size={20} color="#fff" />}
        style={styles.chip}
        textStyle={{ color: '#fff', fontWeight: 'bold' }}
      >
        1500 Ecopuntos
      </Chip>
      <IconButton
        icon={() => <MaterialCommunityIcons name="bell-outline" size={28} />}
        onPress={() => console.log('Notificaciones')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  chip: {
    backgroundColor: '#fdd835', 
  },
});

export default Header;