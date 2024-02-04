import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SignIn } from "../api/auth";
import storage from "../utils/storage";

function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    storage
      .load({ key: "user" })
      .then((res) => {
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  return (
    <View className="bg-white h-full w-full items-center">
      <StatusBar backgroundColor="#DEE9FD" style="light" />
      <SafeAreaView className="bg-[#DEE9FD] h-[93%] p-5 w-full lg:w-6/12 items-center rounded-b-[70px] shadow-md shadow-gray-500">
        <Toast />
        <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
          <View className="flex items-center">
           
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
                  onPress={() => {
                    SignIn(email, password, navigation);
                  }}
                  className="bg-[#3170E8] w-full p-3 rounded-2xl mb-3"
                >
                  <Text className="text-xl font-bold text-white text-center">
                    Login
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
              >
                <Text className="text-gray-600 text-center">
                  Don't have an account?{" "}
                  <Text
                    onPress={() => navigation.navigate("Signup")}
                    className="text-[#3170E8]"
                  >
                    Sign Up
                  </Text>
                </Text>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width:'50%',
  }
}) 

export default LoginScreen;
