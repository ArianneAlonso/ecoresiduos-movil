import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Svg, Path, Circle, Polygon } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define el tipo para la pila de navegación principal
type RootStackParamList = {
  Main: undefined;
  ScanQR: undefined;
  ScanResiduo: undefined;
  // Agrega aquí otras rutas de tu Stack si es necesario
};

type NavigationProps = StackNavigationProp<RootStackParamList>;

// Ícono de cámara convertido desde tu SVG
const CameraIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg height={size} width={size} viewBox="0 0 26 22">
    <Path
      d="M18.29,5.76l-.7-1.37A2.59,2.59,0,0,0,15.29,3H10.71a2.59,2.59,0,0,0-2.3,1.39l-.7,1.37a2.6,2.6,0,0,1-2.3,1.39H3.58A2.57,2.57,0,0,0,1,9.71V20.44A2.57,2.57,0,0,0,3.58,23H22.42A2.57,2.57,0,0,0,25,20.44V9.71a2.57,2.57,0,0,0-2.58-2.56H20.59A2.6,2.6,0,0,1,18.29,5.76Z"
      transform="translate(0 -2)"
      fill={color}
    />
    <Circle r="4.49" cy="12.99" cx="13" fill="#FFF" />
  </Svg>
);

// Ícono de residuo (paisaje) convertido desde tu SVG
const ResiduoIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg height={size} width={size} viewBox="0 0 26 22">
    <Polygon
      points="8.08 10 1 21 25 21 18.09 12.66 13.78 17.45 8.08 10"
      fill={color}
    />
    <Circle r="3" cy="4" cx="8" fill={color} />
  </Svg>
);

export const CustomTabBarButton = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const qrButtonStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65],
        }),
      },
    ],
  } as const;

  const residuoButtonStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -120],
        }),
      },
    ],
  } as const;

  const handleNavigation = (screenName: 'ScanQR' | 'ScanResiduo') => {
    toggleMenu(); // Cierra el menú al navegar
    navigation.navigate(screenName);
  }

  return (
    <View style={styles.container}>
       <Animated.View style={[styles.secondaryButton, residuoButtonStyle]}>
        <TouchableOpacity onPress={() => handleNavigation('ScanResiduo')}>
          <ResiduoIcon color="#FFF" size={24} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.secondaryButton, qrButtonStyle]}>
        <TouchableOpacity onPress={() => handleNavigation('ScanQR')}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton} activeOpacity={0.9}>
        <Animated.View style={rotation}>
            <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -30, // Sube el botón para que flote sobre la barra
  },
  menuButton: {
    backgroundColor: '#34c339',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  secondaryButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34c339',
  },
});