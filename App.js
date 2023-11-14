import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

// Dimensions로 스크린의 크기를 알 수 있음
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "1ca6bf41bdcee4bf7e89179d44b98001";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);

  const [days, setDays] = useState([]);

  const getWeather = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    // 허가받지 않았다면
    if (!permission.granted) {
      setOk(false);
    }

    // 유저 위치 정보 얻기
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.list);
  };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              size="large" />
          </View>
        ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    width: "100%",
                    justifyContent: "space-between",
                  }}>
                  <Text style={styles.temp}>
                    {parseFloat(day.main.temp).toFixed(1)}
                  </Text>
                  <Fontisto  name={icons[day.weather[0].main]} size={68} color="black" />
                </View>
                
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            ))
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 38,
    fontWeight: "200"
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 30,
  },
  temp: {
    fontSize: 108,
    fontWeight: "500"
  },
  description: {
    marginTop: -10,
    fontSize: 28,
    fontWeight:"500"
  },
  tinyText: {
    fontSize: 20
  }
})