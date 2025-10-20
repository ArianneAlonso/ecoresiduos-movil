import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function LoginRegisterScreen() {
  const [activeTab, setActiveTab] = useState('inicio'); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [createUsername, setCreateUsername] = useState('');
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [role, setRole] = useState('');


  const handleLogin = () => {
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
  };

  const handleRegister = () => {
    console.log('Usuario a crear:', createUsername);
    console.log('Correo:', email);
    console.log('Contraseña a crear:', createPassword);
    console.log('Rol:', role);
  };

  const handleForgotPassword = () => {
    console.log('Olvidé la contraseña');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.tabContainer}>
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
            <Text style={styles.inputLabel}>Usuario</Text>
            <TextInput
              mode="outlined"
              label="Usuario"
              value={username}
              onChangeText={setUsername}
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
            >
              Ingresar
            </Button>
          </View>
        ) : 
        ( <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Crear usuario</Text>
            <TextInput
              mode="outlined"
              label="Crear usuario"
              value={createUsername}
              onChangeText={setCreateUsername}
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
              left={<TextInput.Icon icon="lock-outline" />}
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              theme={{ colors: { primary: '#9ccc65', onSurfaceVariant: '#666' } }}
            />
           
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
            >
              Registrar
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