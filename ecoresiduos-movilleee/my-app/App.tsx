import React from 'react';
import { SafeAreaView, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import MapaScreen from './componentes/mapa'; 
import InicioScreen from './componentes/inicio';
import EscanearScreen from './componentes/escanear';
import PerfilScreen from './componentes/perfil';

type RootTabParamList = {
  Inicio: undefined;
  Escanear: undefined;
  Mapa: undefined; 
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          tabBarActiveTintColor: "#4CAF50", // El color verde de tu UI
          tabBarInactiveTintColor: "#777",
          headerShown: false, // Mejor ocultar el header para que el mapa ocupe toda la pantalla
          tabBarStyle: { 
            backgroundColor: "#fff", 
            paddingBottom: 5, 
            paddingTop: 5,
            height: 60 
          },
        }}
      >
        <Tab.Screen 
          name="Inicio" 
          component={InicioScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={size} color={color} />,
          }}
        />

        <Tab.Screen 
          name="Escanear" 
          component={EscanearScreen} 
          options={{
            // Usamos un ícono más prominente como en tu captura
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" size={size + 6} color={color} />,
          }}
        />

        <Tab.Screen 
          name="Mapa" 
          component={MapaScreen} // 👈 Usamos el componente importado
          options={{
            title: 'Mapa',
            tabBarIcon: ({ color, size }) => <FontAwesome5 name="map-marker-alt" size={size} color={color} />,
          }}
        />
        
        <Tab.Screen 
          name="Perfil" 
          component={PerfilScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-alt" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 20 },
});