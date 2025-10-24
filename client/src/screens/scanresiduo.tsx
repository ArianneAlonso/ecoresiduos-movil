import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanResiduoScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantalla de Escaneo de Residuos</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});

export default ScanResiduoScreen;