import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
// --- Pantallas ---
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginRegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScanScreen from './src/screens/ScanScreen';
// --- Creación de navegadores ---
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// --- Navegador principal de pestañas ---
const MainAppTabs = () => {
  return (
    <Tab.Navigator id={undefined}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#34c339ff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';

          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'ScanTab') iconName = 'qrcode-scan';
          else if (route.name === 'ProfileTab') iconName = 'account-circle';

          return <Icon source={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanScreen}
        options={{ title: 'Escanear' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};
// --- Navegador principal de la app ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="Welcome">
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
        <Stack.Screen
          name="Main"
          component={MainAppTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
