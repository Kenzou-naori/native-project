import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import storage from "../utils/storage";

interface ProfileScreenProps {
  navigation: any;
  value: string;
  onChangeText: (text: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  navigation,
  value,
  onChangeText,
  autoCapitalize = 'none',
  keyboardType = 'default',
  secureTextEntry = false,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEMail] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const dataString = await storage.load({ key: "user" });
      const data = JSON.parse(dataString);
      setEMail(data.email);
      setFullName(data.fullName);
    }

    getUserData();
  }, []);

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
                placeholder={email}
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
                placeholder={fullName}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
              />
            </View>
          </View>
          <View className="flex justify-center items-center">
            <TouchableOpacity
              onPress={async () => {
                await storage.clearMap();
                navigation.navigate("Login");
              }}
              className="bg-[#3170E8] w-full p-3 rounded-2xl mb-3"
            >
              <Text className="text-xl font-bold text-white text-center">
                Logout
              </Text>
            </TouchableOpacity>
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
