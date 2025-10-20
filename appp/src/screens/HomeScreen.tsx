import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, Text } from 'react-native-paper';

import Header from '../components/Header';
import InspirationBanner from '../components/InspirationBanner';
import Sections from '../components/Sections';
import NewsFeed from '../components/NewsFeed';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#34c339ff',
  },
};

const HomeScreen = () => {
  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Header />
        <View style={styles.content}>
          <InspirationBanner />
          <Text style={styles.sectionTitle}>Secciones</Text>
          <Sections />
          <Text style={styles.sectionTitle}>Novedades</Text>
          <NewsFeed />
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;