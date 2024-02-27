import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import storage from "../utils/storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useColorScheme } from "nativewind";

const CustomDrawer = (props: any) => {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      const dataString = await storage.load({ key: "user" });
      const data = JSON.parse(dataString);
      setFullName(data.fullName);
    };

    getUserData();
  }, []);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <View
      style={
        colorScheme === "light"
          ? [styles.container]
          : colorScheme == "dark"
            ? [styles.container, styles.darkContainer]
            : [styles.container]
      }
    >
      {/* header */}
      <View
        style={
          colorScheme === "light"
            ? [styles.marginTop, styles.header, styles.view]
            : colorScheme == "dark"
              ? [styles.marginTop, styles.header, styles.view, styles.dark]
              : [styles.marginTop, styles.header, styles.view]
        }
      >
        <Text style={[styles.headerText]}>Halo,</Text>
        <Text style={[styles.headerText, styles.name]}>{fullName}</Text>
      </View>
      {/* list item */}
      <DrawerContentScrollView
        {...props}
        style={
          colorScheme === "light"
            ? [styles.view, styles.marginBottom, styles.marginTop]
            : colorScheme == "dark"
              ? [
                  styles.view,
                  styles.marginBottom,
                  styles.marginTop,
                  styles.dark,
                ]
              : [styles.view, styles.marginBottom, styles.marginTop]
        }
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* settings */}
      {/* footer */}
      <View
        style={
          colorScheme === "light"
            ? [styles.view, styles.marginBottom, styles.footer]
            : colorScheme == "dark"
              ? [styles.view, styles.marginBottom, styles.footer, styles.dark]
              : [styles.view, styles.marginBottom, styles.footer]
        }
      >
        <TouchableOpacity onPress={toggleColorScheme} style={styles.theme}>
          <Ionicons
            size={32}
            color={
              colorScheme === "dark"
                ? "#DEE9FD"
                : colorScheme == "light"
                  ? "#212121"
                  : "DEE9FD"
            }
            name={
              colorScheme === "light"
                ? "moon-outline"
                : colorScheme == "dark"
                  ? "sunny-outline"
                  : "sunny-outline"
            }
          />
          <Text
            style={[styles.headerText, styles.name, styles.marginHorizontal]}
          >
            {colorScheme === "dark"
              ? "Light Mode"
              : colorScheme == "light"
                ? "Dark Mode"
                : "Light Mode"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={
          colorScheme === "light"
            ? [styles.view, styles.marginBottom, styles.footer]
            : colorScheme == "dark"
              ? [styles.view, styles.marginBottom, styles.footer, styles.dark]
              : [styles.view, styles.marginBottom, styles.footer]
        }
      >
        <TouchableOpacity
          onPress={async () => {
            await storage.remove({ key: "user" });
            await storage.remove({ key: "token" });
            await storage.save({ key: "isLoggedin", data: false });

            // navigation.navigate("Login");
            props.navigation.replace("Login");
          }}
          style={styles.logout}
        >
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE9FD",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  view: {
    backgroundColor: "#f1f6ff",
    borderRadius: 20,
    marginHorizontal: 5,
    padding: 15,
  },
  list: {
    borderRadius: 20,
  },
  header: {
    // height: 80,
    flexDirection: "column",
  },
  dark: {
    backgroundColor: "#3a3a3a",
  },
  darkContainer: {
    backgroundColor: "#212121",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "gray",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  marginTop: {
    marginTop: 7,
  },
  marginBottom: {
    marginBottom: 7,
  },
  marginHorizontal: {
    marginHorizontal: 5,
  },
  footer: {
    height: 70,
  },
  logout: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 7,
  },
  theme: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CustomDrawer;
