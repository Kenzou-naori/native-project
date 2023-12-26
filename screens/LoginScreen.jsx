import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="bg-white h-full w-full">
      <StatusBar backgroundColor="#5A9CFF" style="light" />
      <SafeAreaView className="bg-[#5A9CFF] h-[93%] p-5 rounded-b-[70]">
        <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
          <View className="flex items-center">
            <Animated.Text
              entering={FadeInUp.duration(1000).springify()}
              className="text-white font-bold tracking-wide text-3xl"
            >
              Login
            </Animated.Text>
            <Animated.Image
              className="h-96 w-96"
              entering={FadeInUp.duration(1000).springify()}
              source={require("../assets/images/work.png")}
            />
          </View>

          {/* title and form */}

          <View className="w-full flex justify-around">
            {/* Form */}
            <View className="flex items-center mx-5 space-y-4">
              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className="bg-white p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setEMail(text)}
                  placeholderTextColor={"gray"}
                  keyboardType="email-address"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className="bg-white p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  placeholderTextColor={"gray"}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
                className="bg-white p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholderTextColor={"gray"}
                  secureTextEntry
                />
              </Animated.View>
              <Animated.View
                className="w-full"
                entering={FadeInDown.delay(400).duration(1000).springify()}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("Home")}
                  className="bg-[#3170E8] w-full p-3 rounded-2xl mb-3"
                >
                  <Text
                    className="text-xl font-bold text-white text-center"
                    onPress={() => navigation.push("Signup")}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
