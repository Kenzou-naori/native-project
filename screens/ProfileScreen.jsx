import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React from "react";

const ProfileScreen = ({
  value,
  onChangeText,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
}) => {
  return (
    <View className="mt-6 bg-[#5A9CFF]">
      <View className="bg-white rounded-t-3xl h-full mt-6 p-5 -mb-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-col justify-center items-center my-5">
            {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
            <Image
              source={require("../assets/images/tsugumiicon.jpg")}
              className="w-52 h-52 rounded-full"
            />
            <View className="mt-4">
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={"abdulnaufalmz@gmail.com"}
                autoCapitalize={autoCapitalize}
                keyboardType="email-address"
                secureTextEntry={secureTextEntry}
              />
            </View>
            <View className="mt-4">
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={"Naufal Muhammad Zahran"}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    color: "#333",
    borderWidth: 1,
    width: 350,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default ProfileScreen;
