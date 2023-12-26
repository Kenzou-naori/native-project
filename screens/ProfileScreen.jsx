import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Image,
} from "react-native";
import React from "react";

const ProfileScreen = ({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
}) => {
  return (
    <View className="mt-6 bg-[#5A9CFF]">
      <View className="bg-white rounded-t-[60] h-full mt-6 p-5 -mb-6">
        <View className="flex-col justify-center items-center my-5">
          {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
          <Image
            source={require("../assets/images/tsugumiicon.jpg")}
            className="w-52 h-52 rounded-full"
          /> 
          <View className="mt-8">

          <Text style={styles.label}>Nama</Text>
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
          <View className="mt-8">

          <Text style={styles.label}>Jabatan</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={"IT Developer"}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
          />
          </View>
        </View>
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
    width:350,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default ProfileScreen;
