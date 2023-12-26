import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StatusBar } from "expo-status-bar";
import {
  faCaretRight,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function DetailScreen({ navigation }) {
  return (
    <View className="mt-6 bg-[#5A9CFF]">
      <View className="p-5">
        <TouchableOpacity className="flex-row items-center">
          <View className="flex-col mr-2">
            <Text className="text-white font-bold text-2xl">Selasa,</Text>
            <Text className="text-white font-bold text-2xl">
              12 Desember 2023
            </Text>
          </View>
          <FontAwesomeIcon icon={faCaretRight} color="white" size={24} />
        </TouchableOpacity>
      </View>
      <View className="bg-white rounded-t-[60] h-full mt-6 p-5 -mb-52">
        <View className="flex-row justify-between my-5">
          <Text className="text-2xl font-bold">Tugas hari ini</Text>
          <FontAwesomeIcon icon={faPlusSquare} size={25} color="#5A9CFF" />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
          <View style={styles.card}>
            {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
            <Text className="text-sm font-semibold">12:00</Text>
            <Text style={styles.title}>Card Title</Text>
            <Text style={styles.content}>Card Content</Text>
          </View>
          {/* <ButtonAddTask onPress={() => navigation.navigate("AddTask")} /> */}
         
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "col",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    // marginLeft: 10,
  },
  content: {
    fontSize: 16,
    // marginLeft: 10,
  },
});
