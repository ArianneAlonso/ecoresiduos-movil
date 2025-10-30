import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import api from '../../servicies/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  token: string;
  role: string;
}

export default function LoginRegisterScreen() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'registro'>('inicio');

  // Estados para Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estados para Registro
  const [createUsername, setCreateUsername] = useState('');
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [zone, setZone] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Estado de Carga y Errores
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Navegación
  const navigation = useNavigation<any>();

  // Obtener ubicación automáticamente al cambiar a la pestaña de registro
  useEffect(() => {
    if (activeTab === 'registro') {
      getLocationAndZone();
    }
  }, [activeTab]);

  const getLocationAndZone = async () => {
    setLoadingLocation(true);
    setErrorMessage(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permiso de ubicación denegado.');
        setZone('Desconocida');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        'Desconocida';

      setZone(city);
    } catch (err) {
      console.error('Error al obtener la ubicación:', err);
      setErrorMessage('Error al obtener la ubicación.');
      setZone('Desconocida');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const apiResponse = (await api.login({ email: username, password })) as unknown as LoginResponse;
      
      console.log('Respuesta COMPLETA de la API:', apiResponse);

      if (!apiResponse || !apiResponse.token) {
        throw new Error('Respuesta inválida de la API, no se encontró token.');
      }
      
      const token = apiResponse.token;
      const userRole = apiResponse.role;

      if (token) {
        await AsyncStorage.setItem('userToken', token);
      }
      if (userRole) {
        await AsyncStorage.setItem('userRole', userRole);
      }

      if (userRole === 'driver') {
        navigation.navigate('ConductorHome');
      } else {
        navigation.navigate('Main');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      setErrorMessage(error.response?.data?.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    if (!createUsername || !email || !createPassword || !zone) {
      setErrorMessage('Todos los campos y la zona son obligatorios');
      setLoading(false);
      return;
    }

    try {
      await api.register({
        username: createUsername,
        email,
        password: createPassword,
        zone,
      } as any);

      setCreateUsername('');
      setEmail('');
      setCreatePassword('');
      setZone('');
      setActiveTab('inicio');
      setErrorMessage('¡Éxito! Te has registrado. Ahora puedes iniciar sesión.');

    } catch (error: any) {
      console.error('Error en registro:', error);
      setErrorMessage(error.response?.data?.message || 'No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Olvidé la contraseña');
    setErrorMessage('Función de recuperación de contraseña no implementada.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => { setActiveTab('inicio'); setErrorMessage(null); }}
            style={[styles.tabButton, activeTab === 'inicio' ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={activeTab === 'inicio' ? styles.tabTextActive : styles.tabTextInactive}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setActiveTab('registro'); setErrorMessage(null); }}
            style={[styles.tabButton, activeTab === 'registro' ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={activeTab === 'registro' ? styles.tabTextActive : styles.tabTextInactive}>Registro</Text>
          </TouchableOpacity>
        </View>

        {errorMessage && (
          <Text style={[styles.messageText, errorMessage.startsWith('¡Éxito!') ? styles.successText : styles.errorText]}>
            {errorMessage}
          </Text>
        )}

        {activeTab === 'inicio' ? (
          <View style={styles.formSection}>
            <TextInput
              mode="outlined"
              label="Correo Electrónico"
              value={username}
              onChangeText={setUsername}
              disabled={loading}
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              mode="outlined"
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              disabled={loading}
              left={<TextInput.Icon icon="lock-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
            />

            <TouchableOpacity onPress={handleForgotPassword} style={{ marginBottom: 10 }}>
              <Text style={{ color: '#9ccc65' }}>Olvidé mi contraseña</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
          </View>
        ) : (
          <ScrollView style={styles.formSection}>
            <TextInput
              mode="outlined"
              label="Crear usuario"
              value={createUsername}
              onChangeText={setCreateUsername}
              disabled={loading}
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
            />

            <TextInput
              mode="outlined"
              label="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              disabled={loading}
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              mode="outlined"
              label="Crear contraseña"
              value={createPassword}
              onChangeText={setCreatePassword}
              secureTextEntry
              disabled={loading}
              left={<TextInput.Icon icon="lock-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc6F5', onSurfaceVariant: '#666' } }}
            />

            <Text style={{ marginTop: 10, color: '#666', fontSize: 14, marginBottom: 10 }}>
              Zona detectada: {loadingLocation ? 'Cargando...' : zone || 'No detectada'}
            </Text>

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#9ccc65',
  },
  tabInactive: {
    backgroundColor: '#eee',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabTextInactive: {
    color: '#333',
  },
  formSection: {
    flex: 1,
  },
  textInput: {
    marginBottom: 10,
  },
  textInputOutline: {
    borderRadius: 8,
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: '#9ccc65',
    paddingVertical: 5,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#68d32fff',
  },
  successText: {
    color: '#3f8e38ff',
  }
});

