// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/ScheduleScreen';
import SettingScreen from './screens/HistoryScreen';
import MainComponent from './navigation/MainComponent';


const Stack = createNativeStackNavigator();

function App() {
  return (
  //  <MainComponent />
  <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown:false, }} />
    <Stack.Screen name="Home" component={LoginScreen} options={{ headerShown:false, }} />
  </Stack.Navigator>
</NavigationContainer>

  );
}

export default App;