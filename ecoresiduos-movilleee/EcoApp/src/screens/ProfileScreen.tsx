import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, useTheme, Card, IconButton, Button } from 'react-native-paper';

const { width } = Dimensions.get('window');
type ActiveTab = 'Logros' | 'Estadisticas';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('Logros');

  const renderContent = () => {
    switch (activeTab) {
      case 'Logros':
        return (
          <View style={styles.tabContentCard}>
            <Text style={styles.tabContentText}>Contenido de Logros</Text>
          </View>
        );
      case 'Estadisticas':
        return (
          <View style={styles.tabContentCard}>
            <Text style={styles.tabContentText}>Contenido de Estadísticas</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBackground}>
          <IconButton
            icon="cog"
            color="#fff" 
            size={24}
            onPress={() => navigation.navigate('Settings')} 
            style={styles.settingsIcon}
          />

          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../../assets/images/EcoSaludo.png')}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.username}>NombreUsuario</Text>
          </View>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>1500</Text>
              <Text style={styles.statLabel}>Ecopuntos</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>20</Text>
              <Text style={styles.statLabel}>Logros</Text>
            </View>
          </View>
        </Card>

        <View style={styles.tabsContainer}>
          <Button
            mode={activeTab === 'Logros' ? 'contained' : 'text'}
            onPress={() => setActiveTab('Logros')}
            style={[styles.tabButton, activeTab === 'Logros' && { backgroundColor: '#34c339ff' }]}
            labelStyle={[styles.tabText, activeTab === 'Logros' && { color: '#fff' }]}
            theme={{ colors: { primary: '#34c339ff' } }}
          >
            Logros
          </Button>
          <Button
            mode={activeTab === 'Estadisticas' ? 'contained' : 'text'}
            onPress={() => setActiveTab('Estadisticas')}
            style={[styles.tabButton, activeTab === 'Estadisticas' && { backgroundColor: '#34c339ff' }]}
            labelStyle={[styles.tabText, activeTab === 'Estadisticas' && { color: '#fff' }]}
            theme={{ colors: { primary: '#34c339ff' } }}
          >
            Estadísticas
          </Button>
        </View>

        {renderContent()}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9ccc65',
  },
  settingsIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -50,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 10,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: -50,
    paddingVertical: 20,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statSeparator: {
    width: 1,
    height: '80%',
    backgroundColor: '#eee',
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  tabButton: {
    borderRadius: 25,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  tabContentCard: {
    minHeight: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  tabContentText: {
    textAlign: 'center',
  },
});

export default ProfileScreen;