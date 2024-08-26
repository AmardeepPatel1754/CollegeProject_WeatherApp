import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location'; // Importing Location module from expo-location
import axios from 'axios'; // Importing axios for making HTTP requests

const WeatherApp = () => {
  const [city, setCity] = useState(''); // State to store the city name entered by the user
  const [weatherData, setWeatherData] = useState(null); // State to store the weather data
  const [error, setError] = useState(null); // State to store any errors that occur during fetching weather data

  // Function to fetch weather data for the entered city
  const fetchWeatherData = async (query) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=5489138f19995eb5c1f22ac442826c2d&units=metric`);
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error.response?.data || error.message);
      setError('City or location not found. Please enter a valid city name or check location.');
    }
  };

  // Function to get the current location of the device and fetch weather data for that location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setError('Permission to access location was denied.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      // Fetching weather data for the current location
      fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
    } catch (error) {
      console.error('Error getting current location:', error);
      setError('Error getting current location. Please try again.');
    }
  };

  // Function to convert wind speed from m/s to km/h
  const getWindSpeedKmH = (speed) => {
    return (speed * 3.6).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        onChangeText={(text) => setCity(text)}
        value={city}
      />
      <Button title="Get Weather" onPress={() => fetchWeatherData(`q=${city}`)} />
      <Button title="Use Current Location" onPress={getCurrentLocation} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>{weatherData.name}</Text>
          <Text style={styles.weatherText}>{weatherData.main.temp} °C</Text>
          <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>
          <Text style={styles.weatherText}>Wind Speed: {getWindSpeedKmH(weatherData.wind.speed)} km/h</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
            }}
            style={styles.weatherIcon}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
});

export default WeatherApp;
