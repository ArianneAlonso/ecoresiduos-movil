// ... importaciones
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginRegisterScreen'; // Importa la nueva pantalla
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome"> {/* O "Login" si quieres que esta sea la primera */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }} // También ocultamos el encabezado aquí
        />
        {/* ... otras pantallas */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}