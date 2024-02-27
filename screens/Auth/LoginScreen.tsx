import { SignIn } from "../../api/auth";

import storage from "../../utils/storage";

import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEMail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isLoggedIn = async () => {
      // check if user is logged in
      const isLoggedIn = await storage
        .load({ key: "isLoggedin" })
        .catch((_) => {
          return false;
        });

      if (isLoggedIn) {
        storage.load({ key: "user" }).then((res) => {
          const user = JSON.parse(res);
          if (user.accessLevel === 1) {
            navigation.navigate("Admin");
          } else if (user.accessLevel === 2) {
            navigation.navigate("HRD");
          } else {
            navigation.navigate("Home");
          }
        });
      } else {
        return;
      }
    };

    isLoggedIn();

    const interval = setInterval(() => {
      isLoggedIn();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="h-full w-full items-center bg-[#DEE9FD] lg:bg-[#DEE9FD]">
      <StatusBar backgroundColor="#DEE9FD" style="dark" />
      <View className="w-full items-center lg:w-6/12 ">
        <Toast />
        <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
          <View className="flex items-center">
            <Animated.Image
              className="h-96 w-96"
              entering={FadeInUp.duration(1000).springify()}
              source={require("../../assets/images/work.png")}
            />
          </View>

          {/* title and form */}

          <View className="w-full justify-around">
            {/* Form */}
            <View className="mx-5 items-center space-y-4">
              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className="w-full rounded-2xl bg-white p-5"
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
                className="w-full rounded-2xl bg-white p-5"
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
                  className="mb-3 w-full rounded-2xl bg-[#3170E8] p-3"
                >
                  <Text className="text-center text-xl font-bold text-white">
                    Login
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default LoginScreen;
