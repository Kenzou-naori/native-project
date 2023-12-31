import {
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
      <StatusBar backgroundColor="#5A9CFF" style="light" />
      <SafeAreaView className="bg-[#5A9CFF] h-[98%] p-5 rounded-b-[70]">
        <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
          <View className="flex items-center">
            <Animated.Text
              entering={FadeInUp.duration(1000).springify()}
              className="text-white font-bold tracking-wide text-3xl"
            >
              Sign Up
            </Animated.Text>
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
                entering={FadeInDown.duration(1000).springify()}
                className="bg-white p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Phone"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  placeholderTextColor={"gray"}
                  keyboardType="numeric"
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
                <Text className="text-white text-center">
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
