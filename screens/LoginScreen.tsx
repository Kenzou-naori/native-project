import { SignIn } from "../api/auth";

import storage from "../utils/storage";

import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import Toast from "react-native-toast-message";

import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

function LoginScreen({ navigation }: { navigation: any }) {
	const [email, setEMail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		const isLoggedIn = async () => {
			// check if user is logged in
			const isLoggedIn = await storage.load({ key: "isLoggedin" }).catch(_ => {
				return false;
			});

			if (isLoggedIn) {
				storage.load({ key: "user" }).then(res => {
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
		<View className="bg-white h-full w-full items-center lg:bg-[#DEE9FD]">
			<StatusBar backgroundColor="#DEE9FD" style="light" />
			<View className="bg-[#DEE9FD] h-[93%] p-5 w-full lg:w-6/12 items-center rounded-b-[70px] shadow-md shadow-gray-500">
				<Toast />
				<ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
					<View className="flex items-center">
						<Animated.Image
							className="w-96 h-96"
							entering={FadeInUp.duration(1000).springify()}
							source={require("../assets/images/work.png")}
						/>
					</View>

					{/* title and form */}

					<View className="flex justify-around w-full">
						{/* Form */}
						<View className="flex items-center mx-5 space-y-4">
							<Animated.View
								entering={FadeInDown.duration(1000).springify()}
								className="p-5 w-full bg-white rounded-2xl">
								<TextInput
									placeholder="Email"
									value={email}
									onChangeText={text => setEMail(text)}
									placeholderTextColor={"gray"}
									keyboardType="email-address"
								/>
							</Animated.View>
							<Animated.View
								entering={FadeInDown.delay(200).duration(1000).springify()}
								className="p-5 w-full bg-white rounded-2xl">
								<TextInput
									placeholder="Password"
									value={password}
									onChangeText={text => setPassword(text)}
									placeholderTextColor={"gray"}
									secureTextEntry
								/>
							</Animated.View>
							<Animated.View className="w-full" entering={FadeInDown.delay(400).duration(1000).springify()}>
								<TouchableOpacity
									onPress={() => {
										SignIn(email, password, navigation);
									}}
									className="bg-[#3170E8] w-full p-3 rounded-2xl mb-3">
									<Text className="text-xl font-bold text-center text-white">Login</Text>
								</TouchableOpacity>
							</Animated.View>
						</View>
					</View>
				</ScrollView>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		width: "50%"
	}
});

export default LoginScreen;
