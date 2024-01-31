import { StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import storage from "../utils/storage";

interface ProfileScreenProps {
	navigation: any;
	value: string;
	onChangeText: (text: string) => void;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
	secureTextEntry?: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
	navigation,
	value,
	onChangeText,
	autoCapitalize = "none",
	keyboardType = "default",
	secureTextEntry = false
}) => {
	const [fullName, setFullName] = useState("");
	const [email, setEMail] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const getUserData = async () => {
			const dataString = await storage.load({ key: "user" });
			const data = JSON.parse(dataString);
			setEMail(data.email);
			setFullName(data.fullName);
			setPhone(data.phone);
		};

		getUserData();
	}, []);

	return (
		<View className="mt-6 bg-[#DEE9FD]">
			<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-6 p-5 -mb-6">
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className="flex-col justify-center my-5">
						<Text className="text-2xl text-gray-600 text-center font-bold">Profile</Text>
						<View className="mt-4">
							<Text className="text-md text-gray-500">Nama Lengkap</Text>
							<Text className="text-xl border-b-2 border-b-gray-500 py-2">{fullName}</Text>
							{/* <TextInput
								value={value}
								onChangeText={onChangeText}
								placeholder={fullName}
								autoCapitalize={autoCapitalize}
								editable={false}

								keyboardType={keyboardType}
								secureTextEntry={secureTextEntry}
							/> */}
						</View>
						<View className="mt-4">
							<Text className="text-md text-gray-500">Alamat Email</Text>
							<Text className="text-xl border-b-2 border-b-gray-500 py-2">{email}</Text>

              {/* <TextInput
								value={email}
								
								onChangeText={onChangeText}
								placeholder={email}
								autoCapitalize={autoCapitalize}
								keyboardType="email-address"
								secureTextEntry={secureTextEntry}
								editable={false}
							/> */}
						</View>
						<View className="mt-4">
							<Text className="text-md text-gray-500">Nomor Telepon</Text>
							<Text className="text-xl border-b-2 border-b-gray-500 py-2">{phone}</Text>

							{/* <TextInput
								value={value}
								onChangeText={onChangeText}
								placeholder={phone}
								autoCapitalize={autoCapitalize}
								keyboardType="phone-pad"
								editable={false}

								secureTextEntry={secureTextEntry}
							/> */}
						</View>
						
					</View>
					<View className="flex justify-center items-center">
						<TouchableOpacity
							onPress={async () => {
								await storage.remove({ key: "user" });
								await storage.remove({ key: "token" })
								await storage.save({ key: "isLoggedin", data: false });

								navigation.navigate("Login");
							}}
							className="bg-[#DEE9FD] w-full p-3 rounded-2xl mb-3">
							<Text className="text-xl font-bold text-gray-600 text-center">Logout</Text>
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
		marginBottom: 8
	},
});

export default ProfileScreen;
