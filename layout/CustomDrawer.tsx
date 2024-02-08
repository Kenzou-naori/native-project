import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import storage from "../utils/storage";

const CustomDrawer = (props: any ) => {
    
    const [fullName, setFullName] = useState("");
        useEffect(() => {
            const getUserData = async () => {
                const dataString = await storage.load({ key: "user" });
                const data = JSON.parse(dataString);
                setFullName(data.fullName);
            };
    
            getUserData();
        }, []);
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={[styles.marginTop, styles.header, styles.view]}>
        <Text style={[styles.headerText]}>Halo,</Text>
        <Text style={[styles.headerText, styles.name]}>{fullName}</Text>
      </View>
      {/* list item */}
      <DrawerContentScrollView
        {...props}
        style={[styles.view, styles.marginBottom, styles.marginTop]}
      >
        <DrawerItemList {...props} style={[styles.list]} ></DrawerItemList>
      </DrawerContentScrollView>
      {/* footer */}
      <View style={[styles.view, styles.marginBottom, styles.footer]}>
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
  },
  text:{
    color:'white',
    textAlign : 'center'
  },
  view: {
    backgroundColor: "#f1f6ff",
    borderRadius: 20,
    marginHorizontal: 5,
    padding: 15,
  },
  list:{
    borderRadius: 20
  },
  header:{
    // height: 80,
    flexDirection:'column'
  },
  headerText:{
    fontSize:12,
    fontWeight: '600',
    color: 'gray',
  },
  name:{
    fontWeight:"bold",
    fontSize:14,
  },
  marginTop: {
    marginTop: 7,
  },
  marginBottom: {
    marginBottom: 7,
  },
  footer: {
    height: 70,
  },
  logout :{
    backgroundColor : 'red',
    padding : 10,
    borderRadius: 7,
  }
});

export default CustomDrawer;
