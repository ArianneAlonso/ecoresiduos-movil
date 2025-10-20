import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Divider,
  Button,
  List,
  Switch,
  PaperProvider,
  useTheme,
} from 'react-native-paper';

type Theme = {
  colors: {
    background: string;
    primary: string;
    onPrimary: string;
    surface: string;
    onSurface: string;
    outline: string;
  };
};

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const theme = useTheme<Theme>();

  const onToggleSwitch = () => setIsNotificationsEnabled(!isNotificationsEnabled);

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header elevated>
        <Appbar.Content title="Ajustes" />
      </Appbar.Header>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            Cuenta
          </Text>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <List.Item
              title="Editar Perfil"
              onPress={() => console.log('Navegar a Editar Perfil')}
              style={styles.listItem}
              titleStyle={{ color: theme.colors.onSurface }}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Cambiar Contraseña"
              onPress={() => console.log('Navegar a Cambiar Contraseña')}
              style={styles.listItem}
              titleStyle={{ color: theme.colors.onSurface }}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Correo Electrónico"
              onPress={() => console.log('Navegar a Correo Electrónico')}
              style={styles.listItem}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            Preferencias
          </Text>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <List.Item
              title="Privacidad & Datos"
              onPress={() => console.log('Navegar a Privacidad & Datos')}
              style={styles.listItem}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            Notificaciones
          </Text>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <List.Item
              title="Recibir Notificaciones"
              right={() => (
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={onToggleSwitch}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          </Card>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => console.log('Cerrar Sesión')}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonLabel}
          >
            Cerrar Sesión
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
  },
  listItem: {
    paddingLeft: 16,
  },
  divider: {
    backgroundColor: '#e0e0e0', 
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#8BC34A', 
    paddingVertical: 8,
    borderRadius: 24,
  },
  logoutButtonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;