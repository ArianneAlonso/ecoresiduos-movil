import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import api from '../../servicies/api';

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

  // Estado de Carga
  const [loading, setLoading] = useState(false);

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
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación');
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
      setZone('Desconocida');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Función Login
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.login({ email: username, password });
      console.log('Login exitoso:', response);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  // Función Registro
  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    if (!createUsername || !email || !createPassword || !zone) {
      Alert.alert('Error', 'Todos los campos y la zona son obligatorios');
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

      Alert.alert('¡Éxito!', 'Te has registrado correctamente. Ahora puedes iniciar sesión.');
      setCreateUsername('');
      setEmail('');
      setCreatePassword('');
      setZone('');
      setActiveTab('inicio');
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Olvidé la contraseña');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('inicio')}
            style={{ marginRight: 10, padding: 8, backgroundColor: activeTab === 'inicio' ? '#9ccc65' : '#eee', borderRadius: 6 }}
          >
            <Text style={{ color: activeTab === 'inicio' ? '#fff' : '#333' }}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('registro')}
            style={{ padding: 8, backgroundColor: activeTab === 'registro' ? '#9ccc65' : '#eee', borderRadius: 6 }}
          >
            <Text style={{ color: activeTab === 'registro' ? '#fff' : '#333' }}>Registro</Text>
          </TouchableOpacity>
        </View>

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
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
          </View>
        ) : (
          <View style={styles.formSection}>
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
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
            />

            <Text style={{ marginTop: 10, color: '#666', fontSize: 14 }}>
              Zona detectada: {loadingLocation ? 'Cargando...' : zone || 'No detectada'}
            </Text>

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    padding: 20
  },
  formSection: {
    flex: 1
  },
  textInput: {
    marginBottom: 10
  },
  textInputOutline: {
    borderRadius: 8
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#9ccc65'
  },
  loginButtonLabel: {
    fontSize: 16
  },
  inputLabel: {
    marginBottom: 5,
    color: '#666'
  }
});
