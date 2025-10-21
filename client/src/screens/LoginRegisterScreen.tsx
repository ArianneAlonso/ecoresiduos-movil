import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native'; // <-- 1. Importá Alert
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import api from '../../servicies/api'; 

export default function LoginRegisterScreen() {
  const [activeTab, setActiveTab] = useState('inicio'); 

  // Estados para Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estados para Registro
  const [createUsername, setCreateUsername] = useState('');
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [role, setRole] = useState(''); // <-- Tuve en cuenta este campo

  // <-- 3. Estado de Carga
  const [loading, setLoading] = useState(false);
  
  // <-- 4. Obtené la navegación
  const navigation = useNavigation<any>(); // Usamos <any> para simplicidad

  // <-- 5. Función de Login MODIFICADA
  const handleLogin = async () => {
    if (loading) return; // Evitar doble click
    setLoading(true);

    try {
      // Llama a la función 'login' de tu api.ts
      const response = await api.login({ username, password });

      // Si salió bien (asumiendo que el server responde con datos)
      console.log('Login exitoso:', response.data);
      
      // Aquí podés guardar el token de usuario si tu API te da uno
      // ej: await AsyncStorage.setItem('userToken', response.data.token);

      // Navegá a la pantalla principal (definida en tu App.tsx)
      navigation.navigate('Main');

    } catch (error) {
      // Si el server da error (ej: 401 No autorizado)
      console.error('Error en login:', error);
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    } finally {
      // Se ejecuta siempre, ya sea éxito o error
      setLoading(false);
    }
  };

  // <-- 6. Función de Registro MODIFICADA
  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // (Asumiremos que tu api.ts tendrá una función 'register')
      await api.register({
        username: createUsername,
        email: email,
        password: createPassword,
        role: role || 'user', // Asignar 'user' por defecto si está vacío
      });

      // Si el registro salió bien
      Alert.alert('¡Éxito!', 'Te has registrado correctamente. Ahora puedes iniciar sesión.');
      
      // Limpiar campos y cambiar de pestaña
      setCreateUsername('');
      setEmail('');
      setCreatePassword('');
      setRole('');
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

        <View style={styles.tabContainer}>
          {/* ... (El resto de tu código de pestañas no cambia) ... */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'inicio' && styles.tabButtonActive]}
            onPress={() => setActiveTab('inicio')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'inicio' && styles.tabButtonTextActive]}>
              Inicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'registro' && styles.tabButtonActive]}
            onPress={() => setActiveTab('registro')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'registro' && styles.tabButtonTextActive]}>
              Registro
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'inicio' ? (
          <View style={styles.formSection}>
            {/* ... (Inputs de Usuario y Contraseña no cambian) ... */}
            <Text style={styles.inputLabel}>Usuario</Text>
            <TextInput
              mode="outlined"
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              disabled={loading} // <-- Desactivar si está cargando
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
            />
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              mode="outlined"
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              disabled={loading} // <-- Desactivar si está cargando
              left={<TextInput.Icon icon="lock-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
            />
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Olvidé la contraseña</Text>
            </TouchableOpacity>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              loading={loading} // <-- 7. Mostrar spinner si está cargando
              disabled={loading} // <-- Desactivar el botón
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </View>
        ) : 
        ( <View style={styles.formSection}>
            {/* ... (Inputs de Registro no cambian, solo agregá 'disabled') ... */}
            <Text style={styles.inputLabel}>Crear usuario</Text>
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
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
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
            <Text style={styles.inputLabel}>Crear contraseña</Text>
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
            {/* ... (Podrías agregar un input para 'role' si quisieras) ... */}
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              loading={loading} // <-- 7. Mostrar spinner
              disabled={loading} // <-- Desactivar
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ... (Tus estilos de 'styles' van aquí abajo, no cambian nada)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 50,
    width: '80%',
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#9ccc65',
    borderRadius: 30,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  formSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 20,
  },
  textInput: {
    width: '80%',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    height: 50,
  },
  textInputOutline: {
    borderRadius: 10,
    borderColor: 'transparent',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 5,
    marginBottom: 40,
  },
  forgotPasswordText: {
    color: '#9ccc65',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    width: '80%',
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#9ccc65',
    marginTop: 20,
  },
  loginButtonLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});