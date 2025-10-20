import * as React from 'react';
import { View, Text, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
// Asegúrate de que la ruta de importación sea correcta según tu estructura
import { CustomButton } from '../../components/CustomButton';
// Si utilizas React Navigation, necesitarás tipar las props de navegación.
// Esto es un ejemplo general, puedes necesitar adaptarlo a tu Stack Navigator.
import { StackScreenProps } from '@react-navigation/stack';

// Define tus tipos de navegación aquí si es necesario (ejemplo)
type RootStackParamList = {+
  Welcome: undefined;
  Login: undefined;
  // Otros nombres de pantalla...
};

// Adaptamos el tipado para usar React.FC si no se utiliza StackScreenProps
// Si se usa React Navigation, esta es la forma preferida de tipar las props.
type WelcomeScreenProps = StackScreenProps<RootStackParamList, 'Welcome'>;


// Nota: Usamos la imagen subida como referencia visual.
const ROBOT_IMAGE_URL = 'https://i.ibb.co/L5k6Y60/Eco-Residuos-Mobile-6.jpg'; 

/**
 * Pantalla de Bienvenida (WelcomeScreen) tipada con TypeScript.
 * Implementa un diseño responsivo utilizando NativeWind.
 */
// Exportamos el componente tipado
export default function WelcomeScreen({ navigation }: WelcomeScreenProps): React.JSX.Element {
  
  // Función de ejemplo tipada para la navegación
  const handleStart = () => {
    console.log('Navegar a la pantalla de Registro/Login');
    // Si usas React Navigation, el código sería:
    // navigation.navigate('Login'); 
  };

  // Obtenemos el alto de la ventana para asegurar la responsividad vertical
  const { height } = Dimensions.get('window');

  return (
    // ScrollView permite el desplazamiento en pantallas pequeñas
    <ScrollView 
      contentContainerStyle={{ minHeight: height }}
      className="bg-white flex-1"
      // Desactiva la barra de scroll si no es necesario
      showsVerticalScrollIndicator={false}
    >
      <View 
        // flex-1 para ocupar todo el espacio, justify-between para empujar el botón abajo
        className="flex-1 p-6 items-center justify-between"
      >
        <StatusBar barStyle="dark-content" />

        {/* 1. Logo/Título Principal */}
        <View className="w-full mt-12 mb-4 items-center">
          <Text 
            className="text-xl font-bold text-gray-800 tracking-wider"
          >
            EcoResiduos
          </Text>
        </View>

        {/* 2. Área de Contenido Central (Responsivo) */}
        <View className="flex-col items-center flex-grow justify-center py-8 md:py-16">
          
          {/* Título y Subtítulo */}
          <View className="mb-8 items-center">
            <Text 
              // Responsividad: text-2xl en móvil, text-4xl en pantallas grandes
              className="text-2xl md:text-4xl font-extrabold text-lime-600 text-center"
            >
              Gestiona y aprovecha
            </Text>
            <Text 
              className="text-xl font-semibold text-gray-700 text-center mt-1"
            >
              tus residuos
            </Text>
          </View>

          {/* Imagen del Robot */}
          <Image
            source={{ uri: ROBOT_IMAGE_URL }}
            // Dimensiones responsivas para adaptarse mejor al tamaño de la imagen subida
            className="w-64 h-80 md:w-80 md:h-96 my-8"
            resizeMode="contain"
          />

          {/* Mensaje Inferior */}
          <Text 
            className="text-base md:text-lg text-gray-600 text-center px-4 mt-4"
          >
            Nosotros convertimos tus residuos en oportunidades
          </Text>
        </View>

        {/* 3. Botón de Acción */}
        <View 
          // Limita el ancho del botón en pantallas grandes
          className="w-full max-w-sm mb-8"
        >
          <CustomButton 
            title="Comenzar" 
            onPress={handleStart}
          />
        </View>

      </View>
    </ScrollView>
  );
}
