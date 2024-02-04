// In App.js in a new project

import * as React from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MD2LightTheme, PaperProvider, useTheme } from "react-native-paper";


import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import SettingsScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WebAdmin from "../screens/WebAdmin";
import KelolaKaryawan from "../screens/KelolaKaryawan"
import CutiKaryawan from "../screens/CutiKaryawan"
const homeName = "Dashboard";
const scheduleName = "Schedule";
const settingsName = "History";
const profileName = "Profile";
const WebAdminName = "Admin Dashboard";
const KelolaKaryawanName = "Kelola Karyawan";
const CutiKaryawanName = "Cuti Karyawan";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const theme = {
  // Extend Material Design 2 theme

  ...MD2LightTheme, // or MD2DarkTheme

  // Specify a custom property
  myOwnProperty: true,

  // Specify a custom nested property
  colors: {
    ...MD2LightTheme.colors,
    myOwnColor: "#BADA55",
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
function MyDrawer() {
  return (
    <PaperProvider theme={theme}>

    <Drawer.Navigator>
      <Drawer.Screen name={WebAdminName} component={WebAdmin} />
      <Drawer.Screen name={KelolaKaryawanName} component={KelolaKaryawan} />
      <Drawer.Screen name={CutiKaryawanName} component={CutiKaryawan} />
    </Drawer.Navigator>
    </PaperProvider>
  );
}

function FirstScreen() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === scheduleName) {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (rn === settingsName) {
            iconName = focused ? "reader-outline" : "reader-outline";
          } else if (rn === profileName) {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons size={size} color={color} name={iconName} />;
        },
        tabBarStyle: {
          backgroundColor: "#cedfff",
          // width: 370,
          marginHorizontal: 20,
          marginBottom: 14,
          borderRadius: 50,
          position: "absolute",
          shadowColor: "black",
          shadowOpacity: 1,
          elevation: 2,
          
          // activeTintColor: "#80acff",
          // inactiveTintColor: "black",
        },
        tabBarShowLabel : false
      })}
    
    >
      <Tab.Screen
        name={homeName}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name={scheduleName}
        component={ScheduleScreen}
        options={{
          headerShown: false,
        }}
      /> */}
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
  );
}

function Auth() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}  />
        <Stack.Screen name="Home" component={FirstScreen} />
        <Stack.Screen name="Admin" component={MyDrawer}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Auth;
