import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; 

const InspirationBanner = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/images/EcoAbout.png')}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>¿Querés descubrir qué nos inspira?</Text>
          <Text style={styles.subtitle}>
            Conocé quiénes somos y por qué hacemos lo que hacemos
          </Text>
          <Button
            mode="contained"
            onPress={() => console.log('Saber Más')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Saber Más
          </Button>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#8BC34A', 
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    width: cardWidth,
    height: cardWidth * 0.45, 
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: '100%',
  },
  image: {
    width: '45%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
  },
});

export default InspirationBanner;