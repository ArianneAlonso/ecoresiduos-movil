import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { View } from 'react-native';

// --- Componentes ---
import { CustomTabBarButton } from './src/components/CustomTabBarButton'; // <-- 1. Importa el botón

// --- Pantallas ---
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginRegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScanQRScreen from './src/screens/scanqr';
import ScanResiduoScreen from './src/screens/scanresiduo';

// --- Creación de navegadores ---
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Un componente vacío para el Tab.Screen de escanear ---
const ScanScreenPlaceholder = () => <View style={{ flex: 1, backgroundColor: 'white' }} />;

// --- Navegador principal de pestañas ---
const MainAppTabs = () => {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // <-- Opcional: se ve mejor sin etiquetas
        tabBarActiveTintColor: '#34c339ff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 70,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanScreenPlaceholder} // <-- 2. Usa un componente vacío
        options={{
          tabBarButton: () => <CustomTabBarButton />, // <-- 3. Usa el botón personalizado
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// --- Navegador principal de la app ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" id={undefined}>
        {/* Pantallas iniciales sin TabBar */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Pantalla principal que contiene el TabNavigator */}
        <Stack.Screen
          name="Main"
          component={MainAppTabs}
          options={{ headerShown: false }}
        />
        {/* 4. AÑADE LAS PANTALLAS DE ESCANEO AQUÍ */}
        <Stack.Screen
          name="ScanQR"
          component={ScanQRScreen}
          options={{
            headerShown: true, // Puedes mostrar un header si quieres
            title: 'Escanear Código QR',
          }}
        />
        <Stack.Screen
          name="ScanResiduo"
          component={ScanResiduoScreen}
          options={{
            headerShown: true,
            title: 'Escanear Residuo',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}