// In App.js in a new project
import CustomDrawer from "../layout/CustomDrawer";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/HistoryScreen";
import CutiScreen from "../screens/CutiHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WebAdmin from "../screens/WebAdmin";
import ManageIP from "../screens/ManageIP";
import KelolaKaryawan from "../screens/KelolaKaryawan";
import CutiKaryawan from "../screens/CutiKaryawan";
import storage from "../utils/storage";

import { MD2LightTheme, PaperProvider, useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

const homeName = "Dashboard";
const scheduleName = "Schedule";
const settingsName = "History";
const profileName = "Profile";
const cutiName = "Pengajuan Cuti";
const WebAdminName = "Dashboard";
const ManageIPName = "Manage IP";
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
		myOwnColor: "#BADA55"
	}
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
function MyDrawer() {
	return (
		<PaperProvider theme={theme}>
			<Drawer.Navigator
				screenOptions={{
					drawerStyle: styles.drawerStyle,
					headerStyle: styles.topbar
				}}
				drawerContent={props => <CustomDrawer {...props} />}>
				<Drawer.Screen name={KelolaKaryawanName} component={KelolaKaryawan} />
				<Drawer.Screen name={ManageIPName} component={ManageIP} />
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
					headerStyle: styles.topbar
				}}
				drawerContent={props => <CustomDrawer {...props} />}>
				<Drawer.Screen name={WebAdminName} component={WebAdmin} />
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
					} else if (rn === cutiName) {
						iconName = focused ? "walk-outline" : "walk-outline";
					} else if (rn === profileName) {
						iconName = focused ? "person-circle" : "person-circle-outline";
					}

					return <Ionicons size={size} color={color} name={iconName!} />;
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
					elevation: 2

					// activeTintColor: "#80acff",
					// inactiveTintColor: "black",
				},
				tabBarShowLabel: false
			})}>
			<Tab.Screen
				name={homeName}
				component={HomeScreen}
				options={{
					headerShown: false
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
					headerShown: false
				}}
			/>
			<Tab.Screen
				name={cutiName}
				component={CutiScreen}
				options={{
					headerShown: false
				}}
			/>
			<Tab.Screen
				name={profileName}
				component={ProfileScreen}
				options={{
					headerShown: false
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
		backgroundColor: "transparent"
	},
	topbar: {
		backgroundColor: "#f1f6ff"
	}
});
export default Auth;
