import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StatusBar, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import Screens from src
import HomeScreen from './src/screens/HomeScreen';
import ImageDetectionScreen from './src/screens/ImageDetectionScreen';
import VideoDetectionScreen from './src/screens/VideoDetectionScreen';
import LiveDetectionScreen from './src/screens/LiveDetectionScreen';
import LocationScreen from './src/screens/LocationScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import AboutScreen from './src/screens/AboutScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen 
        name="AdminLogin" 
        component={AdminLoginScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Image') {
            iconName = focused ? 'image' : 'image-outline';
          } else if (route.name === 'Video') {
            iconName = focused ? 'video' : 'video-outline';
          } else if (route.name === 'Live') {
            iconName = focused ? 'play' : 'play-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'lock' : 'lock-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarLabel: route.name,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Image"
        component={ImageDetectionScreen}
        options={{
          title: 'Image Detection',
        }}
      />
      <Tab.Screen
        name="Video"
        component={VideoDetectionScreen}
        options={{
          title: 'Video Detection',
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveDetectionScreen}
        options={{
          title: 'Live Detection',
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminLoginScreen}
        options={{
          title: 'Admin',
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <PaperProvider>
          <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="UserApp"
          >
            <Stack.Screen
              name="UserApp"
              component={UserStack}
              options={{
                animationEnabled: false,
              }}
            />
            <Stack.Screen
              name="AdminLogin"
              component={AdminLoginScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{
                animationEnabled: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
