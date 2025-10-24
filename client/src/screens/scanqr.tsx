import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Pressable } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ScanQRScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

  // Muestra una vista de carga mientras se verifican los permisos
  if (!permission) {
    return <View />;
  }

  // Si los permisos no han sido otorgados, muestra una pantalla para solicitarlos
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Necesitamos tu permiso para usar la cámara y escanear códigos QR.
        </Text>
        <Button onPress={requestPermission} title="Otorgar Permiso" />
      </View>
    );
  }

  // Función que se ejecuta cuando se detecta un código QR
  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'Código Escaneado',
      `Datos: ${data}`,
      [{ text: 'OK' }]
    );
    // Aquí puedes agregar la lógica para navegar o enviar 'data' a tu servidor
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'], // Especifica los tipos de códigos a escanear
        }}
        facing={facing}
      />
      
      {/* Superposición visual para guiar al usuario */}
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>
      
      {/* Botón para voltear la cámara */}
      <View style={styles.controlsContainer}>
        <Pressable onPress={toggleFacing} style={styles.controlButton}>
          <FontAwesome6 name="rotate" size={32} color="white" />
        </Pressable>
      </View>

      {/* Botón para escanear de nuevo después de un escaneo exitoso */}
      {scanned && (
        <View style={styles.scanAgainButton}>
          <Button title={'Escanear de Nuevo'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  controlButton: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: 'white',
    borderRadius: 5,
  }
});

export default ScanQRScreen;