import {
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
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { SignUp } from "../api/auth";

const SignupScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <View className="bg-white h-full w-full">
      <SafeAreaView className="bg-[#DEE9FD] h-[89%] p-5 rounded-b-[70px]">
        <ScrollView className="mt-6">
          <View className="flex items-center">
            <Animated.Image
              className="h-80 w-80"
              entering={FadeInUp.duration(1000).springify()}
              source={require("../assets/images/jobb.png")}
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
                entering={FadeInDown.duration(1000).springify()}
                className="bg-white p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={(text) => setFullName(text)}
                  placeholderTextColor={"gray"}
                />
              </Animated.View>
             
             
              <Animated.View
                className="w-full"
                entering={FadeInDown.delay(400).duration(1000).springify()}
              >
                <TouchableOpacity
                  onPress={() => SignUp(email, password, fullName, phone, navigation)}
                  className="bg-[#3170E8] w-full p-3 rounded-2xl mb-3"
                >
                  <Text
                    className="text-xl font-bold text-white text-center"
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
              >
                <Text className="text-gray-600 text-center">
                  Already have an account?{" "}
                  <Text
                    onPress={() => navigation.navigate("Login")}
                    className="text-[#3170E8]"
                  >
                    Login
                  </Text>
                </Text>
              </Animated.View>
            </View>
          </View>
          </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SignupScreen;
