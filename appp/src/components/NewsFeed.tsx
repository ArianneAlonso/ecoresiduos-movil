import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';

type ActiveTab = 'Canjes' | 'Eventos' | 'Noticias';

const NewsFeed = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Canjes');

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={{ textAlign: 'center' }}>
          Contenido de la pestaña: {activeTab}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Button
          mode={activeTab === 'Canjes' ? 'contained' : 'text'}
          onPress={() => setActiveTab('Canjes')}
          style={styles.tabButton}
          labelStyle={styles.tabText}
        >
          Canjes
        </Button>
        <Button
          mode={activeTab === 'Eventos' ? 'contained' : 'text'}
          onPress={() => setActiveTab('Eventos')}
          style={styles.tabButton}
          labelStyle={styles.tabText}
        >
          Eventos
        </Button>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  tabButton: {
    borderRadius: 20,
    marginRight: 10,
  },
  tabText: {
    fontSize: 14,
  },
  contentContainer: {
    minHeight: 150, 
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default NewsFeed;