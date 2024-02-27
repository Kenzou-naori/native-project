// In App.js in a new project
import CustomDrawer from "../layout/CustomDrawer";
import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Karyawan/HomeScreen";
import SettingsScreen from "../screens/Karyawan/HistoryScreen";
import CutiScreen from "../screens/Karyawan/CutiHistoryScreen";
import WebAdmin from "../screens/HRD/KelolaAbsensi";
import ManageIP from "../screens/Admin/ManageIP";
import KelolaKaryawan from "../screens/Admin/KelolaKaryawan";
import KelolaAbsensi from "../screens/HRD/KelolaKaryawan";
import CutiKaryawan from "../screens/HRD/CutiKaryawan";
import PengaduanUser from "../screens/Admin/Pengaduan";
import UserScreen from "../screens/Karyawan/UserScreen";


import { MD2LightTheme, PaperProvider } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useColorScheme } from "nativewind";

const homeName = "Dasbor";
const scheduleName = "Schedule";
const settingsName = "Riwayat Presensi";
const profileName = "Profil";
const cutiName = "Riwayat Cuti";
const WebAdminName = "Dashboard";
const ManageIPName = "Manage Lokasi";
const KelolaKaryawanName = "Kelola Karyawan";
const CutiKaryawanName = "Cuti Karyawan";
const PengaduanName = "Pengaduan User";
const UserScreenName = "Me"

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
    myOwnColor: "#212121",
  },
};

function MyDrawer() {
  return (
    <PaperProvider theme={theme}>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: styles.drawerStyle,
          headerStyle: styles.topbar,
          drawerInactiveTintColor: 'gray',
          drawerActiveTintColor: 'lightgray',
          drawerActiveBackgroundColor: 'gray',
          headerTintColor : 'white',
          drawerType : 'permanent',
          headerShown : false,
          headerTitleStyle : {
            color :'black',
            
          }
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name={KelolaKaryawanName} component={KelolaKaryawan} />
        <Drawer.Screen name={ManageIPName} component={ManageIP} />
        <Drawer.Screen name={PengaduanName} component={PengaduanUser} />
      </Drawer.Navigator>
    </PaperProvider>
  );
}

function HRDScreen() {
  return (
    <PaperProvider theme={theme}>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: styles.drawerStyle,
          headerStyle: styles.topbar,
          drawerInactiveTintColor: 'gray',
          drawerActiveTintColor: 'lightgray',
          drawerActiveBackgroundColor: 'gray',
          headerTintColor : 'white',
          drawerType : 'permanent',
          headerShown : false,
          headerTitleStyle : {
            color :'black',
            
          }
        }}
        
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name={WebAdminName} component={WebAdmin} />
        <Drawer.Screen name={KelolaKaryawanName} component={KelolaAbsensi} />
        <Drawer.Screen name={CutiKaryawanName} component={CutiKaryawan} />
      </Drawer.Navigator>
    </PaperProvider>
  );
}

function FirstScreen() {
  const { colorScheme } = useColorScheme();

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
          } else if (rn === cutiName) {
            iconName = focused ? "walk-outline" : "walk-outline";
          } else if (rn === UserScreenName) {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons size={size} color={color} name={iconName!} />;
        },
        tabBarStyle: {
          backgroundColor: colorScheme === "light" ? "#DEE9FD" : "#212121",
          marginHorizontal: 20,
          marginBottom: 14,
          borderRadius: 50,
          position: "absolute",
          shadowColor: colorScheme === "dark" ? "#DEE9FD" : "#212121",
          shadowOpacity: 1,
          elevation: 2,
        },
        // tabBarShowLabel: false
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
        name={cutiName}
        component={CutiScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={UserScreenName}
        component={UserScreen}
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={FirstScreen} />
        <Stack.Screen name="Admin" component={MyDrawer} />
        <Stack.Screen name="HRD" component={HRDScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: 260,
    backgroundColor: "transparent",
  },
  topbar: {
    backgroundColor: "#f1f6ff",
  },
});
export default Auth;
