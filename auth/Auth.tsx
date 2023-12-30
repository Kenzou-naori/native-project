// In App.js in a new project

import * as React from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import SettingsScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const homeName = "Home";
const scheduleName = "Schedule";
const settingsName = "History";
const profileName = "Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FirstScreen() {
  return(

  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === homeName) {
          iconName = focused ? "home" : "home-outline";
        } else if (rn === scheduleName) {
          iconName = focused ? "calendar" : "calendar-outline";
        } else if (rn === settingsName) {
          iconName = focused ? "reorder-four" : "reorder-four-outline";
        } else if (rn === profileName) {
          iconName = focused ? "person-circle" : "person-circle-outline";
        }

        return <Ionicons  size={size} color={color} name={iconName} />;
      },
      activeTintColor: "#5686E1",
      inactiveTintColor: "grey",
      labelStyle: { paddingBottom: 5, fontSize: 10 },
      style: { padding: 30, height: 80 },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <Tab.Screen
      name={scheduleName}
      component={ScheduleScreen}
      options={{
        headerShown: false,
      }}
    />
    <Tab.Screen
      name={settingsName}
      component={SettingsScreen}
      options={{
        headerShown: false,
      }}
    />
    <Tab.Screen
      name={profileName}
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
  </Tab.Navigator>
  )

}


function Auth() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={FirstScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Auth;
