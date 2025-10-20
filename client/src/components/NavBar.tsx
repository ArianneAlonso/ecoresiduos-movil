import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, Text, PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Define the type for the theme to ensure type-safety
type Theme = {
  colors: {
    primary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
  };
};

// Define las pantallas para cada ruta
const HomeScreen = () => <Text style={styles.screenText}>Pantalla de Inicio</Text>;
const ScanScreen = () => <Text style={styles.screenText}>Pantalla de Escaneo</Text>;
const ProfileScreen = () => <Text style={styles.screenText}>Pantalla de Perfil</Text>;

const NavBar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'scan', title: 'Escanear', focusedIcon: 'qrcode-scan' },
    { key: 'profile', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    scan: ScanScreen,
    profile: ProfileScreen,
  });

  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      safeAreaInsets={insets}
      barStyle={[
        styles.navBar,
        {
          backgroundColor: theme.colors.surfaceVariant, // Color del fondo del Navbar
        },
      ]}
      activeColor={theme.colors.primary} // Color de los iconos y texto activos
      inactiveColor={theme.colors.onSurfaceVariant} // Color de los iconos y texto inactivos
    />
  );
};

const styles = StyleSheet.create({
  screenText: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 20,
  },
  navBar: {
    height: 60, // Ajusta la altura si lo necesitas
  },
});

// En tu componente principal (ej. App.tsx) usa este componente
export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavBar />
      </PaperProvider>
    </SafeAreaProvider>
  );
}