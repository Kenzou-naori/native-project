// import * as React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// // Screens
// import HomeScreen from "../screens/HomeScreen";
// import ScheduleScreen from "../screens/ScheduleScreen";
// import SettingsScreen from "../screens/HistoryScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import LoginScreen from "../screens/LoginScreen";
// import SignupScreen from "../screens/SignupScreen";

// //Screen names
// const homeName = "Home";
// const scheduleName = "Schedule";
// const settingsName = "History";
// const profileName = "Profile";
// const SignupName = "Signup";
// const loginName = "Login";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function MainComponent() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         initialRouteName={homeName}
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName;
//             let rn = route.name;

//             if (rn === homeName) {
//               iconName = focused ? "home" : "home-outline";
//             } else if (rn ===scheduleName) {
//               iconName = focused ? "calendar" : "calendar-outline";
//             } else if (rn === settingsName) {
//               iconName = focused ? "reorder-four" : "reorder-four-outline";
//             } else if (rn === profileName) {
//               iconName = focused ? "person-circle" : "person-circle-outline";
//             }

//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//           activeTintColor: "#5686E1",
//           inactiveTintColor: "grey",
//           labelStyle: { paddingBottom: 5, fontSize: 10 },
//           style: { padding: 30, height: 80 },
//         })}
//       >
//         <Tab.Screen
//           name={homeName}
//           component={HomeScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Tab.Screen
//           name={scheduleName}
//           component={ScheduleScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Tab.Screen
//           name={settingsName}
//           component={SettingsScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Tab.Screen
//           name={profileName}
//           component={ProfileScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// export default MainComponent;
