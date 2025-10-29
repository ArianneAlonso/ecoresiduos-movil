import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// --- ¡IMPORTANTE! ---
// Esta IP es la de tu PC, lo cual es correcto.
const PYTHON_AI_API_URL = 'http://192.168.1.56:8000';
// --------------------

export default function ScanResiduoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // Solicitar permiso de cámara al cargar la pantalla
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  /**
   * Se llama al presionar el botón de escanear.
   * Toma una foto, la envía al backend de IA y muestra el resultado.
   */
  const handleScan = async () => {
    if (loading || !cameraRef.current) return;

    setLoading(true);
    setScanned(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7, // Calidad media
      });

      if (!photo || !photo.uri) {
        throw new Error("No se pudo tomar la foto.");
      }

      // 1. Crear el FormData para enviar la imagen como un archivo
      const formData = new FormData();
      
      // El 'file' debe coincidir con el nombre que espera tu backend en Python
      // (ej. async def upload_image(file: UploadFile = File(...)))
      formData.append('file', {
        uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        type: 'image/jpeg', // El backend acepta jpeg y png
        name: 'scan.jpg',
      } as any);


      // 2. Enviar la imagen al backend de IA
      // --- ¡CAMBIO AQUÍ! ---
      // Apuntamos al endpoint correcto que definiste en 'images_controllers.py'
      const response = await fetch(`${PYTHON_AI_API_URL}/upload-image/`, {
        method: 'POST',
        body: formData,
        // No es necesario 'Content-Type': 'multipart/form-data', 
        // fetch lo pone automáticamente con FormData
      });

      // --- FIN DEL CAMBIO ---

      if (!response.ok) {
        // Si el servidor devuelve un error (4xx o 5xx), léelo
        const errorData = await response.json(); // FastAPI devuelve JSON en errores
        throw new Error(`Error del servidor: ${errorData.detail || 'Error desconocido'}`);
      }

      const data = await response.json();

      // 3. Tu backend devuelve: {"result": "texto de la IA"}
      // Así que leemos 'data.result'
      setScanResult(data.result || 'Resultado no reconocido');

    } catch (error) {
      console.error('Error durante el escaneo:', error);
      // Mostramos el mensaje de error en el modal
      // 'error.message' incluirá el 'Network request failed' o el 'Error del servidor'
      setScanResult(`Error al clasificar: ${error.message}`);
    } finally {
      setLoading(false);
      setShowResultModal(true); // Mostrar el modal con el resultado (o el error)
    }
  };

  /**
   * Cierra el modal de resultados y permite un nuevo escaneo.
   */
  const closeResultModal = () => {
    setShowResultModal(false);
    setScanResult(null);
    setScanned(false); // Permitir escanear de nuevo
  };

  // Vistas condicionales (permisos, carga)
  if (!permission) {
    return <View />; // Vista vacía mientras se cargan los permisos
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Necesitamos tu permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        <View style={styles.scanButtonContainer}>
          <TouchableOpacity
            style={[styles.scanButton, (loading || scanned) && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={loading || scanned}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <View style={styles.scanButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* --- Modal de Resultados (Estilo "Bottom Sheet" como la foto) --- */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeResultModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeResultModal}
          />
          <View style={styles.modalContent}>
            <Text style={styles.resultTitle}>Residuo Detectado</Text>
            <Text style={[
                styles.resultText, 
                scanResult?.startsWith('Error') && styles.resultErrorText
            ]}>
              {scanResult || '...'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeResultModal}
            >
              <Text style={styles.closeButtonText}>Escanear Otro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'white',
  },
  scanButtonDisabled: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    borderColor: '#888',
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  // Estilos del Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Alinea el contenido al final (abajo)
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, // Sombra hacia arriba
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resultText: {
    fontSize: 20,
    color: '#1A535C', // Un color verde/azul oscuro
    marginBottom: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Estilo para mostrar texto de error
  resultErrorText: {
    color: '#D90429', // Un color rojo para errores
    fontWeight: '400',
  },
  closeButton: {
    backgroundColor: '#4CAF50', // Verde
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});